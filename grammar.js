const  DIGIT = /[0-9]/,
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
  NAME_CHAR = /[^,;:!?.'"()\[\]\{\}@*/\\\&#%`\^+<>|\~\s\d]/

module.exports = grammar({
  name: 'xquery',
  extras: $ => [$.comment, /\s/],
  word: $ => $.identifier,
  conflicts: $ => [ 
   [$._expr, $._step_expr]
  ],
  supertypes: $ => [ $._prolog ],
  rules: {
    module: $ =>
      seq(
        optional($.version_declaration),
        choice($.library_module, $.main_module)
      ),
    library_module: $ => seq($.module_declaration, repeat(seq($._prolog,';'))),
    main_module: $ => seq(
      repeat(seq($._prolog,';')), 
      $._query_body),
    _prolog: $ => choice(
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
      $.module_import, 
      $.context_item_declaration,
      $.variable_declaration,
      $.function_declaration,
      $.option_declaration),
    _query_body: $ => seq($._expr, optional( repeat(seq( prec(1,','), $._expr)))),
    _expr: $ => choice( // statement like expressions all prec 2
      $._primary_expr,
      $.flwor_expr,
      $.quantified_expr,
      $.switch_expr,
      $.if_expr,
      $.typeswitch_expr,
      $.try_catch_expr,
      $.or_expr, // 83             prec: 3
      $.and_expr, // 84            prec: 4
      $.comparison_expr, // 85     prec: 5
      $.string_concat_expr, // 86  prec: 6
      $.range_expr, // 87          prec: 7
      $.additive_expr, // 88       prec: 8
      $.multiplicative_expr, // 89 prec: 9
      $.union_expr, // 90          prec: 10 
      $.intersect_except_expr,//91 prec: 11
      $.instance_of_expr, // 92    prec: 12
      $.treat_expr, // 93          prec: 13
      $.castable_expr, // 94       prec: 14
      $.cast_expr, // 95           prec: 15
      $.arrow_expr, // 96          prec: 16
      $.unary_expr, //  97         prec: 17 '-' '+' arithmetic prefix right to left
      $.bang_expr, //107           prec: 18
      $.path_expr, //108           prec: 19   '/' '//'  not relative path?
      //  $.predicate //124        prec: 20 @primary postfix predicate '[' ']'
      //  $.postfix_lookup //125   prec: 20 @primary postfix lookup   '?'
      //  $.unary_lookup,// 181    prec: 21 @primary unary lookup
      //seq($._primary_expr, optional( $._postfix_expr )) 
    ),
    // 3.1 Primary Expressions set as highest prec
    _primary_expr: $ => prec.left(23,seq(choice(
      $.enclosed_expr, // 36,
      $._literal, // 57
      $.var, // 59
      $.parenthesized_expr, // 133
      $.context_item_expr, // 134
      $.ordered_expr, // 135
      $.unordered_expr, // 136
      $.function_call, // 137
      $._direct_constructor,  // 141 node constructors 140 
      $._computed_constructor, // 155 // node constructors 140
      $.named_function_ref,   // 168  function item 167
      $.inline_function_expr, // 169 function item 167
      $.map_constructor, // 170
      $.square_array_constructor, // 175 array_constructor 174
      $.curly_array_constructor, // 176  array_constructor 174
      $.string_constructor, // 177
      $.unary_lookup,// 181
     ), optional($._postfix_expr))),
    // 3.1.1 Literals
    _literal: $ => choice($.string_literal, $._numeric_literal),
    string_literal: $ => choice(
        seq( '"', repeat(choice($.predefined_entity_ref, $.char_ref, $.escape_quote, /[^"&]/)),'"'),
        seq( "'", repeat(choice($.predefined_entity_ref, $.char_ref, $.escape_apos, /[^'&]/)),"'")),
    _numeric_literal: $ =>
      choice($.integer_literal, $.decimal_literal, $.double_literal),
    //3.1.2 Variable References
    var: $ => seq('$',  $.EQName ),
    // note: a dynamic function call can consist of _postfix_expr [ var + argument_list ]
    // 3.1.3 Parenthesized Expressions
    parenthesized_expr: $ =>  seq('(', optional($._query_body), ')'), // 133
    //3.1.4 Context Item Expression TODO not like spec
    context_item_expr: $ => prec.left(seq('.', optional( $.path_expr))),
    //3.1.5 Static Function Calls
    function_call: $ => prec.left(25,seq( 
      choice( field( 'dynamic', $.var),field('static', $.EQName)),
      $.argument_list)), // 137 spec deviation added $var
    //function_call: $ => prec.left(25 ,seq( $.EQName, $.argument_list)), // 137
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
        optional( field('result_type', $.type_declaration)),
        field('body', $.enclosed_expr)
      ), // 169
    param_list: $ => seq('(', commaSep($.param), ')'),
    param: $ =>
      seq(
        field('param_name', seq('$', $.EQName)),
        optional(field('param_type', $.type_declaration))
      ),
    // 3.1.8 Enclosed Expressions: when content empty then empty parenthesized_expr {()} is assumed
    enclosed_expr: $ =>  seq('{', optional( $._query_body ) , '}'), // 5
    // 3.2 Postfix Expressions TODO
    //_postfix_expr: $ =>  seq($._primary_expr, optional(repeat1(choice($.predicate, $.argument_list, $.postfix_lookup)))), // 49
    _postfix_expr: $ =>  repeat1(choice($.predicate, $.postfix_lookup, $.argument_list )), // 49
    // 3.2.1 Filter Expressions TODO tests
    predicate: $ => prec(20, seq( '[', field('filter', $._query_body ), ']')), //124
    // 3.2.2 Dynamic Function Calls
    argument_list: $ => prec(1,seq('(', commaSep($.argument), ')')), // 122
    argument: $ => choice($._expr, $.argument_placeholder), // 138
    argument_placeholder: $ => '?', //  139
    // 3.3 Path Expressions
    // https://docs.oracle.com/cd/E13190_01/liquiddata/docs81/xquery/query.html
    path_expr: $ => prec.left(19, 
      choice(
        seq('/', optional($._relative_path_expr)), //parse-note-leading-lone-slash
        seq( '//', $._relative_path_expr ),  // must have relative_path_expr 
        $._relative_path_expr  // can stand alone
      )
    ),
    _relative_path_expr: $ => prec.left(seq($._step_expr, optional( repeat1 (seq( choice('/', '//'), $._step_expr))))), //109 
    _step_expr: $ => prec.left(choice( seq( $._primary_expr, optional( $._postfix_expr )) , $._axis_step )),
    _axis_step: $ => prec.left(seq(choice($._reverse_step, $._forward_step),optional(repeat($.predicate)))), // 111 124
    _forward_step: $ => field('step',choice(seq($._forward_axis, $._node_test), $.abbrev_forward_step)), // 112
    abbrev_forward_step: $ => seq(optional($.abbrev_attr), $._node_test), // 117
    abbrev_attr: $ => '@',
    // 3.3.2.1 Axes
  _forward_axis: $ =>
    seq( choice( 'child','descendant', 'attribute', 'self', 'descendant-or-self', 'following-sibling', 'following'),
      '::'
  ), ///113
  _reverse_step: $ => field('step',choice(seq($._reverse_axis, $._node_test), $.abbrev_reverse_step)), // 115
    _reverse_axis: $ => seq(
      choice( 'parent', 'ancestor', 'preceding-sibling', 'preceding', 'ancestor-or-self' ),
        '::'
      ), //116
    abbrev_reverse_step: $ => '..', // 117
    _node_test: $ => choice( $._kind_test, $.name_test), // 118'

    or_expr: $ => prec.left(3,seq( field('lhs', $._expr), 'or', field('rhs', $._expr))),
    and_expr: $ => prec.left(4,seq( field('lhs', $._expr), 'and', field('rhs', $._expr))),
    comparison_expr: $ => prec.left(5,seq(field('lhs',$._expr),choice('eq','ne','lt','le','gt','ge','=','!=','<','<=','>','>=','is','<<','>>'),field('rhs',$._expr))),
    string_concat_expr: $ => prec.left(6,seq(field('lhs', $._expr),repeat1(seq('||',field('rhs', $._expr))))), // 86
    range_expr: $ => prec.left(7,seq( field('lhs', $._expr),  seq( 'to', field('rhs', $._expr)))),
    additive_expr: $ => prec.left(8,seq( field('lhs', $._expr), choice('+','-' ), field('lhs', $._expr))),
    multiplicative_expr: $ => prec.left(9,seq( field('lhs', $._expr), choice('*','div','idiv','mod'), field('rhs', $._expr))),
    union_expr: $ => prec.left(10,seq( field('lhs', $._expr), choice('union','|' ), field('rhs', $._expr))),
    intersect_except_expr: $ => prec.left(11,seq( field('lhs', $._expr), choice('intersect','except'), field('rhs', $._expr))),
    instance_of_expr: $ => prec.left(12, seq(
      field('lhs', $._expr),
      seq('instance','of'),
      field('rhs', $.sequence_type))), // 92
    treat_expr: $ => prec(13,seq(
      field('lhs', $._expr),
      seq('treat', 'as'),
      field('rhs', $.sequence_type))), // 93
    castable_expr: $ => prec(14, seq(
      field('lhs', $._expr),
      seq('castable', 'as'),
      field('rhs', $.single_type))), // 94
    cast_expr: $ => prec(15, seq( 
      field('lhs', $._expr), 
      seq( 'cast', 'as',
      field('rhs', $.single_type)))), // 95
    arrow_expr: $ => prec.left(16, seq( 
      field('rhs', $._expr), 
      repeat1( seq( '=>', $.arrow_function)))), // 94
    unary_expr: $ => prec.right(17, seq( choice('+','-'), $._expr)),
    bang_expr: $ => prec.left(18,seq(
          field('lhs', $._expr), // TODO
          repeat1( seq( '!', 
          field('rhs', $._expr)
        )))
      ), // 107
    single_type: $ => prec.left(seq($.EQName, optional('?'))), // 182
    arrow_function: $ => seq(choice($.EQName, $.var, $.parenthesized_expr), $.argument_list), // 127
    _direct_constructor: $ => choice(
        $.direct_element,
        $.direct_comment,
        $.direct_pi
      ), //141
    direct_comment: $ => token(seq('<!--', repeat(/[^-]/), '-->')), // TODO
    direct_pi: $ => token(seq('<?', repeat(/[^?]/), '?>')), // TODO
    direct_element: $ => choice( 
      seq($.start_tag, repeat(choice($._direct_constructor, $.element_text)), $.end_tag),
      $.empty_tag ),
    start_tag: $ => seq( '<',field('tag_name',alias($._QName,$.identifier)), repeat($.direct_attribute),'>'),
    end_tag: $ => seq('</',  field('tag_name',alias($._QName,$.identifier)), '>'),
    empty_tag: $ => seq( '<', field('tag_name',alias($._QName,$.identifier)),repeat($.direct_attribute),'/>' ),
    element_text: $ => choice( $. _common_content, $.char_data ),
    direct_attribute: $ => seq( 
      field('attr_name',alias($._QName,$.identifier)), '=',  field( 'attr_value', $.direct_attribute_value)),
    direct_attribute_value: $ => choice( 
      seq( '"', repeat(choice($._common_content, $.escape_quote, /[^"&]/)),'"'), 
      seq( "'", repeat(choice($._common_content, $.escape_apos, /[^'&]/)),"'")),
    _common_content: $ =>  choice( $.predefined_entity_ref, $.char_ref, $.escape_curly, $.enclosed_expr),
    char_data: $ => /[^{}<&]+/,
    char_ref: $ => choice( seq('&#', repeat1(/[0-9]/), ';'),seq('&#x', repeat1(/[0-9a-fA-F]/), ';') ),
    escape_curly: $ => choice('{{', '}}'),
    predefined_entity_ref: $ => seq('&', choice('lt', 'gt', 'amp', 'quot', 'apos'), ';'),
    escape_apos: $ =>  "''",
    escape_quote: $ => '""',
    // 3.9.3 Computed Constructors TODO make Computed Constructors a supertype
    _computed_constructor: $ =>
      choice(
        $.comp_elem_constructor,
        $.comp_attr_constructor,
        $.comp_doc_constructor,
        $.comp_text_constructor,
        $.comp_comment_constructor,
        $.comp_namespace_constructor,
        $.comp_pi_constructor
      ), // 155
    comp_elem_constructor: $ => seq( 'element', $._name_content),
    comp_attr_constructor: $ => seq( 'attribute', $._name_content),
    _name_content: $ => seq(
     field('name', choice($.EQName, seq('{', commaSep($._expr), '}'))),
     field('content', $.enclosed_expr)),
    comp_doc_constructor: $ => seq( 'document', field('content', $.enclosed_expr)),
    comp_text_constructor: $ => seq( 'text', field('content', $.enclosed_expr)),
    comp_comment_constructor: $ => seq( 'comment', field('content', $.enclosed_expr)),
    comp_pi_constructor: $ => seq( 
       'processing-instruction',
        field('name', choice($.NCName, seq('{', commaSep($._expr), '}'))), 
        field('content', $.enclosed_expr)), // 166
    comp_namespace_constructor: $ => seq(
        'namespace', 
        field('name', choice($.NCName, $.enclosed_expr)),//@see 3.9.3.7
        field('content', $.enclosed_expr)), // 160
      string_constructor: $ => seq('``[', repeat( choice($.char_group, $.interpolation)), ']``'), // 177
    // TODO this is not correct  string content is external in other tree sitters
    char_group: $ => token(prec.left(repeat1(/[^`\]]/))), // TODO
    interpolation: $ => seq('`{', commaSep($._expr), '}`'), // 1p80',
    //3.11 Maps and Arrays
    map_constructor: $ => seq('map',seq('{',commaSep($.map_entry),'}')),//170
    map_entry: $ => seq(field('key', $._expr), ':', field('value', $._expr)),
    // 3.11.2 Arrays
    _array_constructor: $ =>
      choice($.curly_array_constructor, $.square_array_constructor), // 174 TODO ,
    curly_array_constructor: $ =>
      seq(
        'array',
        field('content', $.enclosed_expr)
      ),
    square_array_constructor: $ => seq('[', commaSep($._expr), ']'),
    postfix_lookup: $ => prec.left( 20 , seq( '?', $._key_specifier)), // 125
    unary_lookup: $ => prec.left( 21 , seq( '?', $._key_specifier)),
    _key_specifier: $ => choice($.NCName, $.lookup_digit, $.parenthesized_expr, $.lookup_wildcard), // 54
    lookup_digit: $ => repeat1(/\d/),
    lookup_wildcard: $ => '*',
    //##########################
    // 3.12 FLWOR Expressions
    flwor_expr: $ => prec(2,seq($._initial_clause, optional($._intermediate_clause), $.return_clause)), // 41
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
    if_expr: $ => prec(2, seq($.if_condition, $.then_consequence, $.else_alternative)),
    if_condition: $ => seq('if', '(', $._expr, ')'),
    then_consequence: $ => seq('then', $._expr),
    else_alternative: $ => seq('else', $._expr),
    // 3.15 Switch Expression
    switch_expr: $ => prec(2,seq( 'switch',
          field( 'switch_operand', seq('(', commaSep1($._expr), ')')),
          repeat1($.switch_clause),
          field('switch_default',
            seq('default', 'return', field('default_return', $._expr))))), // 71
    switch_clause: $ => seq( 
      'case',field('case_operand', $._expr),
      'return',field('case_return', $._expr)), // 72
    // 3.16 Quantified Expressions
    quantified_expr: $ => prec(2, seq(
          choice('some', 'every'),
          field( 'quantifier',$.var) , optional($.type_declaration),
          'in', field( 'in_binding', 
            seq( $._expr, repeat(seq(',', $.var, optional($.type_declaration), 'in', $._expr)))),
          'satisfies', field( 'satisfy_conditional',  $._expr )
        )
      ),
    // 3.17 Try/Catch Expressions
    try_catch_expr: $ => prec(2, seq($.try_clause, $.catch_clause)), // 78
    try_clause: $ => seq('try', $.enclosed_expr), // 78
    catch_clause: $ => seq('catch', $.catch_error_list, $.enclosed_expr), // 79
    catch_error_list: $ => seq($.name_test, repeat(seq('|', $.name_test))) ,
    typeswitch_expr: $ => prec(2,seq( 
      'typeswitch', 
      field('operand',seq('(',commaSep1($._expr),')')),
      repeat1( field( 'case', $._typeswitch_clause)),
      field( 'default', seq('default', optional($.var), 'return', $._expr)))), // 74
    _typeswitch_clause: $ => seq(
      'case', 
      optional(seq($.var, 'as')),
      $.sequence_type, repeat(seq('|', $.sequence_type)),
      "return", 
      $._expr ),
    // 3.21 Validate Expressions TODO
    // 3.22 Extension Expressions TODO
    //4.1 Version Declaration
    version_declaration: $ => seq( 'xquery', 
       choice( 
         seq('encoding', $.string_literal),
         seq('version', $.string_literal, optional( seq('encoding', $.string_literal)))),
      ';'
    ), 
    //4.2 Module Declaration
    module_declaration: $ => seq( 'module', 'namespace', 
      field('name', $.identifier), '=', 
      field('uri', $.string_literal),';' ),
    boundary_space_declaration: $ => seq('declare', 'boundary-space', choice('preserve', 'strip')),
    default_collation_declaration: $ => seq( 'declare', 'default', 'collation', field('uri', $.string_literal)),
    base_uri_declaration: $ => seq('declare', 'base-uri', field('uri', $.string_literal)),
    construction_declaration: $ => seq('declare', 'construction', choice('preserve', 'strip')),
    ordering_mode_declaration: $ => seq('declare', 'ordering', choice('ordered', 'unordered')),
    empty_order_declaration: $ => seq( 'declare', 'default', 'order', 'empty', choice('greatest', 'least')),
    // 4.9 Copy-Namespaces Declaration
    copy_namespaces_declaration: $ => seq( 
      'declare', 'copy-namespaces',
      choice('preserve', 'no-preserve'),
      ',',
      choice('inherit', 'no-inherit')
    ),
    // 4.10 Decimal Format Declaration
    decimal_format_declaration: $ => seq( 'declare',
        choice(
          seq('decimal-format', $.EQName),
          seq('default', 'decimal-format')
        ),
        repeat( seq( $._df_property_name, '=', $.string_literal ))),
    _df_property_name: $ => choice( 
      'decimal-separator','grouping-separator','infinity','minus-sign','NaN','percent','per-mille',
      'zero-digit','digit','pattern-separator','exponent-separator'),
    schema_import: $ => seq( 'import', 'schema', 
      optional( field( 'prefix',
        choice(
          seq('namespace', field('name', $.identifier),  '='), 
          seq('default', 'element', 'namespace')))), 
      field('uri', $.string_literal), optional(seq('at', commaSep1($.string_literal)))), // 21
    // 4.12 Module Import // TODO
    module_import: $ => seq( 'import', 'module',
        optional(seq('namespace', field('name', $.identifier), '=')),
        field('uri', $.string_literal),
        optional(seq('at', commaSep1($.string_literal)))
      ),
    namespace_declaration: $ => seq( 'declare', 'namespace', 
      field('name', $.identifier), '=', field('uri', $.string_literal)), // 4.13
    default_namespace_declaration: $ => seq( 'declare', 'default', 
      choice('element', 'function'), 'namespace', field('uri', $.string_literal)), // 4.14
    //4.15 Annotations
    annotation: $ =>
      seq(
        '%',
        field('name', $.EQName),
        field('body', optional(seq('(', commaSep($.string_literal), ')')))
      ), // 27
    // 4.16 Variable Declaration
    variable_declaration: $ => seq(
      'declare', 
      repeat($.annotation), 
      'variable', 
        field('name', seq('$', $.EQName)),
      optional($.type_declaration),
      choice( 
        seq( ':=', field( 'value', $._expr )),
        seq('external', optional( seq(':=', $._expr ))))), // 26
    // 4.17 Context Item Declaration
    context_item_declaration: $ => seq(
        'declare', 'context', 'item',
        optional($.type_declaration),
        choice(
            seq(':=', field('var_value', $._expr)),
            seq('external', optional(seq(':=', $._expr))))),
    // 4.18 Function Declaration
    function_declaration: $ =>
      seq(
        'declare',
        repeat($.annotation),
        'function',
        field('name', $.EQName),
        field('params', $.param_list),
        optional($.type_declaration),
        field('body', choice($.enclosed_expr, 'external'))
      ),
    //4.19 Option Declaration
    option_declaration: $ =>
      seq(
        'declare',
        'option',
        field('name', $.EQName),
        field('value', $.string_literal)
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
    any_kind_test: $ => seq('node','(',')'), // 189
    text_test: $ => seq('text', '(',')'), // 191
    comment_test: $ => seq('comment','(',')'), // 192
    namespace_node_test: $ => seq('namespace-node','(',')'), // 193
    document_test: $ =>
      seq('document-node', '(', optional(choice($.element_test, $.schema_element_test)),')' ), // 190
    // wildcard - element() same as element(*)
    element_test: $ =>
    seq(
      'element',
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
      seq( 'attribute', '(', 
        optional(seq($._attrib_name_or_wildcard, optional(seq( ',', field('type_name', $.EQName))))),
        ')'),// 195
     _attrib_name_or_wildcard: $ => choice( field('attribute_name', $.EQName), alias( '*', $.wildcard )), //196
        /* optional(
          seq(
            field('param', choice(alias('*', $.wildcard), $.EQName)),
            optional(seq(',', field('param', $.EQName)))
          )
        ), */
        /* ')'
      ),  */
    schema_element_test: $ => seq( 'schema-element','(', field('element_name', $.EQName), ')'), //197
    schema_attribute_test: $ => seq( 'schema-attribute', '(', field('attribute_name', $.EQName),')'), //201
    pi_test: $ => 
      seq( 'processing-instruction', 
        seq( '(', optional(field('param', choice($.NCName, $.string_literal))),')' )), // 194
    name_test: $ => prec.left(choice($.EQName, $.wildcard)), // TODO 199
    wildcard: $ =>
      choice( '*',
        seq($.NCName, ':*' ),
        seq('*:', $.NCName),
        seq($.braced_uri_literal, '*')
      ), // 120
    any_function_test: $ => seq( repeat( $.annotation ), 'function', seq('(', '*', ')')), //  // 207
    typed_function_test: $ => seq(repeat( $.annotation ), 'function', 
      '(', $.sequence_type, repeat(seq(',',$.sequence_type)), ')',$.type_declaration ),
    any_map_test: $ => seq( 'map','(', '*', ')' ), // 210
    typed_map_test: $ => seq( 'map','(', $.atomic_or_union_type,',', $.sequence_type,')'), // 212
    any_array_test: $ => seq( 'array', '(', '*', ')' ),
    typed_array_test: $ => seq( 'array', '(', $.sequence_type,')' ),
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
      seq('Q{', repeat1(choice($.predefined_entity_ref, $.char_ref, /[^&{}]/)), '}'), // 224
    identifier: $ => /[_\p{L}]{1}[\-_\p{L}\p{N}]*/,
    comment: $ => token( seq( '(:', /[^:]*:+([^):][^:]*:+)*/, ')'))
  }
});

function commaSep1(rule) {
  return seq(rule, repeat(seq(',', rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}
