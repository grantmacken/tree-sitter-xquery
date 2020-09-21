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
  Digit = /[0-9]/,
  Integer = seq(Digit, optional(repeat(Digit))),
  Decimal = choice(seq('.', Integer), seq(Integer, '.', optional(Integer))),
  DecimalExponent = seq(choice('e', 'E'), optional(choice('+', '-')), Integer),
  Double = choice(
    seq(Integer, optional(seq('.', /[0-9]*/)), DecimalExponent),
    seq(seq('.', Integer), DecimalExponent)
  ),
  NameStartChar = /[A-Za-z_]/,
  NameChar = choice(NameStartChar, '-', '.', /[0-9]/),
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
  );

module.exports = grammar({
  name: 'xQuery',
  extras: $ => [$.comment, /\s/],
  word: $ => $.keyword,
  rules: {
    module: $ =>
      seq(
        optional($.version_declaration),
        optional($.comment),
        choice($.library_module, $._main_module)
      ),
    library_module: $ =>
      seq($.module_declaration, optional(repeat1($._prolog))),
    _main_module: $ => seq(optional(repeat1($._prolog)), $._query_body),
    //4.1 Version Declaration
    version_declaration: $ =>
      seq('xquery', $.version, optional($.encoding), ';'),
    // 2
    version: $ => seq('version', $.string_literal),
    encoding: $ => seq('encoding', $.string_literal),
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
    _prolog: $ =>
      choice(
        $.namespace_declaration,
        $.variable_declaration,
        $.function_declaration
      ), // 6
    namespace_declaration: $ =>
      seq(
        'declare',
        'namespace',
        field('name', $.NCName),
        '=',
        field('value', $.string_literal),
        ';'
      ), // 24
    // 4.16 Variable Declaration
    variable_declaration: $ =>
      seq(
        'declare',
        'variable',
        '$',
        field('name', $._EQName),
        ':=',
        field('value', $._expr),
        ';'
      ), // 26 TODO anno etc4.18 Function Declaration4.18 Function Declaration
    function_declaration: $ =>
      seq(
        'declare',
        optional(repeat1($.annotation)),
        'function',
        field('name', $._EQName),
        field('params', $.param_list),
        field('result', optional(seq('as', $.sequence_type))),
        field('body', choice($.enclosed_expr, 'external')),
        ';'
      ),
    annotation: $ =>
      seq(
        '%',
        field('name', $._EQName),
        field('body', optional(seq('(', commaSep($.string_literal), ')')))
      ),

    _query_body: $ => seq(commaSep1($._expr)),
    _expr: $ =>
      choice(
        $._primary,
        //statement_like
        $.flwor_expr,
        $.quantified_expr,
        // conditionals
        $.switch_expr,
        $.if_expr,
        $.typeswitch_expr,
        $.try_catch_expr,
        // binary: lhs op rhs
        $.or_expr, // 83 prec: 3
        $.and_expr, // 84 prec: 4
        $.comparison_expr, // 85 prec: 5
        $.string_concat_expr, // 86 prec: 6 lr
        $.range_expr, // 87 prec: 7 na
        $.additive_expr, // 88 prec: 8 lr
        $.multiplicative_expr, // 88 prec: 9 lr
        $.union_expr, // 90 prec:  10 lr
        $.intersect_except_expr, // 91 prec: 11 lr
        $.instance_of_expr, // 92 prec: 12 lr
        $.treat_as_expr, // 93 prec: 13 lr
        $.castable_as_expr, // 94 prec: 14 lr
        $.cast_as_expr, // 95 prec: 15 lr
        $.arrow_expr, // 96 prec: 16 lr
        $.unary_expr, // prefix  // 97 prec: 21 rl
        $.bang_expr, //107 prec: 18 l
        $.path_expr, //108 prec: 19 lr
        $.arrow_expr,
        $.postfix_expr
      ),

    // 3.1 Primary Expressions
    _primary: $ =>
      prec.left(
        choice(
          $._literal, // 57
          $.var_ref, // 59
          $.parenthesized_expr, // 133
          $.context_item_expr, // 134
          $.function_call, // 137
          $.named_function_ref, // function item
          $.inline_function_expr, // function item
          $.ordered_expr,
          $.unordered_expr,
          $._computed_constructor, // node constructors
          $._direct_constructor, // node constructors
          $.string_constructor,
          $.map_constructor, // 170
          $._array_constructor,
          $.unary_lookup // 174
        )
      ),

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
    integer_literal: $ => token(Integer),
    decimal_literal: $ => token(Decimal),
    double_literal: $ => token(Double),

    //double_literal:  $ => Double,
    //Integer = seq( Digit, optional(repeat(Digit))),
    //Decimal = ,
    //DecimalExponent = seq(choice('e', 'E'), optional(choice('+', '-')), Integer ),
    //Double = choice(
    //  seq( Integer, optional(seq('.', /[0-9]*/) ), DecimalExponent ),
    //  seq(seq('.', Integer) , DecimalExponent )
    //),
    //3.1.2 Variable References
    var_ref: $ => seq('$', $._EQName),
    // 3.1.3 Parenthesized Expressions
    parenthesized_expr: $ => prec(PREC.comma, seq('(', commaSep($._expr), ')')), // 133
    //3.1.4 Context Item Expression
    context_item_expr: $ => '.',
    //3.1.5 Static Function Calls
    function_call: $ =>
      seq(field('name', $._EQName), field('arguments', $.argument_list)), // 137
    // 3.1.6 Named Function References
    named_function_ref: $ =>
      seq(
        field('name', $._EQName),
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
        field('result', optional(seq('as', $.sequence_type))),
        field('body', $.enclosed_expr)
      ), // 169
    param_list: $ => seq('(', commaSep($.param), ')'),
    param: $ =>
      seq(
        field('name', seq('$', $._EQName)),
        optional(field('type', seq('as', $.sequence_type)))
      ),
    // 3.1.8 Enclosed Expressions
    enclosed_expr: $ => prec(PREC.comma, seq('{', commaSep($._expr), '}')), // 5
    // 3.2 Postfix Expressions TODO
    postfix_expr: $ =>
      prec.left(
        PREC.primary,
        seq(
          field('lhs', $._primary),
          field(
            'operand',
            repeat1(choice($.predicate, $.argument_list, $.unary_lookup))
          )
        )
      ), // 49
    // 3.2.1 Filter Expressions TODO tests
    predicate: $ => prec(PREC.predicate, seq('[', $._expr, ']')), //124

    // 3.2.2 Dynamic Function Calls
    argument_list: $ => seq('(', commaSep($.argument), ')'), // 122
    argument: $ => choice($._expr, $.argument_placeholder), // 138
    argument_placeholder: $ => token('?'), //  139
    // 3.3 Path Expressions
    path_expr: $ =>
      prec.right(
        PREC.path,
        choice(
          seq(
            field('lhs', $._primary),
            choice(
              field('path', '/'),
              seq(field('path', choice('/', '//')), field('rhs', $._step_expr))
              //  $._step_expr
            )
          )
        )
      ),
    _step_expr: $ =>
      prec.left(
        PREC.path,
        choice(
          field('step', $._axis_step),
          seq(
            field('left_step', $._axis_step),
            repeat1(
              seq(
                field('path', choice('/', '//')),
                field('right_step', $._axis_step)
              )
            )
          )
        )
      ),
    _axis_step: $ =>
      seq(
        choice($._reverse_step, $._forward_step),
        optional(repeat($.predicate)) // 124
      ), // 111
    _forward_step: $ =>
      choice(seq($.forward_axis, $._node_test), $.abbrev_forward_step), // 112
    abbrev_forward_step: $ => seq(optional($.abbrev_attr), $._node_test), // 117
    abbrev_attr: $ => '@',
    // 3.3.2.1 Axes
    forward_axis: $ =>
      choice(
        token('child::'),
        token('descendant::'),
        token('attribute::'),
        token('self::'),
        token('descendant-or-self::'),
        token('following-sibling::'),
        token('following::')
      ), //113
    _reverse_step: $ =>
      choice(seq($._reverse_axis, $._node_test), $.abbrev_reverse_step), // 115
    _reverse_axis: $ =>
      choice(
        token('parent::'),
        token('ancestor::'),
        token('preceding-sibling::'),
        token('preceding::'),
        token('ancestor-or-self::')
      ), //116
    abbrev_reverse_step: $ => token('..'), // 117
    //3.3.2.2 Node Tests
    _node_test: $ =>
      choice(
        field('kind_test', $._kind_test),
        field('name_test', $._name_test)
      ), // 118'
    // 3.4 Sequence Expressions
    // 3.4.1 Constructing Sequences
    range_expr: $ =>
      prec.left(
        PREC.range,
        seq(
          field('left', $._expr),
          field('operator', $.range_op),
          field('right', $._expr)
        )
      ), // 87
    range_op: $ => 'to',
    //3.4.2 Combining Node Sequences
    union_expr: $ =>
      prec.left(
        PREC.union,
        seq(
          field('left', $._expr),
          field('operator', $.union_op),
          field('right', $._expr)
        )
      ), // 90
    union_op: $ => choice('union', '|'),
    intersect_except_expr: $ =>
      prec.left(
        PREC.intersect,
        seq(
          field('left', $._expr),
          field('operator', $.intersect_except_op),
          field('right', $._expr)
        )
      ), // 91
    intersect_except_op: $ => choice('intersect', 'except'),
    // 3.5 Arithmetic Expressions  ( additive,multiplicative, unary )
    additive_expr: $ =>
      prec.left(
        PREC.additive,
        seq(
          field('left', $._expr),
          field('operator', $.additive_op),
          field('right', $._expr)
        )
      ),
    additive_op: $ => choice('+', '-'),
    multiplicative_expr: $ =>
      prec.left(
        PREC.multiplicative,
        seq(
          field('left', $._expr),
          field('operator', $.multiplicative_op),
          field('right', $._expr)
        )
      ),
    multiplicative_op: $ => choice('*', 'div', 'idiv', 'mod'),
    unary_expr: $ =>
      prec.right(
        PREC.unary,
        seq(field('operator', $.unary_op), field('operand', $._primary))
      ), // 97 choice primary | postfix
    unary_op: $ => choice(token('+'), token('-')),
    // 3.6 String Concatenation Expressions
    string_concat_expr: $ =>
      prec.left(
        PREC.concat,
        seq(
          field('left', $._expr),
          field('operator', $.string_concat_op),
          field('right', $._expr)
        )
      ), // 86
    string_concat_op: $ => '||',
    // 3.7 Comparison Expressions
    comparison_expr: $ =>
      prec.left(
        PREC.comparison,
        seq(
          field('lhs', $._expr),
          field('operator', $.comparison_op),
          field('rhs', $._expr)
        )
      ), // 85
    comparison_op: $ =>
      choice(
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
        '>>'
      ),
    //  comparison_op: $ => ,
    // 3.8 Logical Expressions
    and_expr: $ =>
      prec.left(
        PREC.and,
        seq(
          field('left', $._expr),
          field('operator', $.and_op),
          field('right', $._expr)
        )
      ), // 84
    and_op: $ => 'and',
    or_expr: $ =>
      prec.left(
        PREC.or,
        seq(
          field('left', $._expr),
          field('operator', $.or_op),
          field('right', $._expr)
        )
      ), // 83
    or_op: $ => 'or',
    //3.9 Node Constructors
    node_constructor: $ =>
      choice($._computed_constructor, $._direct_constructor),
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
        field('name', $.QName),
        repeat(field('attribute', $.direct_attribute)),
        '>'
      ),
    end_tag: $ => seq('</', field('name', $.QName), '>'),
    empty_tag: $ =>
      seq(
        '<',
        field('name', $.QName),
        repeat(field('attribute', $.direct_attribute)),
        '/>'
      ),

    direct_attribute: $ =>
      seq(field('name', $.QName), '=', field('value', $.string_literal)),
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
    // 3.9.3 Computed Constructors
    _computed_constructor: $ =>
      choice(
        $.document_constructor,
        $.element_constructor,
        $.attribute_constructor,
        //$.comp_namespace_constructor, // TODO
        $.text_constructor,
        $.comment_constructor
        //$.comp_pi_constructor, // TODO
      ), // 156
    document_constructor: $ => seq('document', $.enclosed_expr), // 156
    element_constructor: $ =>
      seq(
        'element',
        field('name', choice($._EQName, seq('{', commaSep($._expr), '}'))),
        field('content', seq('{', commaSep($._expr), '}'))
      ), // 157
    attribute_constructor: $ =>
      seq(
        'attribute',
        field('name', choice($._EQName, seq('{', commaSep($._expr), '}'))),
        field('content', seq('{', commaSep($._expr), '}'))
      ), // 157
    //comp_namespace_constructor: $ => seq('TODO'),
    text_constructor: $ => seq('text', $.enclosed_expr), // 164
    comment_constructor: $ => seq('comment', $.enclosed_expr), // 165
    //comp_pi_constructor: $ => seq('TODO'),

    //3.10 String Constructors TODO
    string_constructor: $ => seq('``[', repeat($._string_content), ']``'), // 177
    // TODO this is not correct  string content is external in other tree sitters
    _string_content: $ => prec.right(choice($.char_group, $.interpolation)),
    char_group: $ => prec.left(repeat1(/(\w|\s)+/)),
    interpolation: $ => seq('`{', commaSep($._expr), '}`'), // 180',
    //3.11 Maps and Arrays
    map_constructor: $ =>
      prec.left(seq('map', '{', commaSep($.map_entry), '}')), // 170
    map_entry: $ => seq(field('key', $._expr), ':', field('value', $._expr)),
    // 3.11.2 Arrays
    _array_constructor: $ =>
      choice($.curly_array_constructor, $.square_array_constructor), // 174 TODO ,
    curly_array_constructor: $ => prec.left(seq('array', $.enclosed_expr)),
    square_array_constructor: $ =>
      prec.left(seq('[', commaSep($._expr), ']', optional('?'))),
    //3.11.3.1 Unary Lookup
    unary_lookup: $ =>
      prec.left(
        PREC.unarylookup,
        seq('?', field('specifier', $._key_specifier))
      ), // 76
    _key_specifier: $ =>
      choice($.NCName, $.lookup_digit, $.parenthesized_expr, $.lookup_wildcard), // 54
    lookup_digit: $ => repeat1(/\d/),
    lookup_wildcard: $ => '*',
    //##########################
    //
    // 3.12 FLWOR Expressions
    flwor_expr: $ =>
      seq(
        $._initial_clause,
        //optional( $._intermediate_clause ),
        $.return_clause
      ), // 41
    _initial_clause: $ =>
      choice(
        $.for_clause, // 44
        $.let_clause // 48
      ),
    for_clause: $ => prec.left(seq('for', commaSep($.for_binding))), // 44',
    for_binding: $ =>
      seq(
        $.var_ref,
        optional($.type_declaration),
        optional(seq('allowing', 'empty')),
        optional(seq('at', $.var_ref)),
        'in',
        $._expr
      ), // 49
    let_clause: $ => prec.left(seq('let', commaSep1($.let_binding))),
    let_binding: $ =>
      seq($.var_ref, optional($.type_declaration), ':=', $._expr),
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
    //3.12.5 Where Clause
    where_clause: $ => seq('where', $._expr), // 60
    // 3.12.6 Count Clause
    count_clause: $ => seq('count', $.var_ref), //   59
    // 3.12.7 Group By Clause
    group_by_clause: $ => seq('group', 'by', commaSep($._grouping_spec)), // 61
    _grouping_spec: $ =>
      seq(
        $.var_ref,
        optional(seq(optional($.type_declaration), ':=', $._expr)),
        optional(seq('collation', $.string_literal))
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
        $._expr,
        optional(seq(choice('ascending', 'descending'))),
        optional(seq('empty', choice('greatest', 'least'))),
        optional(seq('collation', $.string_literal))
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
          field('rhs', $._expr),
          field('operator', seq('instance', 'of')),
          field('type', $.sequence_type)
        )
      ), // 92
    instance_of_op: $ => seq('instance', 'of'),
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
          field('operator', seq('cast', 'as')),
          field('rhs', $.single_type)
        )
      ), // 95
    //3.18.4 Castable
    castable_as_expr: $ =>
      prec(
        PREC.castable,
        seq(
          field('lhs', $._expr),
          field('operator', seq('castable', 'as')),
          field('rhs', $.single_type)
        )
      ), // 94
    single_type: $ => seq(field('type', $._EQName), optional('?')),

    //3.18.5 Constructor Functions TODO
    //3.18.6 Treat
    treat_as_expr: $ =>
      prec(
        PREC.treat,
        seq(
          field('lhs', $._expr),
          field('operator', seq('treat', 'as')),
          field('rhs', $.sequence_type)
        )
      ), // 92
    // 3.19 Simple map operator (!)
    bang_expr: $ =>
      prec.left(
        PREC.bang,
        seq(
          field('lhs', $._primary), // TODO
          field('operator', '!'),
          field('rhs', $._primary)
        )
      ), // 107
    // 3.20 Arrow operator (=>)
    arrow_expr: $ =>
      prec.left(
        PREC.arrow,
        seq(
          field('rhs', $._expr),
          field('operator', '=>'),
          field('lhs', $.arrow_function_call)
        )
      ), // 94
    arrow_function_call: $ =>
      seq(choice($._EQName, $.var_ref, $.parenthesized_expr), $.argument_list),
    // 3.21 Validate Expressions TODO
    // 3.22 Extension Expressions TODO
    // 2.5.4 SequenceType Syntax
    type_declaration: $ =>
      seq(field('operator', 'as'), field('type', $.sequence_type)),
    sequence_type: $ => choice(seq('empty-sequence', '(', ')'), $._item_type), // 184
    _item_type: $ =>
      prec.right(
        seq(
          choice(
            $._kind_test,
            seq('item', '(', ')'),
            $._function_test,
            $._map_test,
            $._array_test,
            $._atomic_or_union_type,
            $._parenthesized_item_type
          ),
          optional($.occurrence_indicator)
        )
      ), // 186
    occurrence_indicator: $ => choice('?', '*', '+'), // 185
    _atomic_or_union_type: $ => $._EQName, // 187

    _kind_test: $ =>
      choice(
        $.document_test,
        $.element_test,
        $.attribute_test,
        $.schema_element_test,
        $.schema_attribute_test,
        $.pi_test,
        $.comment_test,
        $.text_test,
        $.namespace_node_test,
        $.any_kind_test
        // elementname // 204
      ), //' TODO 188 '
    document_test: $ =>
      seq(
        'document-node',
        '(',
        optional(choice($.element_test, $.schema_attribute_test)),
        ')'
      ), // 190
    element_test: $ =>
      seq(
        'element',
        '(',
        optional(
          seq(
            choice($._EQName, $.param_wildcard),
            optional(seq(',', $._EQName))
          )
        ),
        ')'
      ), // 199
    attribute_test: $ =>
      seq(
        'attribute',
        '(',
        optional(
          seq(
            choice($._EQName, $.param_wildcard),
            optional(seq(',', $._EQName))
          )
        ),
        ')'
      ), // 195
    param_wildcard: $ => '*',
    schema_element_test: $ =>
      seq(
        'schema-element',
        '(',
        // TODO
        ')'
      ), // TODO 201
    schema_attribute_test: $ => 'TODO 197',
    pi_test: $ => 'TODO 194',
    comment_test: $ => token('comment()'), //  192
    text_test: $ => token('text()'), // 191',
    namespace_node_test: $ => token('namespace-node()'), // 193',
    any_kind_test: $ => token('node()'), // 189',
    _name_test: $ => prec.left(choice($._EQName, $.wildcard)), // TODO 199
    wildcard: $ =>
      choice(
        '*',
        seq($.NCName, ':*'),
        seq('*:', $.NCName),
        seq($.braced_uri_literal, '*')
      ), // 120
    _function_test: $ =>
      choice(
        $.any_function_test,
        seq(
          'function',
          '(',
          commaSep1($.sequence_type),
          ')',
          'as',
          $.sequence_type
        ) // TODO TypedFunctionTest
      ), // 207
    any_function_test: $ => seq('function', '(', '*', ')'),
    _map_test: $ =>
      choice(
        seq('map', '(', '*', ')') // AnyMapTest
      ), // TODO type TypedMapTest 210
    _array_test: $ =>
      choice(
        seq('array', '(', '*', ')') // AnyArrayTest
      ), // TODO TypedMapTest 213
    _parenthesized_item_type: $ => seq('(', $._item_type, ')'), // 216
    // END SequenceType Syntax

    // instances of the grammatical production EQName.
    // EQName is identifier
    _EQName: $ => choice($.QName, $.uri_qualified_name), // 112
    QName: $ => prec.left(choice($._prefixed_name, $._unprefixed_name)), // 122
    _prefixed_name: $ => /[\w][\w-]+:[\w][\w-]+/,
    _unprefixed_name: $ => /[\w]([\w-])*/,
    NCName: $ => $._unprefixed_name, // 123
    uri_qualified_name: $ => /Q[{][^}\s]+[}][\w]+/, // TODO too simple?
    braced_uri_literal: $ =>
      seq('Q{', repeat1(choice(PredefinedEntityRef, CharRef, /[^&{}]/)), '}'), // 224
    //comma: $ => token(','),
    // delimit: $ => choice('!'),

    keyword: $ => token(/[a-z][a-z\-]+/),
    // identifier: $ =>  /[a-z][a-z\-]+/
    comment: $ => token(/[(]:[^:]*:*([^(:][^:]*:+)*[)]/)
  }
});

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
