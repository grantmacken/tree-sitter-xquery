const PREC = {
    primary: 23,
    unarylookup: 22,
    predicate: 21,
    lookup: 20,
    path: 19,
    bang: 18,
    unary: 17,
    arrow: 16,
    cast: 15,
    castable: 14,
    treat: 13,
    instance: 12,
    intersect: 11,
    union: 10,
    multiplicative: 9,
    additive: 8,
    range: 7,
    concat: 6,
    comparison: 5,
    and: 4,
    or: 3,
    statement: 2,
    comma: 1
  },
  DIGIT = /[0-9]/,
  WHITESPACE = /[\u000d\u000a\u0020\u0009]/,
  INTEGER = repeat1(DIGIT),
  DOUBLE = seq(
    repeat(DIGIT),
    optional(seq('.', repeat(DIGIT))),
    /[eE]/,
    optional(/[+-]/),
    repeat1(DIGIT)
  ), // TODO check
  DECIMAL = seq(repeat(DIGIT), '.', repeat(DIGIT)),
  //https://github.com/bwrrp/slimdom.js/blob/main/src/util/namespaceHelpers.ts#L132
//var xmlName = /^\p{L}[\p{L}0-9\-.]*(:[\p{L}0-9\-.]+)?$/u;
  NAME_START_CHAR = /[^.\-,;:!?'"()\[\]\{\}@*/\\\&#%`\^+<>|\~\s\d]/,
  NAME_CHAR = /[^,;:!?.'"()\[\]\{\}@*/\\\&#%`\^+<>|\~\s\d]/,
  EscapeApos = "''",
    EscapeQuote = '""',
    PredefinedEntityRef = seq(
      '&',
      choice('lt', 'gt', 'amp', 'quot', 'apos'),
      ';'
    ),
    CharRef = choice(
      seq('&#', repeat1(/[0-9]/), ';'),
      seq('&#x', repeat1(/[0-9a-fA-F]/), ';')
    )
module.exports = grammar({
  name: 'xquery',
  extras: $ => [$.comment, /\s/],
  word: $ => $.keyword,
  conflicts: $ => [ 
    [$.function_call, $._name_test]
  ],
  supertypes: $ => [$._primary, $._statement, $._binary_expr],
  rules: {
    module: $ =>
      seq(
        optional($.version_declaration),
        choice($._library_module, $._main_module)
      ),
    _library_module: $ => seq($.module_declaration, $._prolog),
    _main_module: $ => seq(optional($._prolog), $._query_body),
    _prolog: $ =>
      seq(
        repeat(
          choice(
            $.default_namespace_declaration,
            // setter
            $.boundary_space_declaration,
            $.default_collation_declaration,
            $.base_uri_declaration,
            $.construction_declaration,
            $.ordering_mode_declaration,
            $.empty_order_declaration,
            $.copy_namespaces_declaration,
            $.decimal_format_declaration,
            // namespace and imports
            $.namespace_declaration,
            $.schema_import,
            $.module_import
          )
        ),
        repeat1(
          choice(
            $.context_item_declaration,
            $.variable_declaration,
            $.function_declaration,
            $.option_declaration
          )
        )
      ), // 6 TODO:
    _query_body: $ => seq($._expr, optional( repeat(seq( prec.left(PREC.comma,','), $._expr)))),
    // in xQuery everything is an expression
    // 1. primary  -- can stand alone as single expr
    // 2. unary    -- operator with rhs expr
    // 3. binary   --  (rhs expr) operator (lhs expr)
    _expr: $ =>
       prec.left(seq( choice(
        //seq($._primary, optional($._postfix_expr)), // 121
        $._primary, // 121
        $._statement, // precident 2 statement_like expr
        $._binary_expr, // lhs expr op rhs expr
        //$.unary_expr, // prefix  // 97 prec: 21 rl
        //$.path_expr, //108 prec: 19 lr
        $.bang_expr, //107 prec: 18 l
        $.arrow_expr, // 96 prec: 16 lr
        $.cast_as_expr, // 95 prec: 15 lr
        $.castable_as_expr, // 94 prec: 14 lr
        $.treat_expr, // 93 prec: 13 lr
        $.instance_of_expr, // 92 prec: 12 lr
        $.string_concat_expr, // 86 prec: 6 lr
      ),
       optional($.path_expr), //108 prec: 19 lr
       )),
    _statement: $ => prec.left(PREC.statement,choice(
      $.flwor_expr, // prec 2
      $.quantified_expr, // prec 2
      $.switch_expr, // prec 2
      $.if_expr, // prec 2
      $.typeswitch_expr, // prec 2
      $.try_catch_expr  // prec 2
    )),
    // 3.1 Primary Expressions
    _primary: $ => prec.left(PREC.primary,choice(
      $._literal, // 57
      $.var_ref, // 59
      $.parenthesized_expr, // 133
      $.context_item_expr, // 134
      $.function_call, // 137
      $.named_function_ref, // function item
      $.inline_function_expr, // function item
      $.ordered_expr,
      $.unordered_expr,
      $.computed_constructor, // node constructors
      $._direct_constructor, // node constructors
      $.string_constructor,
      $.map_constructor, // 170
      $._array_constructor,
      $.unary_lookup // 174
    )),
    // 3.1.1 Literals
    _literal: $ => choice($.string_literal, $._numeric_literal),
    string_literal: $ =>
      choice(
        // TODO? might turn predefined etc into tokens
        token(
          seq(
            '"',
            repeat(choice(PredefinedEntityRef, CharRef, EscapeQuote, /[^"&]/)),
            '"'
          )
        ),
        token(
          seq(
            "'",
            repeat(choice(PredefinedEntityRef, CharRef, EscapeApos, /[^'&]/)),
            "'"
          )
        )
      ),
    _numeric_literal: $ =>
      choice($.integer_literal, $.decimal_literal, $.double_literal),
    //3.1.2 Variable References
    var_ref: $ => seq('$', field('var_name', alias($.var_name, $.EQName))),
    //ref: $ => choice( /[_A-Za-z]{1}[\-\w]*(:[_A-Za-z]{1}[\-\w]*)*/, $.uri_qualified_name),
    // 3.1.3 Parenthesized Expressions
    parenthesized_expr: $ => prec(PREC.comma, seq('(', commaSep($._expr), ')')), // 133
    //3.1.4 Context Item Expression
    context_item_expr: $ => '.',
    //3.1.5 Static Function Calls
    function_call: $ =>
      seq(
        field('function_name', $.EQName),
        field('arguments', $.argument_list)
      ), // 137
    // 3.1.6 Named Function References
    named_function_ref: $ =>
      seq(
        field('function_name', $.EQName),
        field('delimiter', '#'),
        field('signature', $.integer_literal)
      ),
    // 3.1.7 Inline Function Expr
    // https://github.com/tree-sitter/tree-sitter/blob/master/docs/section-4-syntax-highlighting.md
    inline_function_expr: $ =>
      seq(
        // optional( $.annotation ),
        'function',
        field('parameters', $.param_list),
        field('result_type', optional(seq('as', $.sequence_type))),
        field('body', $.enclosed_expr)
      ), // 169
    param_list: $ => seq('(', commaSep($.param), ')'),
    param: $ =>
      seq(
        field('param_name', seq('$', $.EQName)),
        optional(field('param_type', seq('as', $.sequence_type)))
      ),
    // 3.1.8 Enclosed Expressions
    enclosed_expr: $ => prec(PREC.comma, seq('{', commaSep($._expr), '}')), // 5
    // 3.2 Postfix Expressions TODO
    _postfix_expr: $ => repeat1(choice($.predicate, $.argument_list, $.unary_lookup)), // 49
    // 3.2.1 Filter Expressions TODO tests
    predicate: $ => 
       prec(PREC.predicate, 
      seq( 
        '[', 
        field('body', $._expr), 
        ']')
    ), //124
    // 3.2.2 Dynamic Function Calls
    argument_list: $ => seq('(', commaSep($.argument), ')'), // 122
    argument: $ => choice($._expr, $.argument_placeholder), // 138
    argument_placeholder: $ => token('?'), //  139
    // 3.3 Path Expressions
    // https://docs.oracle.com/cd/E13190_01/liquiddata/docs81/xquery/query.html
    path_expr: $ => prec.left(prec(PREC.path, 
      choice(
        seq('/', optional($.relative_path_expr)), //parse-note-leading-lone-slash
        seq( '//', $.relative_path_expr ),
        $.relative_path_expr
      )
    )),
    relative_path_expr: $ => prec.left(seq($.step_expr, optional( seq( choice('/', '//'), $.step_expr) ))), //109 
    step_expr: $ =>  prec.right(choice( $._axis_step , $._postfix_expr)),
    _axis_step: $ => prec.left(seq(choice($._reverse_step, $._forward_step),optional(repeat($.predicate)))), // 111 124
    _forward_step: $ => choice(seq($.forward_axis, $._node_test), $.abbrev_forward_step), // 112
    abbrev_forward_step: $ => seq(optional($.abbrev_attr), $._node_test), // 117
    abbrev_attr: $ => '@',
    // 3.3.2.1 Axes
    forward_axis: $ =>
      seq(
        field(
          'axis',
          alias(
            choice(
              'child',
              'descendant',
              'attribute',
              'self',
              'descendant-or-self',
              'following-sibling',
              'following'
            ),
            $.keyword
          )
        ),
        '::'
      ), //113
    _reverse_step: $ =>
      choice(seq($._reverse_axis, $._node_test), $.abbrev_reverse_step), // 115
    _reverse_axis: $ =>
      seq(
        field(
          'axis',
          alias(
            choice(
              'parent',
              'ancestor',
              'preceding-sibling',
              'preceding',
              'ancestor-or-self'
            ),
            $.keyword
          )
        ),
        '::'
      ), //116
    abbrev_reverse_step: $ => token('..'), // 117
    //3.3.2.2 Node Tests
    _node_test: $ =>
      choice(
        $._kind_test,
        field('node_name_test', $._name_test)
      ), // 118'
    _binary_expr: $ => choice(
      $.range_expr, // 87 prec: 7 na 
      $.union_expr, // 90 prec:  10 lr
      $.intersect_except_expr, // 91 prec: 11 lr
      $.additive_expr, // 88 prec: 8 lr
      $.multiplicative_expr, // 89 prec: 9 lr
      $.comparison_expr, // 85 prec: 5
      $.and_expr, // 84 prec: 4
      $.or_expr // 83 prec: 3
    ),
    range_expr: $ => prec.left( PREC.range,seq( field('lhs', $._expr),  seq( 'to', field('rhs', $._expr)))),
    union_expr: $ => prec.left( PREC.union,seq( field('lhs', $._expr), choice('union','|' ), field('rhs', $._expr))),
    intersect_except_expr: $ => prec.left( PREC.intersect,seq( field('lhs', $._expr), choice('intersect','except'), field('rhs', $._expr))),
    additive_expr: $ => prec.left( PREC.additive,seq( field('lhs', $._expr), choice('+','-' ), field('lhs', $._expr))),
    multiplicative_expr: $ => prec.left( PREC.multiplicative, seq( field('lhs', $._expr), choice('*','div','idiv','mod'), field('rhs', $._expr))),
    comparison_expr: $ => prec.left( PREC.comparison,seq(field('lhs',$._expr),choice('eq','ne','lt','le','gt','ge','=','!=','<','<=','>','>=','is','<<','>>'),field('rhs',$._expr))),
    and_expr: $ => prec.left( PREC.and,seq( field('lhs', $._expr), 'and', field('rhs', $._expr))),
    or_expr: $ => prec.left( PREC.or,seq( field('lhs', $._expr), 'or', field('rhs', $._expr))),
    unary_expr: $ =>
      prec.right(
        PREC.unary,
        seq(field('operator', $.unary_op), field('operand', $._primary))
      ), // 97 choice primary | postfix
    unary_op: $ => choice(token('+'), token('-')),
    // 3.6 String Concatenation Expressions
    string_concat_expr: $ => prec.left( PREC.concat,
      seq(
        field('lhs', $._expr),
        repeat1(seq('||',field('rhs', $._expr)))
      )), // 86
     // 3.8 Logical Expressions
      //3.9 Node Constructors
    node_constructor: $ =>
      choice($.computed_constructor, $._direct_constructor),
    // 3.9.1 Direct Element Constructors
    _direct_constructor: $ =>
      choice(
        $.direct_element
        // $.direct_element
        // TODO dir_comment_constructor,
        // TODO dir_pi_constructor
      ), //141  TODO
    _direct_element_content: $ => choice($.direct_element, $._element_text),
    direct_element: $ =>
      choice(
        seq($.start_tag, repeat($._direct_element_content), $.end_tag),
        $.empty_tag
      ),
    start_tag: $ =>
      seq(
        '<',
        field('name', $._QName),
        repeat(field('attribute', $.direct_attribute)),
        '>'
      ),
    end_tag: $ => seq('</', field('name', $._QName), '>'),
    empty_tag: $ =>
      seq(
        '<',
        field('name', $._QName),
        repeat(field('attribute', $.direct_attribute)),
        '/>'
      ),

    direct_attribute: $ =>
      seq(field('name', $._QName), '=', field('value', $.string_literal)),
    _element_text: $ =>
      prec.left(
        repeat1(
          choice(
            $.predefined_entity_ref,
            $.char_ref,
            $.escape_curly,
            $.enclosed_expr,
            $.char_data
          )
        )
      ),
    char_data: $ => /[^{}<&]+/,
    char_ref: $ =>
      choice(
        seq('&#', repeat1(/[0-9]/), ';'),
        seq('&#x', repeat1(/[0-9a-fA-F]/), ';')
      ),
    escape_curly: $ => choice('{{', '}}'),
    predefined_entity_ref: $ =>
      seq('&', choice('lt', 'gt', 'amp', 'quot', 'apos'), ';'),
    // 3.9.3 Computed Constructors TODO make Computed Constructors a supertype
    computed_constructor: $ =>
      choice(
        $._document_text_comment_constructor,
        $._element_attr_constructor,
        $._namespace_constructor,
        $._pi_constructor
      ), // 155
    _document_text_comment_constructor: $ =>
      seq(
        field(
          'constructor',
          alias(choice('document', 'text', 'comment'), $.keyword)
        ),
        field('content', $.enclosed_expr)
      ), // 156 164 165
    _element_attr_constructor: $ =>
      seq(
        field('constructor', alias(choice('element', 'attribute'), $.keyword)),
        field('name_expr', choice($.EQName, seq('{', commaSep($._expr), '}'))),
        field('content', $.enclosed_expr)
      ), // 157 159
    _pi_constructor: $ =>
      seq(
        field('constructor', alias('processing-instruction', $.keyword)),
        field('name_expr', choice($.NCName, seq('{', commaSep($._expr), '}'))),
        field('content', $.enclosed_expr)
      ), // 166
    _namespace_constructor: $ =>
      seq(
        field('constructor', alias('namespace', $.keyword)),
        field('name_expr', choice($.NCName, $.enclosed_expr)),
        field('content', $.enclosed_expr)
      ), // 160
    //3.10 String Constructors TODO
    string_constructor: $ => seq('``[', repeat($._string_content), ']``'), // 177
    // TODO this is not correct  string content is external in other tree sitters
    _string_content: $ => prec.right(choice($.char_group, $.interpolation)),
    char_group: $ => prec.left(repeat1(/(\w|\s)+/)),
    interpolation: $ => seq('`{', commaSep($._expr), '}`'), // 180',
    //3.11 Maps and Arrays
    map_constructor: $ => seq('map',field('body',seq('{',commaSep($.map_entry),'}'))),//170
    map_entry: $ => seq(field('key', $._expr), ':', field('value', $._expr)),
    // 3.11.2 Arrays
    _array_constructor: $ =>
      choice($.curly_array_constructor, $.square_array_constructor), // 174 TODO ,
    curly_array_constructor: $ =>
      seq(
        field('constructor', alias('array', $.keyword)),
        field('content', $.enclosed_expr)
      ),
    square_array_constructor: $ => seq('[', commaSep($._expr), ']'),
    //3.11.3.1 Unary Lookup
    unary_lookup: $ => prec.right( PREC.unarylookup, seq( '?', $._key_specifier)),
    _key_specifier: $ => choice($.NCName, $.lookup_digit, $.parenthesized_expr, $.lookup_wildcard), // 54
    lookup_digit: $ => repeat1(/\d/),
    lookup_wildcard: $ => '*',
    //##########################
    // 3.12 FLWOR Expressions
    flwor_expr: $ =>
      seq($._initial_clause, optional($._intermediate_clause), $.return_clause), // 41
    _initial_clause: $ =>
      choice(
        $.for_clause, // 44
        $.let_clause // 48
      ),
    //3.12.2 For Clause
    for_clause: $ => seq('for', commaSep($.for_binding)), // 44',
    for_binding: $ =>
      seq(
        '$',
        field('var_name', $.EQName),
        optional($.type_declaration),
        optional(seq('allowing', 'empty')),
        optional(seq('at', '$', field('at_var_name', $.EQName))),
        'in',
        $._expr
      ), // 45
    // 3.12.3 Let Clause
    let_clause: $ => seq('let', commaSep1($.let_binding)),
    let_binding: $ =>
      seq(
        '$',
        field('var_name', $.EQName),
        optional($.type_declaration),
        ':=',
        $._expr
      ),
    _intermediate_clause: $ =>
      repeat1(
        choice(
          $._initial_clause,
          $.where_clause,
          $.group_by_clause,
          $.order_by_clause,
          $.count_clause
        )
      ), // 43',
    // 3.12.4 Window Clause
    //3.12.5 Where Clause
    where_clause: $ => seq('where', $._expr), // 60
    // 3.12.6 Count Clause
    count_clause: $ => seq('count', '$', field('var_name', $.EQName)), //   59
    // 3.12.7 Group By Clause
    group_by_clause: $ => seq('group', 'by', commaSep1($._grouping_spec)), // 61
    _grouping_spec: $ =>
      seq(
        '$',
        field('var_name', $.EQName),
        optional(seq(optional($.type_declaration), ':=', $._expr)),
        optional(seq('collation', field('uri', $.string_literal)))
      ), // 63
    // 3.12.8 Order By Clause
    order_by_clause: $ =>
      prec.left(
        seq(
          choice(seq('order', 'by'), seq('stable', 'order', 'by')),
          commaSep($._order_spec)
        )
      ), // 65
    _order_spec: $ =>
      seq(
        field('order_expr', $._expr),
        field(
          'order_modifier',
          optional(seq(choice('ascending', 'descending'))),
          optional(seq('empty', choice('greatest', 'least'))),
          optional(seq('collation', field('uri', $.string_literal)))
        )
      ),
    //3.12.9 Return Clause
    return_clause: $ => seq('return', $._expr), // 69
    // end flwor
    // ++++++++++++++++++++++++++++++++++++++++++++++++++
    // 3.13 Ordered and Unordered Expressions
    ordered_expr: $ => seq('ordered', $.enclosed_expr), // 135
    unordered_expr: $ => seq('unordered', $.enclosed_expr), // 136
    // 3.14 Conditional Expressions
    if_expr: $ =>
      prec.left(
        PREC.statement,
        seq($.if_condition, $.then_consequence, $.else_alternative)
      ),
    if_condition: $ => seq('if', '(', $._expr, ')'),
    then_consequence: $ => seq('then', $._expr),
    else_alternative: $ => seq('else', $._expr),
    // 3.15 Switch Expression
    switch_expr: $ =>
      prec(
        PREC.statement,
        seq(
          'switch',
          $.switch_value,
          repeat1($.switch_clause),
          $.switch_default
        )
      ), // 71
    switch_value: $ => seq('(', commaSep1($._expr), ')'), // 72
    switch_clause: $ =>
      seq(
        'case',
        field('operand', $._expr),
        'return',
        field('return', $._expr)
      ), // 72
    switch_default: $ => seq('default', 'return', field('return', $._expr)),
    // 3.16 Quantified Expressions
    quantified_expr: $ =>
      prec(
        PREC.statement,
        seq(
          choice('some', 'every'),
          repeat1($.quantified_in),
          $.quantified_satisfies
        )
      ),
    quantified_in: $ =>
      seq($.var_ref, optional($.type_declaration), 'in', $._expr),
    quantified_satisfies: $ => seq('satisfies', $._expr),
    // 3.17 Try/Catch Expressions
    try_catch_expr: $ =>
      prec(PREC.statement, seq($.try_clause, $.catch_clause)), // 78
    try_clause: $ => seq('try', $.enclosed_expr), // 78
    catch_clause: $ => seq('catch', $.catch_error_list, $.enclosed_expr), // 79
    catch_error_list: $ => barSep1($._name_test),
    // 3.18 Expressions on SequenceTypes
    // 3.18.1 Instance Of
    instance_of_expr: $ =>
      prec.left(
        PREC.instance,
        seq(
          field('lhs', $._expr),
          seq('instance','of'),
          field('rhs', $.sequence_type)
        )
      ), // 92
    // 3.18.2
    typeswitch_expr: $ =>
      prec.left(
        PREC.statement,
        seq(
          'typeswitch',
          $.typeswitch_operand,
          repeat1($.typeswitch_clause),
          $.typeswitch_default
        )
      ),
    // commaSep1( $._expr ),
    typeswitch_operand: $ =>
      seq('(', field('operand', commaSep1($._expr)), ')'), // 72
    typeswitch_clause: $ =>
      seq($.typeswitch_case_type, $.typeswitch_case_return), // 72
    typeswitch_case_type: $ =>
      seq('case', optional(seq($.var_ref, 'as')), $.sequence_type),
    typeswitch_case_return: $ => seq('return', $._expr),
    typeswitch_default: $ =>
      seq('default', optional($.var_ref), 'return', $._expr),
    //3.18.3 Cast
    cast_as_expr: $ =>
      prec(
        PREC.cast,
        seq(
          field('lhs', $._expr),
          seq('cast', 'as',
          field('rhs', $.single_type)
        )
      )), // 95
    //3.18.4 Castable
    castable_as_expr: $ =>
      prec(
        PREC.castable,
        seq(
          field('lhs', $._expr),
          seq('castable', 'as'),
          field('rhs', $.single_type)
        )
      ), // 94
    single_type: $ => prec.left(seq(field('simple_type_name', $.EQName), optional('?'))),
    //3.18.5 Constructor Functions TODO
    //3.18.6 Treat
    treat_expr: $ =>
      prec(
        PREC.treat,
        seq(
          field('lhs', $._expr),
          seq('treat', 'as'),
          field('rhs', $.sequence_type)
        )
      ), // 92
    // 3.19 Simple map operator (!)
    bang_expr: $ => prec.left( PREC.bang,
        seq(
          field('lhs', $._primary), // TODO
          repeat1( seq( '!', field('rhs', $._primary)
        )))
      ), // 107
    // 3.20 Arrow operator (=>)
    arrow_expr: $ =>
      prec.left(
        PREC.arrow,
        seq(
          field('rhs', $._expr),
          repeat1( seq( '=>', field('lhs', $.arrow_function_specifier))
        )
      )), // 94
    arrow_function_specifier: $ =>
      seq(choice($.EQName, $.var_ref, $.parenthesized_expr), $.argument_list),
    // 3.21 Validate Expressions TODO
    // 3.22 Extension Expressions TODO
    //4.1 Version Declaration
    version_declaration: $ =>
      seq('xquery', choice($._encoding, $._version, $._version_encoding), ';'),
    _encoding: $ => seq('encoding', $.string_literal),
    _version: $ => seq('version', $.string_literal),
    _version_encoding: $ => seq($._version, $._encoding),
    //4.2 Module Declaration
    module_declaration: $ =>
      seq(
        'module',
        'namespace',
        field('name', $.NCName),
        '=',
        field('value', $.string_literal),
        ';'
      ), // 5
    // 4.3 Boundary-space Declaration
    boundary_space_declaration: $ =>
      seq('declare', 'boundary-space', choice('preserve', 'strip'), ';'),
    // 4.4 Default Collation Declaration
    default_collation_declaration: $ =>
      seq(
        'declare',
        'default',
        'collation',
        field('uri', $.string_literal),
        ';'
      ),
    // 4.5 Base URI Declaration
    base_uri_declaration: $ =>
      seq('declare', 'base-uri', field('uri', $.string_literal), ';'),
    //4.6 Construction Declaration
    construction_declaration: $ =>
      seq('declare', 'construction', choice('preserve', 'strip'), ';'),
    // 4.7 Ordering Mode Declaration
    ordering_mode_declaration: $ =>
      seq('declare', 'ordering', choice('ordered', 'unordered'), ';'),
    // 4.8 Empty Order Declaration
    empty_order_declaration: $ =>
      seq(
        'declare',
        'default',
        'order',
        'empty',
        choice('greatest', 'least'),
        ';'
      ),
    // 4.9 Copy-Namespaces Declaration
    copy_namespaces_declaration: $ =>
      seq(
        'declare',
        'copy-namespaces',
        choice('preserve', 'no-preserve'),
        ',',
        choice('inherit', 'no-inherit'),
        ';'
      ),
    // 4.10 Decimal Format Declaration
    decimal_format_declaration: $ =>
      seq(
        'declare',
        choice(
          seq('decimal-format', $.EQName),
          seq('default', 'decimal-format')
        ),
        optional(
          seq(
            field('name', $.df_property_name),
            '=',
            field('name', $.string_literal)
          )
        ),
        ';'
      ),
    df_property_name: $ =>
      choice(
        'decimal-separator',
        'grouping-separator',
        'infinity',
        'minus-sign',
        'NaN',
        'percent',
        'per-mille',
        'zero-digit',
        'digit',
        'pattern-separator',
        'exponent-separator'
      ),
    //4.11 Schema Import
    schema_import: $ =>
      seq(
        'import',
        'schema',
        optional($.schema_prefix),
        field('uri', $.string_literal),
        optional(seq('at', commaSep1($.string_literal))),
        ';'
      ), // 21
    schema_prefix: $ =>
      choice(
        seq('namespace', $.NCName, '='),
        seq('default', 'element', 'namespace')
      ), //22',
    // 4.12 Module Import // TODO
    module_import: $ =>
      seq(
        'import',
        'module',
        optional(seq('namespace', $.NCName, '=')),
        field('uri', $.string_literal),
        optional(seq('at', commaSep1($.string_literal))),
        ';'
      ),
    //4.13 Namespace Declaration
    namespace_declaration: $ =>
      seq(
        'declare',
        'namespace',
        field('name', $.NCName),
        '=',
        field('uri', $.string_literal),
        ';'
      ), // 24
    //4.14 Default Namespace Declaration
    default_namespace_declaration: $ =>
      seq(
        'declare',
        'default',
        choice('element', 'function'),
        'namespace',
        field('uri', $.string_literal),
        ';'
      ), // 24

    //4.15 Annotations
    annotation: $ =>
      seq(
        '%',
        field('name', $.EQName),
        field('body', optional(seq('(', commaSep($.string_literal), ')')))
      ), // 27
    // 4.16 Variable Declaration
    variable_declaration: $ =>
      seq(
        'declare',
        optional(repeat1($.annotation)),
        'variable',
        '$',
        field('var_name', $.EQName),
        field('var_type', optional(seq('as', $.sequence_type))),
        ':=',
        field('var_value', $._expr),
        ';'
      ), // 26
    // 4.17 Context Item Declaration
    context_item_declaration: $ =>
      seq(
        'declare',
        'context',
        'item',
        optional($.type_declaration),
        optional(
          choice(
            seq(':=', field('var_value', $._expr)),
            seq(
              'external',
              optional(seq(':=', field('var_default_value', $._expr)))
            )
          )
        ),
        ';'
      ),

    // 4.18 Function Declaration
    function_declaration: $ =>
      seq(
        'declare',
        optional(repeat1($.annotation)),
        'function',
        field('name', $.EQName),
        field('params', $.param_list),
        field('result', optional(seq('as', $.sequence_type))),
        field('body', choice($.enclosed_expr, 'external')),
        ';'
      ),
    //4.19 Option Declaration
    option_declaration: $ =>
      seq(
        'declare',
        'option',
        field('name', $.EQName),
        field('value', $.string_literal),
        ';'
      ),

    // 2.5.4 SequenceType Syntax
    type_declaration: $ => seq('as', $.sequence_type),
    sequence_type: $ => prec.left(choice($.empty_sequence, $._item)), // 184
    empty_sequence: $ => seq('empty-sequence','(', ')'),
    _item: $ => prec.right(seq($._item_type, optional($.occurrence_indicator))),
    _item_type: $ =>
      choice(
        $._kind_test,
        $.any_item,
        $.any_function_test,
        $.typed_function_test,
        $.any_map_test,
        $.typed_map_test,
        $.any_array_test,
        $.typed_array_test,
        $.atomic_or_union_type
        // $.parenthesized_item_type TODO
      ), // 186
    occurrence_indicator: $ => choice('?', '*', '+'), // 185
    atomic_or_union_type: $ => $.EQName, // 187
    any_item: $ => seq('item', '(', ')'),
    _kind_test: $ =>
    choice(
      $.document_test,
      $.element_test,
      $.attribute_test,
      $.schema_element_test,
      $.schema_attribute_test,
      $.pi_test,
      //  simple test SUT()
      $.any_kind_test,
      $.comment_test,
      $.namespace_node_test,
      $.text_test
    ),
    any_kind_test: $ => seq(field('type_identifier', alias('node', $.keyword)),'(',')'), // 189
    text_test: $ => seq(field('type_identifier', alias('text', $.keyword)),'(',')'), // 191
    comment_test: $ => seq(field('type_identifier', alias('comment', $.keyword)),'(',')'), // 192
    namespace_node_test: $ => seq(field('type_identifier', alias('namespace-node', $.keyword)),'(',')'), // 193
    document_test: $ =>
      seq(
        field('type_identifier', alias('document-node', $.keyword)),
        '(',
        optional(choice($.element_test, $.schema_element_test)),
        ')'
      ), // 190
    // wildcard - element() same as element(*)
    element_test: $ =>
    seq(
      field('type_identifier', alias('element', $.keyword)),
      field('type_params', 
        seq(
          '(',
          optional( 
            $.element_test_params
            ),
          ')'
        ))
    ), // 199
    element_test_params: $ =>
    seq(
      field('param', choice(alias('*', $.wildcard), $.EQName)),
      optional(
        seq(
          ',',
          field(
            'param',
            seq($.EQName, optional(alias('?', $.occurrence_indicator)))
          )
        )
      )),
    // same as element but no nilled test as attributes don't have children
    attribute_test: $ =>
      seq(
        field('type_identifier', alias('attribute', $.keyword)),
        field('type_params',  seq( '(',
        optional(
          seq(
            field('param', choice(alias('*', $.wildcard), $.EQName)),
            optional(seq(',', field('param', $.EQName)))
          )
        ),
        ')'
      ))), // 195
    schema_element_test: $ =>
      seq(
        field('type_identifier', alias(choice('schema-element'), $.keyword)),
        '(',
        field('param', $.EQName),
        ')'
      ), //197
    schema_attribute_test: $ =>
      seq(
        field('type_identifier', alias('schema-attribute', $.keyword)),
        '(',
        field('param', $.EQName),
        ')'
      ), //201
    pi_test: $ =>
      seq(
        field('type_identifier', alias('processing-instruction', $.keyword)),
        seq(
          '(',
          optional(field('param', choice($.NCName, $.string_literal))),
          ')'
        )
      ), // 194
    _name_test: $ => choice($.EQName, $.wildcard), // TODO 199
    wildcard: $ =>
      choice(
        alias('*', $.operator),
        seq($.NCName, alias(':*', $.operator)),
        seq(alias('*:', $.operator), $.NCName),
        seq($.braced_uri_literal, alias('*', $.operator))
      ), // 120
    any_function_test: $ =>
      seq(
        optional(field('anno', $.annotation)),
        field('type_identifier', alias('function', $.keyword)),
        seq('(', field('param', alias('*', $.wildcard)), ')')
      ), //  // 207
    typed_function_test: $ =>
      seq(
        optional(field('anno', $.annotation)),
        field('type_identifier', alias('function', $.keyword)),
        '(',
        $.signature_params,
        ')',
        $.signature_return
      ),
    signature_params: $ => commaSep1($.sequence_type),
    signature_return: $ => seq('as', $.sequence_type),
    any_map_test: $ =>
      seq(
        field('type_identifier', alias('map', $.keyword)),
        '(',
        field('param', alias('*', $.wildcard)),
        ')'
      ), // 210
    typed_map_test: $ =>
      seq(
        field('type_identifier', alias('map', $.keyword)),
        '(',
        field('param', $.atomic_or_union_type),
        ',',
        field('param', $.sequence_type),
        ')'
      ), // 212
    any_array_test: $ =>
      seq(
        field('type_identifier', alias('array', $.keyword)),
        '(',
        field('param', alias('*', $.wildcard)),
        ')'
      ),
    typed_array_test: $ =>
      seq(
        field('type_identifier', alias('array', $.keyword)),
        '(',
        field('param', $.sequence_type),
        ')'
      ),
    parenthesized_item_type: $ => seq('(', $._item_type, ')'), // 216
    // END SequenceType Syntax
    integer_literal: $ => token(INTEGER),
    decimal_literal: $ => token(DECIMAL),
    double_literal: $ => token(DOUBLE),
    // instances of the grammatical production EQName.
    // EQName is identifier
    var_name: $ => choice($._QName, $.uri_qualified_name),
    _QName: $ =>
      prec.right(
        choice(
          field('unprefixed', $.identifier),
          seq(
            field('prefix', $.identifier),
            token.immediate(':'),
            field('local_part', $.identifier)
          )
        )
      ),
    EQName: $ =>
      choice(
        seq(
          field('ns_builtin', alias($.ns_builtin, $.identifier)),
          token.immediate(':'),
          field('local_part', $.identifier)
        ),
        $._QName,
        $.uri_qualified_name
      ), // 112
    ns_builtin: $ =>
      choice('xs', 'fn', 'map', 'array', 'math', 'err', 'output'),
    NCName: $ => $.identifier, // 123
    uri_qualified_name: $ => /Q[{][^}\s]+[}][\w]+/, // TODO too simple?
    braced_uri_literal: $ =>
      seq('Q{', repeat1(choice(PredefinedEntityRef, CharRef, /[^&{}]/)), '}'), // 224
    //[A-Za-z_\\xC0-\\xD6][-a-zA-Zα-ωΑ-Ωµ0-9_']*/
    identifier: $ => /[_A-Za-z]{1}[\-\w]*/,
    item_type: $ => $.keyword,
    keyword: $ => /[a-z]+([-][a-z]+)*/,
    kind: $ => 'element',
    operator: $ =>
      choice(
        'to',
        'intersect',
        'except',
        'union',
        '|',
        '+',
        '-',
        '*',
        'div',
        'idiv',
        'mod',
        '=',
        '!=',
        '<',
        '<=',
        '>',
        '>=',
        'eq',
        'ne',
        'lt',
        'le',
        'gt',
        'ge',
        'is',
        '<<',
        '>>',
        'and',
        'or'
      ),
    comment: $ => token(/[(]:[^:]*:*([^(:][^:]*:+)*[)]/)
  }
});

function keyword(word, aliasAsWord = true) {
  let pattern = ''
  for (const letter of word) {
    pattern += `[${letter}${letter.toLocaleUpperCase()}]`
  }
  let result = new RegExp(pattern)
  if (aliasAsWord) result = alias(result, word)
  return result
}

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
function barSep1(rule) {
  return seq(rule, repeat(seq('|', rule)));
}
function barSep(rule) {
  return optional(barSep1(rule));
}
