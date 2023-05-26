; https://github.com/catppuccin/nvim/blob/main/lua/catppuccin/groups/integrations/treesitter.lua
; fallback identifiers
; ncname: (identifier) @property.ncname
; prefixed: (identifier) @namespace
; local: (identifier) @property.local
; where vars defined
(variable . 
  "$" @variable .
 [ 
    ((identifier) @namespace ":" @punctuation.delimiter (identifier) @variable.local)
    ncname: (identifier) @variable
    ]
  )

; 2.5.1 Predefined Schema Types 
(atomic_or_union_type .
  [
  ((identifier) @type.name .)
  ((identifier) @namespace.local (#not-eq? @namespace.local  "xs") .
  ":" .
  (identifier) @type.local_name 
  )
  ((identifier) @namespace.builtin (#eq? @namespace.builtin  "xs") .
  ":" .
  (identifier) @type.builtin.atomic (#any-of? @type.builtin.atomic 
  "anyAtomicType" "untypedAtomic" "dateTime" "dateTimeStamp" "time" "date" "duration" "yearMonthDuration" "dayTimeDuration" "float" "double" "decimal" "integer" "nonPositiveInteger" "negativeInteger" "long" "int" "short" "byte" "nonNegativeInteger" "unsignedLong" "unsignedInt" "unsignedShort" "unsignedByte" "positiveInteger" "gYearMonth" "gYear" "gMonthDay" "gDay" "gMonth" "string" "normalizedString" "token" "language" "NMTOKEN" "Name" "NCName" "ID" "IDREF" "ENTITY" "boolean" "base64Binary" "hexBinary" "anyURI" "QName" "NOTATION"
  ))
  ]
  )

; 2.5.4 SequenceType Syntax
(type_declaration  "as" @keyword.type_declaration)
(parenthesized_item_type . "(" ")" ) @type.parenthesized_item
(sequence_type "empty-sequence" "(" ")" ) @type.empty_sequence
 name_test: (_) @type.name_test
; note: for name_test also 
(wildcard .
  [ 
    "*" @type.wildcard 
    ((identifier) @type.name . ":*" @type.wildcard)
    ("*:" @type.wildcard . (identifier) @type.name) 
    ((braced_uri_literal) @type.braced_uri . "*" @type.wildcard)
    ]
)

; @type.braced_uri_wildcard


 kind_test: (_) @type.kind_test
 (any_item) @type.any_test
 func_test: (_) @type.func_test
(occurrence_indicator) @type.occurrence



; 3.1 Primary Expressions
; 3.1.1 Literals 
(string_literal [ "'" "\""] @punctuation.bracket.string ) 
(string_constructor_chars) @string
(char_data) @string
[
 (escape_quote)
 (escape_apos)
 (escape_enclosed)
 (char_ref)
 (predefined_entity_ref)
 ] @string.special
; numbers
[(integer_literal) (decimal_literal) (double_literal)] @number
; 3.1.2 Variable References
(var_ref .
  "$" @variable.delimiter .
  [ 
  ((identifier) @namespace . ":"  @punctuation.delimiter . (identifier) @variable.ref_local .)
  ncname: (identifier) @variable.ref
  ]
)

; (_ 
;   [ 
;   (var_ref
;    "$" @variable.delimiter
;    ncname: (identifier) @variable.ref.name)
;    (var_ref 
;     "$" @variable.delimiter
;      prefixed: (identifier) @namespace 
;      ":" @punctuation.delimiter.qname
;      local: (identifier) @variable.ref.local_name
;      )
;    ]
;   )
;3.1.3 Parenthesized Expressions
(parenthesized_expr [ "(" ")" ] @punctuation.bracket.paren_expr)
;3.1.4 Context Item Expression
(context_item_expr) @operator.context
;3.1.5 Static Function Calls
; A.3 Reserved Function Names
(_ 
  [ 
  (function_call
   ncname: (identifier) @function.call(#not-any-of? @function.call  "array" "attribute" "comment" "document-node" "element" "empty-sequence" "function" "if" "item" "map" "namespace-node" "node" "processing-instruction" "schema-attribute" "schema-element" "switch" "text" "typeswitch"))
   (function_call
     prefixed: (identifier) @namespace 
     ":" @punctuation.delimiter.qname
     local: (identifier) @function.call.local
     )
   ]
  )
(annotation  
  "%" @punctuation.delimiter.anno
  ["(" ")"] @punctuation.bracket.anno
  )


; 3.2.2 Dynamic Function Calls
; A dynamic function call consists of a base expression that returns 
; the function and a parenthesized list of zero or more arguments 
; (argument expressions or ArgumentPlaceholders).] 
; 3.1.6 Named Function References 
(named_function_ref
 ncname: (identifier) @function.name (#not-any-of? @function.name  "array" "attribute" "comment" "document-node" "element" "empty-sequence" "function" "if" "item" "map" "namespace-node" "node" "processing-instruction" "schema-attribute" "schema-element" "switch" "text" "typeswitch")
"#" @punctuation.delimiter.func_ref
(integer_literal)
)
(named_function_ref
  prefixed: (identifier) @namespace 
  ":" @punctuation.delimiter.qname
  local: (identifier) @function.local_name
  "#" @punctuation.delimiter.func_ref
  (integer_literal)
  )
; 3.1.7 Inline Function Expressions 
(inline_function_expr
  (annotation)?
  "function"  @function.inline
  "(" @punctuation.bracket.params
  ")" @punctuation.bracket.params
  )
; 3.1.8 Enclosed Expressions 
(enclosed_expr  [ "{" "}" ] @punctuation.bracket.enclosed_expr)
;;
; 3.2 Postfix Expressions
(arg_list [ "(" ")" ] @punctuation.bracket.args )
(predicate [ "[" "]" ] @punctuation.bracket.predicate)
; 3.11.3.2 Postfix Lookup 
(postfix_lookup
   "?" @keyword.lookup.postfix
    key: (_) @constant.key_specifier
   )
;;
; 3.3 Path Expressions
[ "/" "//" ] @operator.path
axis: ".." @constant.builtin.path
axis: (_ 
        [
          "child" 
          "descendant" 
          "attribute" 
          "self" 
          "descendant-or-self" 
          "following-sibling" 
          "following"
          "parent" 
          "ancestor" 
          "preceding-sibling" 
          "preceding" 
          "ancestor-or-self"
          ] @constant.builtin.path
        "::" @punctuation.delimiter.path
        )

; TODO wildcard
(abbrev_forward_step .
  [
  ((identifier) @namespace . ":" @punctuation.delimiter . (identifier) @variable.local)
  ncname: (identifier) @variable
  "@" @constant.builtin.path
  ]
  )
(abbrev_forward_step "@" @constant.builtin.path)
; 3.4 Sequence Expressions 
; 3.4.1 Constructing Sequences 
;@see parenthesized_expr
(range_expr [ "to" ] @operator.range)
;3.4.2 Combining Node Sequences
(union_expr [ "union" "|" ] @operator.union ); 
(intersect_except_expr [ "intersect" "except"] @operator.intersect_except)
;;
;3.5 Arithmetic Expressions 
(additive_expr [ "-" "+"] @operator.additive)
(multiplicative_expr [ "*" "div" "idiv" "mod"] @operator.multiplicative )
(unary_expr [ "-" "+"] @operator)
;3.6 String Concatenation Expressions
(string_concat_expr ["||"] @operator.concat )
;3.7 Comparison Expressions 
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is"  "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator.comparison)
; 3.8 Logical Expressions 
(and_expr [ "and" ] @operator.and)
(or_expr [ "or" ] @operator.or)
; 3.9 Node Constructors 
;3.9.1 Direct Element Constructors 
;
; tag name
; tag.attribute
; tag.delimiter
(start_tag .
    "<"  @tag.delimiter
    [
     ((identifier) @namespace ":" @punctuation.delimiter (identifier) @tag.local)
     ncname: (identifier) @tag
     ]
    ">" @tag.delimiter 
    )
(end_tag .
    "</" @tag.delimiter
    [
    ((identifier) @namespace ":" @punctuation.delimiter (identifier) @tag.local)
    ncname: (identifier) @tag
    ]
    ">" @tag.delimiter)
(empty_tag .
  "<" @tag.delimiter

    [
    ((identifier) @namespace ":" @punctuation.delimiter (identifier) @tag.local)
    ncname: (identifier) @tag
    ]
    "/>" @tag.delimiter
    )

(direct_attribute .
    [
    ((identifier) @namespace ":" @punctuation.delimiter (identifier) @tag.attribute.local)
    ncname: (identifier) @tag.attribute
    ]
  "=" @operator.assignment.attr
  )
(attribute_value ["'" "\"" ] @punctuation.bracket.attr)
; 3.9.3 Computed Constructors
computed_constructor: (_
  [
    "element"
    "attribute" 
    "document"
    "text"
    "processing-instruction"
    "comment"
    "namespace" 
    ] @constructor
  ) 
; 3.10 String Constructors 
(string_constructor . "``[" "]``" ) @constructor.string
(interpolation . "`{" "}`" ) @constructor.interpolation
; 3.11 Maps and Arrays 
(map_constructor "map" "{" "}" ) @function.constructor.map
(map_entry ":" @punctuation.delimiter.map )
(square_array_constructor "[" "]" ) @function.constructor.array
(curly_array_constructor "array" (enclosed_expr)) @function.constructor.array
; 3.11.3 The Lookup Operator ("?") for Maps and Arrays 
; Unary lookup is used in predicates (e.g. $map[?name='Mike'] or with the simple map operator
;3.11.3.1 Unary Lookup 
 (unary_lookup 
   "?"  @operator.lookup.unary
    key: (_) @constant.key_specifier
   )
;;
; 3.12 FLWOR Expressions
(for_clause "for" @keyword.flwor)
(for_binding ["allowing" "empty" "at" "in" ] @keyword.flwor.binding)
(let_clause "let" @keyword.flwor )
(let_binding ":=" @operator.flwor.binding)
[
(count_clause "count")
(where_clause "where")
(order_by_clause 
  [
   "stable" 
   "order" 
   "by"
   "ascending" 
   "collation"
   "descending"
   "empty"
   "greatest"
   "least"
   "collation"
   ]@keyword.flwor.intermediate
  )
(group_by_clause "group" "by")
] @keyword.flwor.intermediate
(grouping_spec
  [
   ":=" @operator.assignment.flwor
   "collation" @keyword.flwor.intermediate
   ]
  )
(return_clause "return" @keyword.flwor.return)
; 3.13 Ordered and Unordered Expressions
[
(unordered_expr "unordered")
(ordered_expr "ordered")
] @keyword.block.order
; 3.14 Conditional Expressions
(if_expr
  "if"
  "then"
  "else"
  ) @keyword.block.conditional
;3.15 Switch Expression
(switch_expr
  "switch"
  "default"
  "return"
  ) @keyword.block.switch
(switch_clause
  "case" "return" 
  ) @keyword.clause.switch_case
;3.16 Quantified Expressions 
(quantified_expr
 ["some" "every"]
 "in"
) @keyword.block.quantified
;3.17 Try/Catch Expressions 
(try_catch_expr
  (try_clause "try")
  (catch_clause "catch")
) @keyword.block.try_catch
;3.18 Expressions on SequenceTypes
;3.18.1 Instance Of 
(instance_of_expr
  lhs: (_)
  "instance" @keyword.instance_of
  "of" @keyword.instance_of
  rhs: (_)
  );
;3.18.2 Typeswitch
(typeswitch_expr "typeswitch"  "default" "return" ) @keyword.block.typeswitch
(typeswitch_case_clause "case" "return" ) @keyword.case.typeswitch
;3.18.3 Cast
(cast_expr  "cast"  "as" ) @keyword.block.cast
;3.18.4 Castable 
(castable_expr  "castable"  "as") @keyword.block.castable
;3.18.6 Treat
(treat_expr  "treat"  "as"  ) @keyword.block.treat
;3.19 Simple map operator (!) 
(bang_expr [ "!" ] @operator.bang )
; 3.20 Arrow operator (=>) 
(arrow_expr [ "=>" ]  @operator.arrow )
(arrow_function
  [ 
    ((identifier) @namespace ":" @punctuation.delimiter (identifier) @function.local)
    ncname: (identifier) @function
    ]
  )
; 3.21 Validate Expressions TODO?
; 3.22 Extension Expressions TODO?
;;4 Modules and Prologs 
;4.1 Version Declaration 
(version_declaration .
 "xquery"  ["version" "encoding"]  ) @keyword.declaration.version
; namespace_define pattern
; 4.2 Module Declaration 
(module_declaration . "module"  @keyword.declaration.module)
; 4.3 Boundary-space Declaration
(boundary_space_declaration .
  "declare" "boundary-space" [ "preserve" "strip"]
  ) @keyword.declaration.boundary_space
; 4.4 Default Collation Declaratiodefault_collation_declarationn
(default_collation_declaration .
  "declare" "default" "collation"
  ) @keyword.declaration.default_collation
; 4.5 Base URI Declaration
(base_uri_declaration .
  "declare" "base-uri"
  ) @keyword.declaration.base_uri
; 4.6 Construction Declaration
(construction_declaration .
"declare" "construction" ["strip" "preserve" ]
) @keyword.declaration.construction
; 4.7 Ordering Mode Declaration 
(ordering_mode_declaration .
  "declare" "ordering" ["ordered"  "unordered"]	
  ) @keyword.declaration.ordering_mode
; 4.8 Empty Order Declaration
(empty_order_declaration .
  "declare" "default" "order" "empty" ["greatest"  "least" ]	                       
) @keyword.declaration.empty_order
; 4.9 Copy-Namespaces Declaration
(copy_namespaces_declaration .
  "declare" "copy-namespaces" ["preserve"  "no-preserve"] ["inherit"  "no-inherit"]
  ) @keyword.declaration.copy_namespaces
; 4.10 Decimal Format Declaration 
(decimal_format_declaration .
  "declare" "decimal-format"
  ) @keyword.declaration.decimal_format
(df_property_define
  _ @define
  "=" @operator.define
  )
; 4.11 Schema Import 
(schema_import .
  "import" "schema" 
  ) @keyword.declaration
(schema_prefix "default" "element" "namespace" ) @keyword.declaration
; 4.12 Module Import 
(module_import .
  "import" "module"  
  ) @keyword.declaration
; 4.13 Namespace Declaration
(namespace_declaration . "declare" @keyword.declaration)
;4.14 Default Namespace Declaration
(default_namespace_declaration . 
  "declare"
  "default" 
  [ "element"  "function" ] 
  "namespace"
  ) @keyword.declaration
; 4.15 Annotations
(function_declaration .
  "declare"  @keyword.declaration
  (annotation)?
  "function" @keyword.declaration
  prefixed: (identifier) @namespace 
  ":" @punctuation.delimiter.qname
  local: (identifier) @function.local_name
 )
(variable_declaration .
  "declare"  @keyword.declaration
  (annotation)?
  "variable" @keyword.declaration
 )
;
(_ . 
  "namespace"  @keyword 
  (identifier) @define.namespace
   "=" @operator.assignment
)
(_ ";" @punctuation.declaration_separator .)
;4.2 Module Declaration
"," @punctuation.delimiter
(comment) @comment
(ERROR) @error
