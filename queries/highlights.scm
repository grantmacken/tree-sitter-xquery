; lhs rhs binary statements

(range_expr [ "to" ] @keyword.operator)
(additive_expr [ "-" "+"] @operator)
(multiplicative_expr [ "*" ] @operator)
(multiplicative_expr [ "div" "idiv" "mod" ] @keyword.operator)
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is" ] @keyword.operator)
(comparison_expr [ "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator)
(unary_expr [ "-" "+"] @operator)
(and_expr [ "and" ] @keyword.operator)
(or_expr [ "or" ] @keyword.operator)
; ; other lhs rhs expr operators that are words  
(instance_of_expr ["instance" "of"] @keyword.operator ) 
(cast_expr [ "cast"] @keyword.operator ) 
(castable_expr [ "castable"] @keyword.operator ) 
(treat_expr [ "treat"] @keyword.operator ) 
(intersect_except_expr [ "intersect" "except"] @keyword.operator )
(union_expr [ "union" ] @keyword.operator )
(string_concat_expr ["||"] @operator )
(bang_expr [ "!" ] @operator )
(arrow_expr [ "=>" ]  @operator)


;(context_item_expr [ "." ] @operator)
;(postfix_lookup "?" @operator ) 
;(unary_lookup "?" @operator )
;
;

[(var_ref)] @variable
(arrow_function 
  [
  (identifier) @function
  ])
;
  ["{" "}" "(" ")"] @punctuation.bracket
; literals
[(string_literal)] @string
[(integer_literal) (decimal_literal) (double_literal) ] @number
(ERROR) @error
