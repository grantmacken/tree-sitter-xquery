(string_literal) @string
[
(integer_literal)
(decimal_literal)
(double_literal)
] @number
(identifier) @variable
(context_item_expr) @method
(function_call
  (EQName (identifier) @function))

; binary exressions
(range_expr [ "to" ] @keyword.operator)
(additive_expr [ "-" "+"] @operator)
(multiplicative_expr [ "*" ] @operator)
(multiplicative_expr [ "div" "idiv" "mod" ] @keyword.operator)
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is" ] @keyword.operator)
(comparison_expr [ "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator)

(map_constructor ["map"] @keyword.function)

; sequences types
 [ "as" ] @keyword.operator

[
 "let"
] @keyword

"function" @keyword.function
"return" @keyword.return

;"." @punctuation.delimiter
"," @punctuation.delimiter
":" @punctuation.delimiter
";" @punctuation.delimiter

"(" @punctuation.bracket
")" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket

(comment) @comment

(ERROR) @error
