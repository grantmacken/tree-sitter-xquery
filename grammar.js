const UNICODE_LETTER = /\p{L}/,
  UNICODE_DIGIT = /[0-9]/,
  NAME_START_CHAR = /[_\p{XID_Start}]/, // choice(UNICODE_LETTER, "_"),
  NAME_CHAR = /[-_\p{XID_Continue}]/, // choice(NAME_START_CHAR, "-", ".", UNICODE_DIGIT),
  INTEGER = repeat1(UNICODE_DIGIT),
  DOUBLE = seq(
    repeat(UNICODE_DIGIT),
    optional(seq(".", repeat(UNICODE_DIGIT))),
    /[eE]/,
    optional(/[+-]/),
    repeat1(UNICODE_DIGIT)
  ), // TODO check
  DECIMAL = seq(repeat(UNICODE_DIGIT), ".", repeat(UNICODE_DIGIT));

function commaSep1(rule) {
  return seq(rule, repeat(seq(",", rule)));
}

function commaSep(rule) {
  return optional(commaSep1(rule));
}

function regexOr(regex) {
  if (arguments.length > 1) {
    regex = Array.from(arguments).join('|');
  }
  return {
    type: 'PATTERN',
    value: regex
  };
}

/*
// https://www.w3.org/TR/xquery-31/#id-reserved-fn-names
// https://github.com/tree-sitter/tree-sitter/pull/246
//The reserved property
/* In order improve this error recovery, the grammar author needs a way to explicitly indicate that certain keywords are reserved. That is - even if they are not technically valid, they should still be recognized as separate from any other tokens that would match that string (such as an identifier */

module.exports = grammar({
  name: "xquery",
  // Whitespace and Comments function as symbol separators
  extras: ($) => [$.comment, /\s/],
  reserved: ($) => [
    "array",
    "attribute",
    "comment",
    "document-node",
    "element",
    "empty-sequence",
    "function",
    "if",
    "item",
    "map",
    "namespace-node",
    "node",
    "processing-instruction",
    "schema-attribute",
    "schema-element",
    "switch",
    "text",
    "typeswitch",
  ],
  // word: ($) => $.kw,
  word: ($) => $.identifier,
  conflicts: ($) => [[$._expr, $._step_expr]],
  supertypes: ($) => [$._prolog],
  rules: {
    module: ($) =>
      seq(
        optional($.version_declaration),
        choice($.library_module, $.main_module)
      ),
    library_module: ($) =>
      seq($.module_declaration, repeat(seq($._prolog, ";"))),
    main_module: ($) => seq(repeat(seq($._prolog, ";")), $._query_body),
    _prolog: ($) =>
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
        $.module_import,
        $.context_item_declaration,
        $.variable_declaration,
        $.function_declaration,
        $.option_declaration
      ),
    _query_body: ($) => seq($._expr, repeat(seq(prec(1, ","), $._expr))),
    _expr: ($) =>
      choice(
        $._primary_expr,
        // statement like expressions all prec 2
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
        $.intersect_except_expr, //91 prec: 11
        $.instance_of_expr, // 92    prec: 12
        $.treat_expr, // 93          prec: 13
        $.castable_expr, // 94       prec: 14
        $.cast_expr, // 95           prec: 15
        $.arrow_expr, // 96          prec: 16
        $.unary_expr, //  97         prec: 17 '-' '+' arithmetic prefix right to left
        $.bang_expr, //107           prec: 18
        $.path_expr //108           prec: 19   '/' '//'  not relative path?
        //  $.predicate //124        prec: 20 @primary postfix predicate '[' ']'
        //  $.postfix_lookup //125   prec: 20 @primary postfix lookup   '?'
        //  $.unary_lookup,// 181    prec: 21 @primary unary lookup
        //seq($._primary_expr, optional( $._postfix_expr ))
        //
      ),
    // 3.1 Primary Expressions set as highest prec
    _primary_expr: ($) =>
      prec.left(
        23,
        seq(
          choice(
            $.enclosed_expr, // 36,
            $._literal, // 57
            $.var_ref, // 59
            $.parenthesized_expr, // 133
            $.context_item_expr, // 134
            $.ordered_expr, // 135
            $.unordered_expr, // 136
            $.function_call, // 137
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
          optional($._postfix_expr)
        )
      ),
    // 3.1.1 Literals
    _literal: ($) => choice($.string_literal, $._numeric_literal),
    string_literal: $ => choice(
      seq( '"',repeat( choice( $._predefined_entity_ref,  $._char_ref ,$._escape_quote,/[^"&]/ )),token.immediate('"')),
      seq( "'",repeat( choice( $._predefined_entity_ref, $._escape_apos, /[^'&]/ )),token.immediate("'"))),
    _predefined_entity_ref: $ => /&(lt|gt|amp|quot|apos);/,
    _escape_quote: $ => '""',
    _escape_apos: $ => "''",
    _numeric_literal: ($) => choice($.double_literal, $.decimal_literal,$.integer_literal,),
    double_literal: $ => seq(regexOr( '[0-9]+','\.[0-9]+','[0-9]+\.[0-9]*' ) , token.immediate( /[eE][+-]{0,1}[0-9]+/)),
    decimal_literal: $ => regexOr( '\.[0-9]+','[0-9]+\.[0-9]*' ) ,
    integer_literal: $ => /[0-9]+/,
    //3.1.2 Variable References
    var_ref: ($) => seq("$", $._EQName),
    // note: a dynamic function call can consist of _postfix_expr [ var + arg_list ]
    // 3.1.3 Parenthesized Expressions
    parenthesized_expr: ($) => seq("(", optional($._query_body), ")"), // 133
    //3.1.4 Context Item Expression TODO not like spec
    context_item_expr: ($) => prec.left(seq(".", optional($.path_expr))),
    //3.1.5 Static Function Calls
    function_call: ($) =>
      prec.left(25, seq(choice($.var_ref, $._EQName), $.arg_list)), // 137 spec deviation added $var
    // 3.1.6 Named Function References
    named_function_ref: ($) =>
      seq(
        field("function_name", $._EQName),
        "#",
        field("signature", $.integer_literal)
      ),
    // 3.1.7 Inline Function Expr
    //    arg_list: ($) => prec(1, seq("(", commaSep($._argument), ")")), // 122
    // _argument: ($) => prec.left(19, field("argument", choice($._expr, "?"))), // 138
    inline_function_expr: ($) =>
      seq(
        optional($.annotation),
        "function",
        $.param_list,
        optional(field("result_type", $.type_declaration)),
        field("body", $.enclosed_expr)
      ), // 169
    param_list: ($) => prec(1, seq("(", commaSep($.parameter), ")")), // seq("(", commaSep($.parameter), ")"),
    parameter: ($) =>
      seq(
        field("param_name", $.var_ref),
        optional(field("param_type", $.type_declaration))
      ),
    // 3.1.8 Enclosed Expressions: when content empty then empty parenthesized_expr {()} is assumed
    enclosed_expr: ($) => seq("{", optional($._query_body), "}"), // 5
    // 3.2 Postfix Expressions TODO
    //_postfix_expr: $ =>  seq($._primary_expr, optional(repeat1(choice($.predicate, $.arg_list, $.postfix_lookup)))), // 49
    _postfix_expr: ($) =>
      repeat1(choice($.predicate, $.postfix_lookup, $.arg_list)), // 49
    // 3.2.1 Filter Expressions TODO tests
    predicate: ($) => prec(20, seq("[", field("filter", $._query_body), "]")), //124
    // 3.2.2 Dynamic Function Calls
    arg_list: ($) => prec(1, seq("(", commaSep($._argument), ")")), // 122
    _argument: ($) => prec.left(19, field("argument", choice($._expr, "?"))), // 138
    // 3.3 Path Expressions
    // https://docs.oracle.com/cd/E13190_01/liquiddata/docs81/xquery/query.html
    path_expr: ($) =>
      prec.left(
        19,
        choice(
          seq("/", optional($._relative_path_expr)), //parse-note-leading-lone-slash
          seq("//", $._relative_path_expr), // must have relative_path_expr
          $._relative_path_expr // can stand alone
        )
      ),
    _relative_path_expr: ($) =>
      prec.left(
        field(
          "step",
          seq(
            $._step_expr,
            optional(repeat1(seq(choice("/", "//"), $._step_expr)))
          )
        )
      ), //109
    _step_expr: ($) =>
      prec.left(
        choice(seq($._primary_expr, optional($._postfix_expr)), $._axis_step)
      ),
    _axis_step: ($) => prec.left(seq($._step, repeat($.predicate))), // 111 124
    _step: ($) =>
      choice(
        seq(
          field(
            "axis_movement",
            choice($.forward_axis, $.reverse_axis, optional($.abbrev_foward))
          ),
          field("node_test", $._node_test)
        ),
        $.abbrev_reverse
      ),
    abbrev_foward: ($) => "@", // 117
    abbrev_reverse: ($) => "..", // 117
    forward_axis: ($) =>
      seq(
        choice(
          "child",
          "descendant",
          "attribute",
          "self",
          "descendant-or-self",
          "following-sibling",
          "following"
        ),
        "::"
      ), //113
    reverse_axis: ($) =>
      seq(
        choice(
          "parent",
          "ancestor",
          "preceding-sibling",
          "preceding",
          "ancestor-or-self"
        ),
        "::"
      ), //116
    _node_test: ($) =>
      prec.left(
        choice(
          alias($._be_kind, $.name_test), // in this context allow any kind keywords
          $.name_test,
          $._kind_test
        )
      ), // 118'
    _be_kind: ($) =>
      choice(
        field("unprefixed", $._kind_list),
        seq(
          field("prefix", $.identifier),
          token.immediate(":"),
          field("local_part", $._kind_list)
        ),
        seq(
          field("prefix", $._kind_list),
          token.immediate(":"),
          field("local_part", $.identifier)
        ),
        seq(
          field("prefix", $._kind_list),
          token.immediate(":"),
          field("local_part", $._kind_list)
        )
      ),
    _kind_list: ($) =>
      prec.left(
        alias(
          choice(
            "document-node",
            "element",
            "schema-element",
            "attribute",
            "schema-attribute",
            "comment",
            "namespace-node",
            "text",
            "node"
          ),
          $.identifier
        )
      ),
    // seq(field('prefix', $.identifier), token.immediate(':'), field('local_part', $.identifier))
    // end of path expr block
    or_expr: ($) =>
      prec.left(3, seq(field("lhs", $._expr), "or", field("rhs", $._expr))),
    and_expr: ($) =>
      prec.left(4, seq(field("lhs", $._expr), "and", field("rhs", $._expr))),
    comparison_expr: ($) =>
      prec.left(
        5,
        seq(
          field("lhs", $._expr),
          choice(
            "eq",
            "ne",
            "lt",
            "le",
            "gt",
            "ge",
            "=",
            "!=",
            "<",
            "<=",
            ">",
            ">=",
            "is",
            "<<",
            ">>"
          ),
          field("rhs", $._expr)
        )
      ),
    string_concat_expr: ($) =>
      prec.left(
        6,
        seq(field("lhs", $._expr), repeat1(seq("||", field("rhs", $._expr))))
      ), // 86
    range_expr: ($) =>
      prec.left(
        7,
        seq(field("lhs", $._expr), seq("to", field("rhs", $._expr)))
      ),
    additive_expr: ($) =>
      prec.left(
        8,
        seq(field("lhs", $._expr), choice("+", "-"), field("lhs", $._expr))
      ),
    multiplicative_expr: ($) =>
      prec.left(
        9,
        seq(
          field("lhs", $._expr),
          choice("*", "div", "idiv", "mod"),
          field("rhs", $._expr)
        )
      ),
    union_expr: ($) =>
      prec.left(
        10,
        seq(field("lhs", $._expr), choice("union", "|"), field("rhs", $._expr))
      ),
    intersect_except_expr: ($) =>
      prec.left(
        11,
        seq(
          field("lhs", $._expr),
          choice("intersect", "except"),
          field("rhs", $._expr)
        )
      ),
    instance_of_expr: ($) =>
      prec.left(
        12,
        seq(
          field("lhs", $._expr),
          seq("instance", "of"),
          field("rhs", $.sequence_type)
        )
      ), // 92
    treat_expr: ($) =>
      prec(
        13,
        seq(
          field("lhs", $._expr),
          seq("treat", "as"),
          field("rhs", $.sequence_type)
        )
      ), // 93
    castable_expr: ($) =>
      prec(
        14,
        seq(
          field("lhs", $._expr),
          seq("castable", "as"),
          field("rhs", $.single_type)
        )
      ), // 94
    cast_expr: ($) =>
      prec(
        15,
        seq(
          field("lhs", $._expr),
          seq("cast", "as", field("rhs", $.single_type))
        )
      ), // 95
    arrow_expr: ($) =>
      prec.left(
        16,
        seq(field("rhs", $._expr), repeat1(seq("=>", $.arrow_function)))
      ), // 94
    unary_expr: ($) => prec.right(17, seq(choice("+", "-"), $._expr)),
    bang_expr: ($) =>
      prec.left(
        18,
        seq(
          field("lhs", $._expr), // TODO
          repeat1(seq("!", field("rhs", $._expr)))
        )
      ), // 107
    single_type: ($) => prec.left(seq($._EQName, optional("?"))), // 182
    arrow_function: ($) =>
      seq(choice($._EQName, $.var_ref, $.parenthesized_expr), $.arg_list), // 127
    _direct_constructor: ($) =>
      choice($.direct_element, $.direct_comment, $.direct_pi), //141
    direct_comment: ($) => token(seq("<!--", repeat(/[^-]/), "-->")), // TODO
    direct_pi: ($) => token(seq("<?", repeat(/[^?]/), "?>")), // TODO
    direct_element: ($) =>
      choice(
        seq(
          $.start_tag,
          repeat(choice($._direct_constructor, $.element_text)),
          $.end_tag
        ),
        $.empty_tag
      ),
    start_tag: ($) => seq( "<", $.qname,repeat($.direct_attribute), ">"),
    end_tag: ($) => seq("</", $.qname, ">"),
    empty_tag: ($) => seq( "<", $.qname,repeat($.direct_attribute), "/>"),
    element_text: ($) => choice($._common_content, $.char_data),
    direct_attribute: ($) => seq(field("attr_name",$.qname ),"=",field("attr_value", $.direct_attribute_value)),
    direct_attribute_value: ($) => choice(
      seq('"',repeat(choice($._common_content, $._escape_quote, /[^"&]/)),'"'),
      seq("'", repeat(choice($._common_content, $._escape_apos, /[^'&]/)), "'")),
    _common_content: ($) =>
      choice(
        $._predefined_entity_ref,
        $._char_ref,
        $._escape_curly,
        $.enclosed_expr
      ),
    char_data: ($) => /[^{}<&]+/,
    _char_ref: $ => regexOr('&#[0-9]+;','&#x[0-9a-fA-F]+;'),
    _escape_curly: ($) => choice("{{", "}}"),
    // 3.9.3 Computed Constructors TODO make Computed Constructors a supertype
    _computed_constructor: ($) =>
      choice(
        $.comp_elem_constructor,
        $.comp_attr_constructor,
        $.comp_doc_constructor,
        $.comp_text_constructor,
        $.comp_comment_constructor,
        $.comp_namespace_constructor,
        $.comp_pi_constructor
      ), // 155
    comp_elem_constructor: ($) => seq("element", $._name_content),
    comp_attr_constructor: ($) => seq("attribute", $._name_content),
    _name_content: ($) =>
      seq(
        field("name", choice($._EQName, seq("{", commaSep($._expr), "}"))),
        field("content", $.enclosed_expr)
      ),
    comp_doc_constructor: ($) =>
      seq("document", field("content", $.enclosed_expr)),
    comp_text_constructor: ($) =>
      seq("text", field("content", $.enclosed_expr)),
    comp_comment_constructor: ($) =>
      seq("comment", field("content", $.enclosed_expr)),
    comp_pi_constructor: ($) =>
      seq(
        "processing-instruction",
        field("name", choice($.NCName, seq("{", commaSep($._expr), "}"))),
        field("content", $.enclosed_expr)
      ), // 166
    comp_namespace_constructor: ($) =>
      seq(
        "namespace",
        field("name", choice($.NCName, $.enclosed_expr)), //@see 3.9.3.7
        field("content", $.enclosed_expr)
      ), // 160
    string_constructor: ($) =>
      seq("``[", repeat(choice($.char_group, $.interpolation)), "]``"), // 177
    // TODO this is not correct  string content is external in other tree sitters
    char_group: ($) => token(prec.left(repeat1(/[^`\]]/))), // TODO
    interpolation: ($) => seq("`{", commaSep($._expr), "}`"), // 1p80',
    //3.11 Maps and Arrays
    map_constructor: ($) => seq("map", seq("{", commaSep($.map_entry), "}")), //170
    map_entry: ($) => seq(field("key", $._expr), ":", field("value", $._expr)),
    // 3.11.2 Arrays
    _array_constructor: ($) =>
      choice($.curly_array_constructor, $.square_array_constructor), // 174 TODO ,
    curly_array_constructor: ($) =>
      seq("array", field("content", $.enclosed_expr)),
    square_array_constructor: ($) => seq("[", commaSep($._expr), "]"),
    postfix_lookup: ($) => prec.left(20, seq("?", $._key_specifier)), // 125
    unary_lookup: ($) => prec.left(21, seq("?", $._key_specifier)),
    _key_specifier: ($) =>
      choice(
        $.NCName,
        $.lookup_digit,
        $.parenthesized_expr,
        alias("*", $.wildcard)
      ), // 54
    lookup_digit: ($) => repeat1(/\d/),
    //##########################
    // 3.12 FLWOR Expressions
    flwor_expr: ($) =>
      prec(
        2,
        seq(
          $._initial_clause,
          optional($._intermediate_clause),
          $.return_clause
        )
      ), // 41
    _initial_clause: ($) =>
      choice(
        $.for_clause, // 44
        $.let_clause // 48
      ),
    //3.12.2 For Clause
    for_clause: ($) => seq("for", commaSep($.for_binding)), // 44',
    for_binding: ($) =>
      seq(
        $.var_ref,
        optional($.type_declaration),
        optional(seq("allowing", "empty")),
        optional(seq("at", field("positional_variable", $.var_ref))),
        "in",
        field("binding_sequence", $._expr)
      ), // 45
    // 3.12.3 Let Clause
    let_clause: ($) => seq("let", commaSep1($.let_binding)),
    let_binding: ($) =>
      seq(
        field("var_name", $.var_ref),
        optional($.type_declaration),
        ":=",
        $._expr
      ),
    _intermediate_clause: ($) =>
      repeat1(
        choice(
          $._initial_clause,
          $.where_clause,
          $.group_by_clause,
          $.order_by_clause,
          $.count_clause
        )
      ), // 43',
    // 3.12.4 Window Clause:
    //3.12.5 Where Clause
    where_clause: ($) => seq("where", $._expr), // 60
    // 3.12.6 Count Clause
    count_clause: ($) => seq("count", "$", field("var_name", $._EQName)), //   59
    // 3.12.7 Group By Clause
    group_by_clause: ($) => seq("group", "by", commaSep1($._grouping_spec)), // 61
    _grouping_spec: ($) =>
      seq(
        "$",
        field("var_name", $._EQName),
        optional(seq(optional($.type_declaration), ":=", $._expr)),
        optional(seq("collation", field("uri", $.string_literal)))
      ), // 63
    // 3.12.8 Order By Clause
    order_by_clause: ($) =>
      prec.left(seq(optional("stable"), "order", "by", $._order_spec_list)), // 65
    _order_spec_list: ($) =>
      seq($._order_spec, repeat(seq(",", $._order_spec))),
    _order_spec: ($) =>
      seq(
        field("order_expr", $._expr), // exprSingle
        field(
          "order_modifier",
          seq(
            optional($.order_direction),
            optional($.order_length),
            optional($.order_collaction)
          )
        )
      ),
    order_direction: ($) => seq(choice("ascending", "descending")),
    order_length: ($) => seq("empty", choice("greatest", "least")),
    order_collaction: ($) => seq("collation", field("uri", $.string_literal)),
    //3.12.9 Return Clause
    return_clause: ($) => seq("return", $._expr), // 69
    // end flwor
    // ++++++++++++++++++++++++++++++++++++++++++++++++++
    // 3.13 Ordered and Unordered Expressions
    ordered_expr: ($) => seq("ordered", $.enclosed_expr), // 135
    unordered_expr: ($) => seq("unordered", $.enclosed_expr), // 136
    // 3.14 Conditional Expressions
    if_expr: ($) =>
      prec(
        2,
        seq(
          "if",
          field("if_test", seq("(", $._query_body, ")")),
          "then",
          field("if_consequence", $._expr),
          "else",
          field("if_alternative", $._expr)
        )
      ),
    // 3.15 Switch Expression
    switch_expr: ($) =>
      prec(
        2,
        seq(
          "switch",
          field("switch_operand", seq("(", $._query_body, ")")),
          repeat1($.switch_clause),
          field(
            "switch_default",
            seq("default", "return", field("default_return", $._expr))
          )
        )
      ), // 71
    switch_clause: ($) =>
      seq(
        "case",
        field("case_operand", $._expr),
        "return",
        field("case_return", $._expr)
      ), // 72
    // 3.16 Quantified Expressions
    quantified_expr: ($) =>
      prec(
        2,
        seq(
          choice("some", "every"),
          field("quantifier", $.var_ref),
          optional($.type_declaration),
          "in",
          field(
            "in_binding",
            seq(
              $._expr,
              repeat(
                seq(",", $.var_ref, optional($.type_declaration), "in", $._expr)
              )
            )
          ),
          "satisfies",
          field("satisfy_conditional", $._expr)
        )
      ),
    // 3.17 Try/Catch Expressions
    try_catch_expr: ($) => prec(2, seq($.try_clause, $.catch_clause)), // 78
    try_clause: ($) => seq("try", $.enclosed_expr), // 78
    catch_clause: ($) => seq("catch", $.catch_error_list, $.enclosed_expr), // 79
    catch_error_list: ($) => seq($.name_test, repeat(seq("|", $.name_test))),
    typeswitch_expr: ($) =>
      prec(
        2,
        seq(
          "typeswitch",
          field("operand", seq("(", commaSep1($._expr), ")")),
          repeat1(field("case", $._typeswitch_clause)),
          field(
            "default",
            seq("default", optional($.var_ref), "return", $._expr)
          )
        )
      ), // 74
    _typeswitch_clause: ($) =>
      seq(
        "case",
        optional(seq($.var_ref, "as")),
        $.sequence_type,
        repeat(seq("|", $.sequence_type)),
        "return",
        $._expr
      ),
    // 3.21 Validate Expressions TODO
    // 3.22 Extension Expressions TODO
    //4.1 Version Declaration
    version_declaration: ($) =>
      seq(
        "xquery",
        choice(
          seq("encoding", $.string_literal),
          seq(
            "version",
            $.string_literal,
            optional(seq("encoding", $.string_literal))
          )
        ),
        ";"
      ),
    //4.2 Module Declaration
    module_declaration: ($) =>
      seq(
        "module",
        "namespace",
        field("name", $.identifier),
        "=",
        field("uri", $.string_literal),
        ";"
      ),
    boundary_space_declaration: ($) =>
      seq("declare", "boundary-space", choice("preserve", "strip")),
    default_collation_declaration: ($) =>
      seq("declare", "default", "collation", field("uri", $.string_literal)),
    base_uri_declaration: ($) =>
      seq("declare", "base-uri", field("uri", $.string_literal)),
    construction_declaration: ($) =>
      seq("declare", "construction", choice("preserve", "strip")),
    ordering_mode_declaration: ($) =>
      seq("declare", "ordering", choice("ordered", "unordered")),
    empty_order_declaration: ($) =>
      seq("declare", "default", "order", "empty", choice("greatest", "least")),
    // 4.9 Copy-Namespaces Declaration
    copy_namespaces_declaration: ($) =>
      seq(
        "declare",
        "copy-namespaces",
        choice("preserve", "no-preserve"),
        ",",
        choice("inherit", "no-inherit")
      ),
    // 4.10 Decimal Format Declaration
    decimal_format_declaration: ($) =>
      seq(
        "declare",
        choice(
          seq("decimal-format", field("name", $._EQName)),
          seq("default", "decimal-format")
        ),
        repeat(seq($._df_property_name, "=", $.string_literal))
      ),
    _df_property_name: ($) =>
      choice(
        "decimal-separator",
        "grouping-separator",
        "infinity",
        "minus-sign",
        "NaN",
        "percent",
        "per-mille",
        "zero-digit",
        "digit",
        "pattern-separator",
        "exponent-separator"
      ),
    schema_import: ($) =>
      seq(
        "import",
        "schema",
        optional(
          field(
            "prefix",
            choice(
              seq("namespace", field("name", $.identifier), "="),
              seq("default", "element", "namespace")
            )
          )
        ),
        field("uri", $.string_literal),
        optional(seq("at", commaSep1($.string_literal)))
      ), // 21
    // 4.12 Module Import // TODO
    module_import: ($) =>
      seq(
        "import",
        "module",
        optional(seq("namespace", field("name", $.identifier), "=")),
        field("uri", $.string_literal),
        optional(seq("at", commaSep1($.string_literal)))
      ),
    namespace_declaration: ($) =>
      seq(
        "declare",
        "namespace",
        field("name", $.identifier),
        "=",
        field("uri", $.string_literal)
      ), // 4.13
    default_namespace_declaration: ($) =>
      seq(
        "declare",
        "default",
        choice("element", "function"),
        "namespace",
        field("uri", $.string_literal)
      ), // 4.14
    //4.15 Annotations
    annotation: ($) =>
      seq(
        "%",
        field("name", $._EQName),
        field("body", optional(seq("(", commaSep($.string_literal), ")")))
      ), // 27
    // 4.16 Variable Declaration
    variable_declaration: ($) =>
      seq(
        "declare",
        repeat($.annotation),
        "variable",
        field("name", $.var_ref),
        optional($.type_declaration),
        choice(
          seq(":=", field("value", $._expr)),
          seq("external", optional(seq(":=", $._expr)))
        )
      ), // 26
    // 4.17 Context Item Declaration
    context_item_declaration: ($) =>
      seq(
        "declare",
        "context",
        "item",
        optional($.type_declaration),
        choice(
          seq(":=", field("var_value", $._expr)),
          seq("external", optional(seq(":=", $._expr)))
        )
      ),
    // 4.18 Function Declaration
    function_declaration: ($) =>
      seq(
        "declare",
        repeat($.annotation),
        "function",
        field("name", $._EQName),
        $.param_list,
        optional($.type_declaration),
        field("body", choice($.enclosed_expr, "external"))
      ),
    //4.19 Option Declaration
    option_declaration: ($) =>
      seq(
        "declare",
        "option",
        field("name", $._EQName),
        field("value", $.string_literal)
      ),

    // 2.5.4 SequenceType Syntax
    type_declaration: ($) => seq("as", $.sequence_type),
    sequence_type: ($) => prec.left(choice($.empty_sequence, $._item)), // 184
    empty_sequence: ($) => seq("empty-sequence", "(", ")"),
    _item: ($) =>
      prec.right(seq($._item_type, optional($.occurrence_indicator))),
    _item_type: ($) =>
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
    occurrence_indicator: ($) => choice("?", "*", "+"), // 185
    atomic_or_union_type: ($) => $._EQName, // 187
    any_item: ($) => seq("item", "(", ")"),
    _kind_test: ($) =>
      field(
        "kind_test",
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
        )
      ),
    any_kind_test: ($) => seq("node", "(", ")"), // 189
    text_test: ($) => seq("text", "(", ")"), // 191
    comment_test: ($) => seq("comment", "(", ")"), // 192
    namespace_node_test: ($) => seq("namespace-node", "(", ")"), // 193
    document_test: ($) =>
      seq(
        "document-node",
        "(",
        optional(choice($.element_test, $.schema_element_test)),
        ")"
      ), // 190
    // wildcard - element() same as element(*)
    element_test: ($) =>
      seq(
        "element",
        field("type_params", seq("(", optional($.element_test_params), ")"))
      ), // 199
    element_test_params: ($) =>
      seq(
        field("param", choice(alias("*", $.wildcard), $._EQName)),
        optional(
          seq(
            ",",
            field(
              "param",
              seq($._EQName, optional(alias("?", $.occurrence_indicator)))
            )
          )
        )
      ),
    // same as element but no nilled test as attributes don't have children
    attribute_test: ($) =>
      seq(
        "attribute",
        "(",
        optional(
          seq(
            $._attrib_name_or_wildcard,
            optional(seq(",", field("type_name", $._EQName)))
          )
        ),
        ")"
      ), // 195
    _attrib_name_or_wildcard: ($) =>
      choice(field("attribute_name", $._EQName), alias("*", $.wildcard)), //196
    /* optional(
          seq(
            field('param', choice(alias('*', $.wildcard), $._EQName)),
            optional(seq(',', field('param', $._EQName)))
          )
        ), */
    /* ')'
      ),  */
    schema_element_test: ($) =>
      seq("schema-element", "(", field("element_name", $._EQName), ")"), //197
    schema_attribute_test: ($) =>
      seq("schema-attribute", "(", field("attribute_name", $._EQName), ")"), //201
    pi_test: ($) =>
      seq(
        "processing-instruction",
        seq(
          "(",
          optional(field("param", choice($.NCName, $.string_literal))),
          ")"
        )
      ), // 194
    name_test: ($) =>
      prec.left(field("name_test", choice($._EQName, $.wildcard))), // TODO 199
    wildcard: ($) =>
      choice(
        "*",
        seq($.NCName, ":*"),
        seq("*:", $.NCName),
        seq($.braced_uri_literal, "*")
      ), // 120
    any_function_test: ($) =>
      seq(
        repeat($.annotation),
        "function",
        seq("(", alias("*", $.wildcard), ")")
      ), //  // 207
    typed_function_test: ($) =>
      seq(
        repeat($.annotation),
        "function",
        "(",
        $.sequence_type,
        repeat(seq(",", $.sequence_type)),
        ")",
        $.type_declaration
      ),
    any_map_test: ($) => seq("map", "(", alias("*", $.wildcard), ")"), // 210
    typed_map_test: ($) =>
      seq("map", "(", $.atomic_or_union_type, ",", $.sequence_type, ")"), // 212
    any_array_test: ($) => seq("array", "(", alias("*", $.wildcard), ")"),
    typed_array_test: ($) => seq("array", "(", $.sequence_type, ")"),
    parenthesized_item_type: ($) => seq("(", $._item_type, ")"), // 216
    // END SequenceType Syntax
    //
    // instances of the grammatical production EQName.
    // EQName is identifier
    var_name: ($) => choice($.qname, $.uri_qualified_name),
    _EQName: $ => choice( $.qname, $.uri_qualified_name ),
    qname: $ => choice( field( 'unprefixed', $.identifier ), seq(field("prefix", $.identifier) , token.immediate(':'), field("local_name", $.identifier))),
    /*
    _QName: ($) =>
      choice(
        field("unprefixed", $.identifier),
        seq(
          field("prefix", $.identifier),
          token.immediate(":"),
          field("local_part", $.identifier)
        )
      ),
*/
    // https://www.w3.org/TR/REC-xml-names/#Qualified%20Names
    //_QName: ($) => prec.right(choice(field('prefixed_name', $._prefixed_name), field('unprefixed_name', $.identifier))), // 234
   /* 
* TODO builin via captures
* ns_builtin: ($) =>
      choice(
        "xml",
        "xs",
        "xsi",
        "fn",
        "map",
        "array",
        "math",
        "err",
        "output",
        "local"
      ),
    */
    kw: ($) =>
      token(
        choice(
          "ancestor",
          "ancestor-or-self",
          "and",
          "array",
          "as",
          "ascending",
          "at",
          "attribute",
          "base-uri",
          "boundary-space",
          "by",
          "case",
          "cast",
          "castable",
          "catch",
          "child",
          "collation",
          "comment",
          "construction",
          "context",
          "copy-namespaces",
          "count",
          "decimal-format",
          "decimal-separator",
          "declare",
          "default",
          "descendant",
          "descendant-or-self",
          "descending",
          "digit",
          "div",
          "document",
          "document-node",
          "element",
          "else",
          "empty",
          "empty-sequence",
          "encoding",
          "end",
          "eq",
          "every",
          "except",
          "exponent-separator",
          "external",
          "following",
          "following-sibling",
          "for",
          "function",
          "ge",
          "greatest",
          "group",
          "grouping-separator",
          "gt",
          "idiv",
          "if",
          "import",
          "in",
          "infinity",
          "inherit",
          "instance",
          "intersect",
          "is",
          "item",
          "lax",
          "le",
          "least",
          "let",
          "lt",
          "map",
          "minus-sign",
          "mod",
          "module",
          "namespace",
          "namespace-node",
          "ne",
          "next",
          "no-inherit",
          "no-preserve",
          "node",
          "of",
          "only",
          "option",
          "or",
          "order",
          "ordered",
          "ordering",
          "parent",
          "pattern-separator",
          "per-mille",
          "percent",
          "preceding",
          "preceding-sibling",
          "preserve",
          "previous",
          "processing-instruction",
          "return",
          "satisfies",
          "schema",
          "schema-attribute",
          "schema-element",
          "self",
          "sliding",
          "some",
          "stable",
          "start",
          "strict",
          "strip",
          "switch",
          "text",
          "then",
          "to",
          "treat",
          "try",
          "tumbling",
          "type",
          "typeswitch",
          "union",
          "unordered",
          "validate",
          "variable",
          "version",
          "when",
          "where",
          "window",
          "xquery",
          "zero-digit"
        )
      ),
    NCName: ($) => $.identifier, // 123
    reserved: ($) =>
      choice(
        "array",
        "attribute",
        "comment",
        "document-node",
        "element",
        "empty-sequence",
        "function",
        "if",
        "item",
        "map",
        "namespace-node",
        "node",
        "processing-instruction",
        "schema-attribute",
        "schema-element",
        "switch",
        "text",
        "typeswitch"
      ),
    uri_qualified_name: $ => seq( 
       field("braced_uri_literal", alias( $.braced_uri_literal,$.identifier )) ,
       field("local_name", $.identifier)), //ws explicitly
    braced_uri_literal: $ => seq( "Q{", 
      repeat1( regexOr( '&(#[0-9]+|#x[0-9a-fA-F]+);','&(lt|gt|amp|quot|apos);','[^&{}]')),
      token.immediate('}')),
    identifier: $ => /[_\p{XID_Start}][-_\p{XID_Continue}]*/,
    comment: $ => seq(/[(][:]/,repeat($.comment_contents),token.immediate(/[:][)]/)),
    comment_contents: $ => prec.right(repeat1( regexOr(
        '[^:()]',  // any symbol except reserved
        '[^:][)]', // closing parenthesis, which is not a comment end
        '[(][^:]',// opening parenthesis, which is not a comment start
        '[(][:][^:][^:]',// opening parenthesis
        '[(][:][:][^)]',// opening parenthesis
        '[:][^)]'))), //  : and anything but ) 
}});


