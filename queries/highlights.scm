; Modules
;--------
; module namespace newBase60  = "http://gmack.nz/#newBase60";
(NCName) @namespace
(EQName
  prefix: (identifier) @namespace
  ns_builtin: (identifier) @namespace
  local_part: (identifier) @variable
  unprefixed: (identifier) @constant
  (uri_qualified_name)  @constant
  (braced_uri_literal)  @constant
  )

"$" @variable.prefix

; Types

[
(sequence_type)
(single_type)
] @type

(default_namespace_declaration
   ["element" "function" ] @type)

; diff wildcard from multiplicative times op
; TODO name_test wildcard
[
(lookup_wildcard)
(param_wildcard)  
(wildcard)
] @operator.wildcard

; include xPath steps
[ "/" "//" ";" "," ] @punctuation.delimiter
;enclosing bracket markers
[ "(" ")" "{" "}" "[" "]"  ] @punctuation.bracket
; XML tags
(end_tag [ "</"  ">" ]  @tag.delimiter)
(start_tag [ "<"  ">"] @tag.delimiter)
(empty_tag [ "<" "/>" ] @tag.delimiter)
(start_tag (identifier) @tag)
(end_tag (identifier) @tag)
(empty_tag (identifier) @tag)
(direct_attribute (identifier) @attribute)
(end_tag [ "</"  ">" ]  @tag.delimiter)
(start_tag [ "<"  ">"] @tag.delimiter)
(empty_tag [ "<" "/>" ] @tag.delimiter)
;
;(direct_attribute
;  name: (identifier) @attribute)

;(direct_attribute
;  value: (QName) @string)

;punctuation.special for symbols with special meaning like `{}` in string interpolation.

; CONSTANTS
; names of the constructed nodes are constants

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
;(function_declaration
; name: (identifier) @function)
;(function_call
;  name: (identifier) @function)
;(arrow_function_call
;   (identifier) @function)
;(annotation 
;  name: (identifier) @function.annotation)
;function.builtin
;function.macro
;parameter
;  (param 
;    name: (identifier) @parameter)

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

;conditional
[ 
"case"
"else" 
"every" 
"if" 
"some" 
"switch" 
"then" 
"typeswitch" 
"where" 
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



;include for including modules

["import" "external"] @include

[ 
"allowing"
"ascending"
"by"
"collation"
"context"
"count"
"declare"
"default" 
"descending"
"descending"
"empty"
"empty"
"function"
"greatest"
"group"
"item"
"least"
"module"
"namespace" 
"option" 
"order"
"return" 
"schema"
"stable"
"variable"
"version"
"where"
"xquery" 
"ordered"
"unordered"
] @keyword

;keyword.operator (for operators that are English words, e.g. `and`, `or`)
[ 
  "as" 
  "at"
  "cast" 
  "castable"
  "in" 
  "instance" 
  "of"  
  "satisfies" 
  "treat" 
  ] @keyword.operator

;keyword.function
;exception 
[ "try" "catch" ] @exception



;comment
(comment) @comment
;; Error
(ERROR) @error
