; MISC from nvim contributing

;error for error (ERROR` nodes.
;punctuation.delimiter for `;` `.` `,` 
; xPath
[ "/" "//" ";" ","] @punctuation.delimiter
;punctuation.bracket for `()` or `{}`
[ "(" ")" "{" "}" "[" "]"  ] @punctuation.bracket


; TAGS Used for xml-like tags
(end_tag [ "</"  ">" ]  @tag.delimiter)
(start_tag [ "<"  ">"] @tag.delimiter)
(empty_tag [ "<" "/>" ] @tag.delimiter)
(start_tag
  name: (QName) @tag)
(end_tag
  name: (QName) @tag)
(empty_tag
  name: (QName) @tag)

(direct_attribute
  name: (QName) @attribute)
(direct_attribute
  value: (QName) @string)

;punctuation.special for symbols with special meaning like `{}` in string interpolation.

; CONSTANTS
; names of the constructed nodes are constants
;constant
;(direct_element
;  (QName) @constant)
; not sure where to put annotation QName

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
(function_declaration
 name: (QName) @function)
(function_call
  name: (QName) @function)
(arrow_function_call
   (QName) @function)
(annotation 
  name: (QName) @function.annotation)
;function.builtin
;function.macro
;parameter
  (param 
    name: (QName) @parameter)


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
"="
"%"
":="
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

;include keywords for including modules (e.g. import/from in Python)
"import" @include

[ 
"declare"
"default" 
"context"
"external"
"item"
"function"
"module"
"namespace" 
"return" 
"schema"
"variable"
"version"
"xquery" 
] @keyword

;keyword.operator (for operators that are English words, e.g. `and`, `or`)
[ "as" "in" "satisfies" "instance" "of"  "cast" 
  "castable" "treat" ] @keyword.operator

;keyword.function
;exception 
[ "try" "catch" ] @exception

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

(default_namespace_declaration
   ["element" "function" ] @type)

;comment
(comment) @comment
;; Error
(ERROR) @error
