
; declarations TODO rm dups
[
  "xquery" "encoding" "version"  ; version_declaration
  "declare"  "module" "namespace"; module_declaration
  "boundary-space"  "preserve"  "strip" ; boundary_space_declaration
  "default"  "collation" ; default_collation_declaration TO also in _query_body
  "base-uri" ; base_uri_declaration
  "construction"  "preserve"  "strip"   ; construction_declaration
  "ordering"  "ordered"  "unordered"    ; ordering_mode_declaration TODO also order_expr
  "order"  "empty"  "greatest"  "least" ;empty_order_declaration TODO also in FLWOR
  "copy-namespaces" "preserve"  "no-preserve" "inherit"  "no-inherit" ; copy_namespaces_declaration
  "decimal-format" "decimal-separator" "grouping-separator" "infinity" "minus-sign" "NaN" ; decimal_format_declaration
  "percent" "per-mille"  "zero-digit" "digit" "pattern-separator" "exponent-separator"    ; decimal_format_declaration
   "option" "schema" 
  "variable"  "external"
  ] @keyword

; TSinclude:
 (schema_import  "import" @include) 
 (module_import  "import" @include)

; declared namespace indentifiers

 (module_import name: (identifier) @namespace)
 (schema_import name: (identifier) @namespace)

[
 (module_declaration )
 (namespace_declaration)
 ] @namespace

 ; declarations, direct_attribute and 'let' assignment operators
 [":=" "="] @operator
; literals
[(string_literal) (char_data) (char_ref) (char_group) ] @string
[ (integer_literal) (decimal_literal) (double_literal) (lookup_digit) ] @number
 
; enclose brackets
["{" "}" "(" ")"] @punctuation.bracket
; unless ( ) is used to *constuct* sequences eg ( 1 to 10 )


; TODO! hightlight annotation  TSAnnotaion %private %updating and maybe restxq
 [ "%" ";" ":" "," "|" "(:" ":)"] @punctuation.delimiter

 (var_ref) @constant
  [
  ns_builtin: (identifier) 
  prefix: (identifier)
  ] @namespace

  [
   local_part: (identifier)
  unprefixed_name: (identifier)
  ] @constant

(inline_function_expr "function" @function ) 
(function_call
  (_ 
    [
    local_part: (identifier)
    unprefixed_name: (identifier)
    ] @function))

(arrow_function
  (_ 
    [
    local_part: (identifier)
    unprefixed_name: (identifier)
    ] @function))

; PATH 
  (abbrev_reverse) @operator
  (abbrev_foward) @operator
[ "/" "//" ] @punctuation.delimiter
[axis_movement: (_)]  @keyword.operator

; TSType`
; TSTypeBuiltin`
 [ 
  (any_item)
  (any_function_test)
  (typed_function_test)
  (any_map_test)
  (typed_map_test)
  (any_array_test)
  (typed_array_test)
  (any_kind_test)
  (comment_test)
  (namespace_node_test)
  (text_test)
  (document_test)
  (element_test)
  (attribute_test)
  (schema_element_test)
  (schema_attribute_test)
  (pi_test)
  (name_test)
] @type

; 3.12 FLWOR Expressions
 ["let" "for"  "as" "return" "count" "as" "allowing" "empty" ] @keyword
 ["at" "in" "where" ] @conditional
; ;ordering
 ["stable" "order" "by" "ascending"  "descending" "empty" "greatest" "least" "collation" ] @keyword
; ; grouping 
 ["group" "by" ] @keyword
;3.13 Ordered and Unordered Expressions
(unordered_expr  ["unordered" ] @keyword)
(ordered_expr  ["ordered" ] @keyword)
;TSConditional keywords related to conditionnals.
(if_expr [ "if" "then" "else" ] @conditional)
(switch_expr "switch" @conditional)
(switch_clause "case" @conditional)
(quantified_expr ["some" "every" "in" "satisfies" ] @conditional)
(typeswitch_expr [ "typeswitch" "case" "default" ]  @conditional)
(try_clause "try" @conditional)
(catch_clause "catch" @conditional)

; lhs rhs binary statments
(range_expr [ "to" ] @keyword.operator)
(additive_expr [ "-" "+"] @operator)
(multiplicative_expr [ "*" ] @operator)
(multiplicative_expr [ "div" "idiv" "mod" ] @keyword.operator)
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is" ] @keyword.operator)
(comparison_expr [ "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator)
(unary_expr [ "-" "+"] @operator)
(and_expr [ "and" ] @keyword.operator)
(or_expr [ "or" ] @keyword.operator)
; other lhs rhs expr operators that are words  
(instance_of_expr ["instance" "of"] @keyword.operator ) 
(cast_expr [ "cast"] @keyword.operator ) 
(castable_expr [ "castable"] @keyword.operator ) 
(treat_expr [ "treat"] @keyword.operator ) 
(intersect_except_expr [ "intersect" "except"] @keyword.operator )
(union_expr [ "union" ] @keyword.operator )

["return"] @keyword.return

(occurrence_indicator) @repeat

; misc ops
[
(string_concat_expr ["||"] )
(bang_expr [ "!" ] )
(arrow_expr [ "=>" ] )
(context_item_expr [ "." ] )
] @operator

(postfix_lookup "?" @operator ) 
(unary_lookup "?" @operator )
(wildcard) @conditional

; direct XML constructors
[(start_tag) (end_tag) (empty_tag)  ] @tag
(direct_attribute 
  attr_name: (identifier) @tag.attribute
  attr_value: (direct_attribute_value) @string
  )
; constructors 
 (square_array_constructor ["[" "]"] @constructor )
 (curly_array_constructor ["array" ] @constructor )
 (map_constructor ["map" ] @constructor )
 (string_constructor ["``[" "]``"] @constructor )
 (interpolation ["`{" "}`"] @constructor )
 (comp_elem_constructor ["element"] @constructor )
 (comp_attr_constructor ["attribute"] @constructor )
 (comp_doc_constructor ["document"] @yconstructor )
 (comp_text_constructor ["text" ] @constructor )
 (comp_comment_constructor ["comment" ] @constructor )
 (comp_pi_constructor ["processing-instruction" ] @constructor )
 (comp_namespace_constructor ["namespace" ] @constructor )
; also say these are constuctors
(parenthesized_expr ["(" ")"] @constructor)
(predicate ["[" "]"] @constructor) 

[ 
 (direct_comment)
 (comment)
 ] @comment
(ERROR) @error
