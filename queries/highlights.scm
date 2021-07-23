
; declarations TODO rm dups
[ 
  "xquery" "encoding" "version" 
  "declare" "module" "namespace" "option" "import" "schema" 
  "boundary-space"  "preserve"  "strip" ; boundary_space_declaration
  "default"  "collation" ; default_collation_declaration TO also in _query_body
  "base-uri" ; base_uri_declaration
  "construction"  "preserve"  "strip"   ; construction_declaration
  "ordering"  "ordered"  "unordered"    ; ordering_mode_declaration TODO also order_expr
  "order"  "empty"  "greatest"  "least" ;empty_order_declaration TODO also in FLWOR
  "copy-namespaces" "preserve"  "no-preserve" "inherit"  "no-inherit" ; copy_namespaces_declaration
  "decimal-format" "decimal-separator" "grouping-separator" "infinity" "minus-sign" "NaN" ; decimal_format_declaration
  "percent" "per-mille"  "zero-digit" "digit" "pattern-separator" "exponent-separator"    ; decimal_format_declaration
  "variable" "context" "item" "external"
  ] @keyword


; declaration keyword that also appears elsewhere
(default_namespace_declaration ["element" "function" ] @keyword )
(schema_import  ["element" ] @keyword )
(function_declaration ["function" ] @keyword )

 ; declaration and let assignment operators
 [":=" "="] @operator

; primary
[(string_literal) (char_data) (char_ref) (char_group) ] @string

[
(integer_literal)
(decimal_literal)
(double_literal)
(lookup_digit)
] @number

[
 (parenthesized_expr ["(" ")"] )
 (predicate ["[" "]"] ) 
 ] @constructor

(enclosed_expr ["{" "}" ] @punctuation.bracket )
(argument_list ["(" ")"]  @punctuation.bracket )
(param_list ["(" ")"]  @punctuation.bracket )
 [ "%" ";" ":" ","] @punctuation.delimiter

;(identifier) @variable
;(context_item_expr) @method
; (_ 
;   [
;    ns_builtin: (identifier)
;    unprefixed: (identifier)
;    prefix: (identifier)
;    local_part: (identifier)
; ] @property)
 
  (EQName 
    [
    ns_builtin: (identifier) 
    prefix: (identifier)
    ] @namespace)

  (EQName 
    [
     local_part: (identifier)
    unprefixed: (identifier)
    ] @constant)

["$"] @constant

(function_call
  (EQName 
    [
    local_part: (identifier)
    unprefixed: (identifier)
    ] @function))

(arrow_function
  (EQName 
    [
    local_part: (identifier)
    unprefixed: (identifier)
    ] @function))


; path_expr
 (path_expr [ "/" "//" "::" ] @operator)
 (abbrev_attr) @operator
 ;(path_expr) @function
 (path_expr ["child" "descendant" "attribute" "self" "descendant-or-self" "following-sibling" "following"] @keyword.operator)
 (path_expr ["parent"  "ancestor"  "preceding-sibling"  "preceding"  "ancestor-or-self" ] @keyword.operator )
; kind tests - after path
 [ 
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

; binary exressions
(range_expr [ "to" ] @keyword.operator)
(additive_expr [ "-" "+"] @operator)
(multiplicative_expr [ "*" ] @operator)
(multiplicative_expr [ "div" "idiv" "mod" ] @keyword.operator)
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is" ] @keyword.operator)
(comparison_expr [ "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator)
(unary_expr [ "-" "+"] @operator)
(and_expr [ "and" ] @keyword.operator)
(or_expr [ "or" ] @keyword.operator)
; 3.12 FLWOR Expressions
 ["let" "for"  "as" "return" "count" "as" "allowing" "empty" ] @keyword
 ["at" "in" "where" ] @conditional
; ;ordering
 ["stable" "order" "by" "ascending"  "descending" "empty" "greatest" "least" "collation" ] @keyword
; ; grouping 
 ["group" "by" ] @keyword
;3.13 Ordered and Unordered Expressions
(unordered_expr  ["unordered" ] @conditional)
(ordered_expr  ["ordered" ] @conditional)
;3.14 Conditional Expressions
[ "if" "then" "else" ] @conditional
; 3.15 Switch Expression
(switch_expr ["switch" ] @conditional)
(switch_clause ["case" "return"] @conditional)
(switch_default ["default" "return"] @conditional)
; 3.16 Quantified Expressions
(quantified_expr ["some" "every" "in" "satisfies" ] @conditional)
; 3.17 Try/Catch Expressions 
[ "try" "catch" ] @conditional
; 3.18 Expressions on SequenceTypes
[
(instance_of_expr ["instance" "of"]) 
(cast_expr [ "cast"]) 
(castable_expr [ "castable"]) 
(treat_expr [ "treat"]) 
(intersect_except_expr [ "intersect" "except"] )
(union_expr [ "union" ] )
] @keyword.operator

[ "typeswitch" "case" "default" ] @conditional

(occurrence_indicator) @repeat

[ (start_tag) (end_tag) (empty_tag) ] @tag

[
(string_concat_expr ["||"] )
(bang_expr [ "!" ] )

(arrow_expr [ "=>" ] )
(context_item_expr [ "." ] )
] @operator

;(abbrev_attr ["@"] @operator)

[ (unary_lookup) (postfix_lookup) ] @symbol
[ (lookup_wildcard) (NCName) ] @constant

[
 (square_array_constructor ["[" "]"] )
 (curly_array_constructor ["array" "{" "}"] )
 (map_constructor ["map" "{" "}"] )
 (string_constructor ["``[" "]``"] )
 (interpolation ["`{" "}`"] )
 (comp_elem_constructor ["element"] )
 (comp_attr_constructor ["attribute"] )
 (comp_doc_constructor ["document"] )
 (comp_text_constructor ["text"] )
 (comp_comment_constructor ["comment"] )
 (comp_pi_constructor ["processing-instruction"] )
 (comp_namespace_constructor ["namespace"] )
 ] @constructor 

"return" @keyword.return



(comment) @comment
(ERROR) @error
