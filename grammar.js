function regexOr(regex) {
  if (arguments.length > 1) {
    regex = Array.from(arguments).join('|');
  }
  return {
    type: 'PATTERN',
    value: regex,
  };
}

/*
// https://www.w3.org/TR/xquery-31/#id-reserved-fn-names
// https://github.com/tree-sitter/tree-sitter/pull/246
//The reserved property
/* In order improve this error recovery, the grammar author needs a way to explicitly indicate that certain keywords are reserved. 
* That is - even if they are not technically valid, they should still be recognized as separate from any other tokens that would match
* that string (such as an identifier */

module.exports = grammar({
  name: 'xquery',
  // Whitespace and Comments function as symbol separators
  extras: ($) => [$.comment, /\s/, /[\n]/],
  reserved: ($) => [],
  word: ($) => $.identifier,
  //conflicts: ($) => [],
  supertypes: ($) => [$._setter, $._primary_expr, $._value_comp, $._node_comp, $._general_comp, $._computed_constructor, $._item_type, $._numeric_literal],
  rules: {
    module: ($) => seq(optional($.version_declaration), choice($.main_module, $.library_module)), // 1
    version_declaration: ($) => seq('xquery', choice(seq('encoding', $.string_literal), seq('version', $.string_literal, optional(seq('encoding', $.string_literal)))), ';'), // 2
    library_module: ($) => seq($.module_declaration, repeat($._prolog_part_one), repeat($._prolog_part_two)), // 4
    main_module: ($) => seq(repeat($._prolog_part_one), repeat($._prolog_part_two), field( 'query_body', $._expr)), // 3
    module_declaration: ($) => seq('module', 'namespace', field('name', $.identifier), '=', field('uri', $.string_literal), ';'), // 5
    _prolog_part_one: ($) => seq(choice($.default_namespace_declaration, $._setter, $.namespace_declaration, $.module_import, $.schema_import), ';'), // 6
    _prolog_part_two: ($) => seq(choice($.context_item_declaration, $.variable_declaration, $.function_declaration, $.option_declaration), ';'), // 6
    // separator: ($) => ';', // 7
    _setter: ($) =>
      choice(
        $.boundary_space_declaration, // 9
        $.default_collation_declaration, // 10
        $.base_uri_declaration, // 11
        $.construction_declaration, // 12
        $.ordering_mode_declaration, // 13
        $.empty_order_declaration, // 14
        $.copy_namespaces_declaration, // 15
        $.decimal_format_declaration // 18
      ),
    boundary_space_declaration: ($) => seq('declare', 'boundary-space', choice('preserve', 'strip')),
    default_collation_declaration: ($) => seq('declare', 'default', 'collation', field('uri', $.string_literal)),
    base_uri_declaration: ($) => seq('declare', 'base-uri', field('uri', $.string_literal)),
    construction_declaration: ($) => seq('declare', 'construction', choice('preserve', 'strip')),
    ordering_mode_declaration: ($) => seq('declare', 'ordering', choice('ordered', 'unordered')),
    empty_order_declaration: ($) => seq('declare', 'default', 'order', 'empty', choice('greatest', 'least')),
    copy_namespaces_declaration: ($) => seq('declare', 'copy-namespaces', choice('preserve', 'no-preserve'), ',', choice('inherit', 'no-inherit')),
    decimal_format_declaration: ($) =>
      seq('declare', choice(seq('decimal-format', field('name', $._EQName)), seq('default', 'decimal-format')), repeat(seq($._df_property_name, '=', $.string_literal))),
    _df_property_name: ($) =>
      choice('decimal-separator', 'grouping-separator', 'infinity', 'minus-sign', 'NaN', 'percent', 'per-mille', 'zero-digit', 'digit', 'pattern-separator', 'exponent-separator'),
    schema_import: ($) =>
      seq(
        'import',
        'schema',
        optional(field('prefix', choice(seq('namespace', field('name', $.identifier), '='), seq('default', 'element', 'namespace')))),
        field('uri', $.string_literal),
        optional(seq('at', $.string_literal, repeat(seq(',', $.string_literal))))
      ), // 21
    module_import: ($) =>
      seq(
        'import',
        'module',
        optional(seq('namespace', field('name', $.identifier), '=')),
        field('uri', $.string_literal),
        optional(seq('at', $.string_literal, repeat(seq(',', $.string_literal))))
      ), // 23
    namespace_declaration: ($) => seq('declare', 'namespace', field('name', $.identifier), '=', field('uri', $.string_literal)), // 24
    default_namespace_declaration: ($) => seq('declare', 'default', choice('element', 'function'), 'namespace', field('uri', $.string_literal)), // 25
    context_item_declaration: ($) =>
      seq('declare', 'context', 'item', optional($.type_declaration), choice(seq(':=', field('var_value', $._expr)), seq('external', optional(seq(':=', $._expr))))), // 31
    variable_declaration: ($) =>
      seq(
        'declare',
        repeat($.annotation),
        'variable',
        field('name', $.var_ref),
        optional($.type_declaration),
        choice(seq(':=', field('value', $._expr_single)), seq('external', optional(seq(':=', $._expr_single))))
      ), // 28
    function_declaration: ($) =>
      seq(
        'declare',
        repeat($.annotation),
        'function',
        field('name', $._EQName),
        '(',
        optional($.param_list),
        ')',
        optional($.type_declaration),
        field('body', choice($.enclosed_expr, 'external'))
      ), // 32
    param_list: ($) => seq($._param, repeat(seq(',', $._param))),
    _param: ($) => seq(field('param', $.var_ref), optional(field('param_type', $.type_declaration))), // 34
    option_declaration: ($) => seq('declare', 'option', field('name', $._EQName), field('value', $.string_literal)), // 37
    _query_body: ($) =>  $._expr, // 38
    _expr: ($) => prec(1, seq($._expr_single, repeat(seq(',', $._expr_single)))), // 39
    _expr_single: ($) =>
      choice(
        $.flwor_expr, // 41          prec: 2
        $.quantified_expr, // 70     prec: 2
        $.switch_expr, // 71         prec: 2
        $.typeswitch_expr, //74      prec: 2
        $.if_expr, // 77             prec: 2
        $.try_catch_expr, // 78      prec: 2
        $.or_expr, // 83             prec: 3
        $.and_expr, // 84            prec: 4
        $.comparison_expr, // 85     prec: 5
        $.string_concat_expr, // 86  prec: 6
        $.range_expr, // 87          prec: 7
        $.additive_expr, // 88       prec: 8
        $.multiplicative_expr, // 89 prec: 9
        $.union_expr, // 90          prec: 10
        $.intersect_except_expr, //91 prec: 11
        $.instance_of_expr, // 92    prec: 12
        $.treat_expr, // 93          prec: 13
        $.castable_expr, // 94       prec: 14
        $.cast_expr, // 95           prec: 15
        $.arrow_expr, // 96          prec: 16
        $.unary_expr, //  97         prec: 17 '-' '+' arithmetic prefix right to left */
        $.bang_expr, //107           prec: 18
        seq($._postfix_expr, optional($.path_expr)),
        $.path_expr,
        $._primary_expr,
        $.qname
      ),
    flwor_expr: ($) => prec(2, seq($._initial_clause, optional($._intermediate_clause), $.return_clause)), // 41
    _initial_clause: ($) => choice($.for_clause, $.let_clause), // 42
    _intermediate_clause: ($) => repeat1(choice($._initial_clause, $.where_clause, $.group_by_clause, $.order_by_clause, $.count_clause)), // 43',
    for_clause: ($) => seq('for', $.for_binding, repeat(seq(',', $.for_binding))), // 44',
    for_binding: ($) =>
      seq(
        $.var_ref,
        optional($.type_declaration),
        optional(seq('allowing', 'empty')),
        optional(seq('at', field('positional_variable', $.var_ref))),
        'in',
        field('binding_sequence', $._expr_single)
      ), // 45
    let_clause: ($) => seq('let', $.let_binding, repeat(seq(',', $.let_binding))), // 48
    let_binding: ($) => seq(field('var_name', $.var_ref), optional($.type_declaration), ':=', $._expr_single), // 49
    count_clause: ($) => seq('count', '$', field('var_name', $._EQName)), //   59
    where_clause: ($) => seq('where', $._expr_single), // 60
    group_by_clause: ($) => seq('group', 'by', $.grouping_spec, repeat(seq(',', $.grouping_spec))), // 61
    grouping_spec: ($) =>
      seq('$', field('var_name', $._EQName), optional(seq(optional($.type_declaration), ':=', $._expr_single)), optional(seq('collation', field('uri', $.string_literal)))), // 63
    order_by_clause: ($) => prec.left(seq(optional('stable'), 'order', 'by', $._order_spec_list)), // 65
    _order_spec_list: ($) => seq($._order_spec, repeat(seq(',', $._order_spec))), // 66
    _order_spec: ($) => seq(field('order_expr', $._expr_single), field('order_modifier', seq(optional($.order_direction), optional($.order_length), optional($.order_collaction)))), // 67
    order_direction: ($) => seq(choice('ascending', 'descending')),
    order_length: ($) => seq('empty', choice('greatest', 'least')),
    order_collaction: ($) => seq('collation', field('uri', $.string_literal)),
    return_clause: ($) => seq('return', $._expr_single), // 69
    // end flwor
    quantified_expr: ($) =>
      prec(
        2,
        seq(
          choice('some', 'every'),
          field('quantifier', $.var_ref),
          optional($.type_declaration),
          'in',
          field('in_binding', seq($._expr_single, repeat(seq(',', $.var_ref, optional($.type_declaration), 'in', $._expr_single)))),
          'satisfies',
          field('satisfy_conditional', $._expr_single)
        )
      ), // 70
    switch_expr: ($) =>
      prec(
        2,
        seq(
          'switch',
          field('switch_operand', seq('(', $._expr, ')')),
          repeat1($.switch_clause),
          field('switch_default', seq('default', 'return', field('default_return', $._expr_single)))
        )
      ), // 71
    switch_clause: ($) => seq(repeat1(seq('case', field('case_operand', $._expr_single))), 'return', field('case_return', $._expr_single)), // 72
    typeswitch_expr: ($) =>
      prec(
        2,
        seq(
          'typeswitch',
          field('operand', seq('(', $._expr, ')')),
          repeat1(field('case', $._typeswitch_clause)),
          field('default', seq('default', optional($.var_ref), 'return', $._expr_single))
        )
      ), // 74
    _typeswitch_clause: ($) => seq('case', optional(seq($.var_ref, 'as')), $.sequence_type, repeat(seq('|', $.sequence_type)), 'return', $._expr_single), // 75
    if_expr: ($) => prec(2, seq('if', field('if_test', seq('(', $._expr, ')')), 'then', field('if_consequence', $._expr_single), 'else', field('if_alternative', $._expr_single))), // 77
    try_catch_expr: ($) => prec(2, seq($.try_clause, $.catch_clause)), // 78
    try_clause: ($) => seq('try_target', $.enclosed_expr), // 79
    catch_clause: ($) => seq('catch', $.catch_error_list, $.enclosed_expr), // 81
    catch_error_list: ($) => seq($.name_test, repeat(seq('|', $.name_test))), // 82
    or_expr: ($) => prec.left(3, seq(field('lhs', $._expr_single), 'or', field('rhs', $._expr_single))), // 83
    and_expr: ($) => prec.left(4, seq(field('lhs', $._expr_single), 'and', field('rhs', $._expr_single))), // 84
    comparison_expr: ($) => prec.left(5, seq(field('lhs', $._expr_single), $._comparison_ops, field('rhs', $._expr_single))), // 85
    _comparison_ops: ($) => choice($._value_comp, $._general_comp, $._node_comp),
    _value_comp: ($) => choice('eq', 'ne', 'lt', 'le', 'gt', 'ge'), // 100
    _general_comp: ($) => choice('=', '!=', '<', '<=', '>', '>='), // 99
    _node_comp: ($) => choice('is', '<<', '>>'), // 101
    string_concat_expr: ($) => prec.left(6, seq(field('lhs', $._expr_single), repeat1(seq('||', field('rhs', $._expr_single))))), // 86
    range_expr: ($) => prec.left(7, seq(field('lhs', $._expr_single), 'to', field('rhs', $._expr_single))), //87
    additive_expr: ($) => prec.left(8, seq(field('lhs', $._expr_single), repeat1(seq(choice('+', '-'), field('rhs', $._expr_single))))), //88
    multiplicative_expr: ($) => prec.left(9, seq(field('lhs', $._expr_single), repeat1(seq(choice('*', 'div', 'idiv', 'mod'), field('rhs', $._expr_single))))),
    union_expr: ($) => prec.left(10, seq(field('lhs', $._expr_single), repeat1(seq(choice('union', '|'), field('rhs', $._expr_single))))), //90
    intersect_except_expr: ($) => prec.left(11, seq(field('lhs', $._expr_single), repeat1(seq(choice('intersect', 'except'), field('rhs', $._expr_single))))), //91
    instance_of_expr: ($) => prec.left(12, seq(field('lhs', $._expr_single), 'instance', 'of', field('rhs', $.sequence_type))), // 92
    treat_expr: ($) => prec(13, seq(field('lhs', $._expr_single), 'treat', 'as', field('rhs', $.sequence_type))), // 93
    castable_expr: ($) => prec(14, seq(field('lhs', $._expr_single), 'castable', 'as', field('simple_type', seq($._EQName, optional(token.immediate('?')))))), // 94
    cast_expr: ($) => prec(14, seq(field('lhs', $._expr_single), 'cast', 'as', field('simple_type', seq($._EQName, optional(token.immediate('?')))))), // 94
    arrow_expr: ($) => prec.left(16, seq(field('expression_value', $._expr_single), repeat1(seq('=>', $.arrow_function)))), // 94
    arrow_function: ($) => seq(choice($._EQName, $.var_ref, $.parenthesized_expr), $.arg_list), // 127
    unary_expr: ($) => prec.right(17, seq(choice('+', '-'), $._expr_single)),
    bang_expr: ($) => prec.left(18, seq(field('sequence', $._expr_single), repeat1(seq('!', field('dynamic_context', $._expr_single))))), // 107
    _postfix_expr: ($) => prec.left(20, seq($._primary_expr, repeat($._postfix))),
    _postfix: ($) =>
      seq(choice(prec.left(20, field('filter_expr', $.predicate)), prec.left(20, field('dynamic_function_call', $.arg_list)), prec.left(20, field('postfix_lookup', $.lookup)))),
    predicate: ($) => prec.left(20, seq('[', $._expr_single, ']')), // 124
    lookup: ($) => prec.left(20, seq('?', field('Key', choice($.NCName, $.integer_literal, $.parenthesized_expr, alias('*', $.wildcard))))),
    path_expr: ($) => prec.left(19, seq(choice('/', '//'), $._rel_path_expr)), // initial xpath start
    _rel_path_expr: ($) => seq($._step_expr, repeat(seq(choice('/', '//'), $._step_expr))),
    _step_expr: ($) => choice($._postfix_expr, $._axis_step),
    _axis_step: ($) => seq(field('axis_movement', choice($._forward_step, $.reverse_step)), repeat(prec.left(20, field('filter', $.predicate)))), //  predicate within steps 123
    reverse_step: ($) => choice($.reverse_axis, '..'),
    _forward_step: ($) => choice($.forward_axis, $.abbrev_forward_step),
    forward_axis: ($) => seq(choice('child', 'descendant', 'attribute', 'self', 'descendant-or-self', 'following-sibling', 'following'), '::', $._node_test), //113
    reverse_axis: ($) => seq(choice('parent', 'ancestor', 'preceding-sibling', 'preceding', 'ancestor-or-self'), '::', $._node_test), //116
    abbrev_forward_step: ($) => seq(optional('@'), $._node_test),
    _node_test: ($) => choice($.name_test, $.kind_test), // 118
    name_test: ($) => choice($._EQName, $.wildcard), //  199
    wildcard: ($) => choice('*', seq($.NCName, ':*'), seq('*:', $.NCName), seq($.braced_uri_literal, '*')), // 120
    _primary_expr: ($) =>
      choice(
        $._literal,
        $.var_ref,
        $.parenthesized_expr, // 133
        $.context_item_expr, // 134 LSP If the context item is absent, a context item expression raises a dynamic error
        $.function_call, // 137
        $.ordered_expr, // 135
        $.unordered_expr, // 136
        $._direct_constructor, // 141 node constructors 140
        $._computed_constructor, // 155 // node constructors 140
        $.named_function_ref, // 168  function item 167
        $.inline_function_expr, // 169 function item 167
        $.map_constructor, // 170
        $.square_array_constructor, // 175 array_constructor 174
        $.curly_array_constructor, // 176  array_constructor 174
        $.string_constructor, // 177
        $.unary_lookup // 181
      ),
    //_direct_constructor: ($) => choice($.direct_element, $.direct_comment, $.direct_pi), //141
    _direct_constructor: ($) => $.direct_element, //141
    direct_element: ($) => choice(seq($.start_tag, repeat($._direct_element_content), $.end_tag), $.empty_tag),
    _direct_element_content: ($) => choice($._direct_constructor, $._common_content, $._element_content_char),
    start_tag: ($) => seq('<', $._QName, repeat($.direct_attribute), '>'),
    end_tag: ($) => seq('</', $._QName, '>'),
    empty_tag: ($) => seq('<', $._QName, repeat($.direct_attribute), '/>'),
    direct_attribute: ($) => seq(field('attr_name', $._QName), '=', field('attr_value', $.direct_attribute_value)),
    direct_attribute_value: ($) =>
      choice(seq('"', repeat(choice($._common_content, $._escape_quote, /[^"&]/)), '"'), seq("'", repeat(choice($._common_content, $._escape_apos, /[^'&]/)), "'")),
    _common_content: ($) => choice($._predefined_entity_ref, $._char_ref, '{{', '}}', $.enclosed_expr),
    _element_content_char: ($) => /[^{}<&]/,
    _computed_constructor: ($) =>
      choice(
        $.comp_doc_constructor, // 156
        $.comp_elem_constructor, // 157
        $.comp_attr_constructor, // 158
        $.comp_namespace_constructor, // 160
        $.comp_text_constructor, // 164
        $.comp_comment_constructor, // 165
        $.comp_pi_constructor // 166
      ), // 155
    comp_doc_constructor: ($) => seq('document', field('content', $.enclosed_expr)), // 156
    comp_elem_constructor: ($) => seq('element', $._construct), //157
    comp_attr_constructor: ($) => seq('attribute', $._construct), //158
    _construct: ($) => seq(field('name', choice($._EQName, seq('{', $._expr, '}'))), field('content', $.enclosed_expr)),
    comp_text_constructor: ($) => seq('text', field('content', $.enclosed_expr)),
    comp_comment_constructor: ($) => seq('comment', field('content', $.enclosed_expr)),
    comp_pi_constructor: ($) => seq('processing-instruction', field('name', choice($.NCName, seq('{', $._expr, '}'))), field('content', $.enclosed_expr)), // 166
    comp_namespace_constructor: ($) => seq('namespace', field('name', choice($.NCName, seq('{', $._expr, '}'))), field('content', $.enclosed_expr)), // 160
    _literal: ($) => choice($._numeric_literal, $.string_literal),
    var_ref: ($) => seq('$', $._var_name),
    parenthesized_expr: ($) => seq('(', optional($._expr), ')'), // 133
    context_item_expr: ($) => '.',
    function_call: ($) => seq($._EQName, $.arg_list), // grammar-note: parens  lookahead comment pragma
    arg_list: ($) => seq('(', optional(seq($._argument, repeat(seq(',', $._argument)))), ')'), // 122
    _argument: ($) => field('arg', choice($._expr_single, $.placeholder)),
    placeholder: ($) => '?',
    ordered_expr: ($) => seq('ordered', $.enclosed_expr), // 135
    unordered_expr: ($) => seq('unordered', $.enclosed_expr), // 136
    unary_lookup: ($) => prec.left(21, seq('?', field('key', choice($.NCName, $.integer_literal, $.parenthesized_expr, alias('*', $.wildcard))))), // 181
    named_function_ref: ($) => seq($._EQName, token.immediate('#'), field('signature', $.integer_literal)),
    inline_function_expr: ($) => seq(optional($.annotation), 'function', '(', optional($.param_list), ')', field('function_body', $.enclosed_expr)),
    // 2.5.4 SequenceType Syntax
    type_declaration: ($) => seq('as', $.sequence_type),
    sequence_type: ($) => prec.left(choice($.empty_sequence, $._item)), // 184
    empty_sequence: ($) => seq('empty-sequence', '(', ')'),
    _item: ($) => prec.right(seq($._item_type, optional($.occurrence_indicator))),
    _item_type: ($) =>
      choice(
        $.kind_test,
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
    occurrence_indicator: ($) => choice('?', '*', '+'), // 185
    atomic_or_union_type: ($) => $._EQName, // 187
    any_item: ($) => seq('item', '(', ')'),
    kind_test: ($) =>
      choice(
        $.document_test,
        $.element_test,
        $.attribute_test,
        $.schema_element_test,
        $.schema_attribute_test,
        $.pi_test,
        $.any_kind_test,
        $.comment_test,
        $.namespace_node_test,
        $.text_test
      ),
    any_kind_test: ($) => seq('node', '(', ')'), // 189
    text_test: ($) => seq('text', '(', ')'), // 191
    comment_test: ($) => seq('comment', '(', ')'), // 192
    namespace_node_test: ($) => seq('namespace-node', '(', ')'), // 193
    document_test: ($) => seq('document-node', '(', optional(choice($.element_test, $.schema_element_test)), ')'), // 190
    element_test: ($) => seq('element', field('type_params', seq('(', optional($.element_test_params), ')'))), // 199
    element_test_params: ($) =>
      seq(field('param', choice(alias('*', $.wildcard), $._EQName)), optional(seq(',', field('param', seq($._EQName, optional(alias('?', $.occurrence_indicator))))))),
    // same as element but no nilled test as attributes don't have children
    attribute_test: ($) => seq('attribute', '(', optional(seq($._attrib_name_or_wildcard, optional(seq(',', field('type_name', $._EQName))))), ')'), // 195
    _attrib_name_or_wildcard: ($) => choice(field('attribute_name', $._EQName), alias('*', $.wildcard)), //196
    /* optional(
          seq(
            field('param', choice(alias('*', $.wildcard), $._EQName)),
            optional(seq(',', field('param', $._EQName)))
          )
        ), */
    /* ')'
      ),  */
    schema_element_test: ($) => seq('schema-element', '(', field('element_name', $._EQName), ')'), //197
    schema_attribute_test: ($) => seq('schema-attribute', '(', field('attribute_name', $._EQName), ')'), //201
    pi_test: ($) => seq('processing-instruction', seq('(', optional(field('param', choice($.NCName, $.string_literal))), ')')), // 194
    //wildcard: ($) => choice('*', seq($.NCName, ':*'), seq('*:', $.NCName), seq($.braced_uri_literal, '*')), // 120
    any_function_test: ($) => seq(repeat($.annotation), 'function', seq('(', alias('*', $.wildcard), ')')), //  // 207
    typed_function_test: ($) => seq(repeat($.annotation), 'function', '(', $.sequence_type, repeat(seq(',', $.sequence_type)), ')', $.type_declaration),
    any_map_test: ($) => seq('map', '(', alias('*', $.wildcard), ')'), // 210
    typed_map_test: ($) => seq('map', '(', $.atomic_or_union_type, ',', $.sequence_type, ')'), // 212
    any_array_test: ($) => seq('array', '(', alias('*', $.wildcard), ')'),
    typed_array_test: ($) => seq('array', '(', $.sequence_type, ')'),
    parenthesized_item_type: ($) => seq('(', $._item_type, ')'), // 216
    // END SequenceType Syntax
    annotation: ($) => seq('%', field('anno_name', $._EQName), field('anno_body', optional(seq('(', $._literal, repeat(seq(',', $._literal)), ')')))), // 27
    enclosed_expr: ($) => seq('{', optional($._expr), '}'), // 5
    map_constructor: ($) => seq('map', seq('{', optional($.map_entry), repeat(seq(',', $.map_entry)), '}')), //170
    map_entry: ($) => seq(field('key', $._expr_single), ':', field('value', $._expr_single)),
    curly_array_constructor: ($) => seq('array', field('content', $.enclosed_expr)),
    square_array_constructor: ($) => seq('[', optional($._expr_single), repeat(seq(',', $._expr_single)), ']'),
    string_constructor: ($) => seq('``[', repeat(choice(/[^`][^{]/, $.interpolation)), ']``'), // 177
    interpolation: ($) => seq('`{', $._expr, '}`'), // 180',
    string_literal: ($) =>
      choice(
        seq('"', repeat(choice($._predefined_entity_ref, $._char_ref, $._escape_quote, /[^"&]/)), token.immediate('"')),
        seq("'", repeat(choice($._predefined_entity_ref, $._escape_apos, /[^'&]/)), token.immediate("'"))
      ),
    _predefined_entity_ref: ($) => /&(lt|gt|amp|quot|apos);/,
    _escape_quote: ($) => '""',
    _escape_apos: ($) => "''",
    _char_ref: ($) => regexOr('&#[0-9]+;', '&#x[0-9a-fA-F]+;'),
    _numeric_literal: ($) => choice($.double_literal, $.decimal_literal, $.integer_literal),
    double_literal: ($) => /(\.\d+)|(\d+\.\d*|\d+)[eE][+-]{0,1}\d+/,
    decimal_literal: ($) => /(\.\d+)|(\d+\.\d*)/,
    integer_literal: ($) => /\d+/,
    _var_name: ($) => choice($._QName, $.uri_qualified_name),
    _EQName: ($) => choice($._QName, $.uri_qualified_name),
    _QName: ($) => choice(field('unprefixed', $.identifier), seq(field('prefix', $.identifier), token.immediate(':'), field('local', $.identifier))),
    qname: ($) => choice(field('unprefixed', $.identifier), seq(field('prefix', $.identifier), token.immediate(':'), field('local', $.identifier))),
    NCName: ($) => $.identifier, // 123
    //op: $ => choice('to'),
    uri_qualified_name: ($) => seq(field('braced_uri_literal', alias($.braced_uri_literal, $.identifier)), field('local', $.identifier)), //ws explicitly
    braced_uri_literal: ($) => seq('Q{', repeat1(regexOr('&(#[0-9]+|#x[0-9a-fA-F]+);', '&(lt|gt|amp|quot|apos);', '[^&{}]')), token.immediate('}')),
    identifier: ($) => /[_\p{XID_Start}][-_\p{XID_Continue}]*/,
    comment: ($) => seq(/[(][:]/, repeat($.comment_contents), token.immediate(/[:][)]/)),
    comment_contents: ($) =>
      prec.right(
        repeat1(
          regexOr(
            '[^:()]', // any symbol except reserved
            '[^:][)]', // closing parenthesis, which is not a comment end
            '[(][^:]', // opening parenthesis, which is not a comment start
            '[(][:][^:][^:]', // opening parenthesis
            '[(][:][:][^)]', // opening parenthesis
            '[:][^)]'
          )
        )
      ), //  : and anything but )
  },
});
