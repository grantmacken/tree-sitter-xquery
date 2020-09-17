; MISC form nvim contributing
;comment
;error for error (ERROR` nodes.
;punctuation.delimiter for `;` `.` `,`
;punctuation.bracket for `()` or `{}`
[ "(" ")" "{" "}" "[" "]"  ] @punctuation.bracket
(direct_element
  ["<" ">" "</" "/>" ] @punctuation.bracket)
 



;punctuation.special for symbols with special meaning like `{}` in string interpolation.

; CONSTANTS
; names of the constructed nodes are constants
;constant
(direct_element
  (QName) @constant)
;string
[
(string_literal) 
(char_group)
] @string
;string.regex
;string.escape
;string.special
;character
;number
[
(lookup_digit)
(integer_literal)
]
@number
;boolean
;float
 [
 (decimal_literal)
 (double_literal)
 ] @float

;FUNCTIONS
;function
(function_call
  name: (QName) @function)
(arrow_function_call
   (QName) @function)
;function.builtin
;function.macro
;parameter
;method
;field
;property
;constructor
[ "document" 
  "element" 
  "attribute"
  "text"
  "comment"
  "map"
  "array"
  ] @constructor

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
[ 
"!" 
"=>"
"?"
] @operator

; Arithmetic Expressions
(comparison_op) @operator.comparison
(multiplicative_op) @operator.multiplicative
(additive_op) @operator.additive

[
(lookup_wildcard)
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
[
(NCName)
(var_ref)
] @variable
;variable.builtin

[
(sequence_type)
(single_type)
] @type
