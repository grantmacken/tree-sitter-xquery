; MISC form nvim contributing
;comment
;error for error (ERROR` nodes.
;punctuation.delimiter for `;` `.` `,`
;punctuation.bracket for `()` or `{}`
[ "(" ")" "{" "}" ] @punctuation.bracket
;punctuation.special for symbols with special meaning like `{}` in string interpolation.

; CONSTANTS
;constant
;constant.builtin
;constant.macro
;string
(string_literal) @string
;string.regex
;string.escape
;string.special
;character
;number
(integer_literal) @number
;boolean
;float
 [
 (decimal_literal)
 (double_literal)
 ] @float

;FUNCTIONS
;function
(function_call
  name: (EQName) @function)
(arrow_function_call
   (EQName) @function)
;function.builtin
;function.macro
;parameter
;method
;field
;property
;constructor

;KEYWORDS
;conditional
[ "some" "every" 
  "if" "else" "then" 
  "typeswitch" "switch" "case"
] @conditional
;repeat
[ "for" ] @repeat

;label for C/Lua-like labels
;operator (for symbolic operators, e.g. `+`, `*`)
[ "!" "=>"] @operator

; Arithmetic Expressions
(comparison_op) @operator.comparison
(multiplicative_op) @operator.multiplicative
(additive_op) @operator.additive

[
(param_wildcard)  
(wildcard)
] @operator.wildcard

;keyword 
[ "default" "return" ] @keyword
;keyword.operator (for operators that are English words, e.g. `and`, `or`)
[ "as" "in" "satisfies" "instance" "of"  "cast" 
  "castable" "treat" ] @keyword.operator

;keyword.function
;exception 
[ "try" "catch" ] @exception

;include keywords for including modules (e.g. import/from in Python)
;Variables
;variable
(var_ref) @variable
;variable.builtin

[
(sequence_type)
(single_type)
] @type
