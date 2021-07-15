

; primary
(string_literal) @string
[
(integer_literal)
(decimal_literal)
(double_literal)
] @number


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

(var_ref ["$"]  @constant)




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
; 3.16 Quantified Expressions
(quantified_expr ["some" "every" "in" "satisfies" ] @conditional)
; 3.17 Try/Catch Expressions 
[ "try" "catch" ] @conditional
; 3.18 Expressions on SequenceTypes
(instance_of_expr ["instance" "of"] @keyword.operator) 
(cast_expr [ "cast"] @keyword.operator) 
(castable_expr [ "castable"] @keyword.operator) 
(treat_expr [ "treat"] @keyword.operator) 

[ "typeswitch" "case" "default" ] @conditional

(occurrence_indicator) @repeat

[ (start_tag) (end_tag) (empty_tag) ] @tag

(bang_expr [ "!" ] @operator)
(arrow_expr [ "=>" ] @operator)
(context_item_expr [ "." ] @operator)

;(abbrev_attr ["@"] @operator)

(map_constructor ["map"] @keyword.function)
(let_clause ["let"] @keyword.operator)
(for_clause ["for" "in"] @keyword.operator)
(let_binding [":="] @operator)

; statements
[ "if" "then" "else" ] @conditional

; sequences types
 [ "as" ] @keyword.operator


"function" @keyword.function
"return" @keyword.return


"$" @constant 
;"." @punctuation.delimiter
"," @punctuation.delimiter
":" @punctuation.delimiter
";" @punctuation.delimiter
"|" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

(comment) @comment
(ERROR) @error
