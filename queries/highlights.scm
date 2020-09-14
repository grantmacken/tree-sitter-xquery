;doc/nvim-treesitter.txt;
; Identifiers
(var_ref) @variable
; Literals 
 (string_literal) @string

 [
 (integer_literal)
 (double_literal)
 ] @float

; conditionals TODO
[ 
 "typeswitch" 
 "if"
 "else"
 "then"
 "switch"
 "case"
] @conditional

; repeats TODO
[
 "for"
] @repeat

; comment
; function
; keyword

[ 
"default"
"return"
] @keyword

; operator
; parameter
; punctuation.bracket

[
"("
")"
] @punctuation.bracket



; punctuation.delimiter
; type

