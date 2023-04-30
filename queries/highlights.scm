
; declared namespace indentifiers
(module_import
  [
   name: (identifier) @namespace
   "import"  @include
   ]
  )
(schema_import
  [
   name: (identifier) @namespace
   "element" @keyword
   "import"  @include
   ]
  )
; highlight top level namespace
[
 (module_declaration )
 (namespace_declaration)
 ] @namespace


(function_declaration "function" @keyword.function)
(inline_function_expr "function" @keyword.function)
(default_namespace_declaration [ "function"  "element"] @keyword)
(context_item_declaration [ "context"  "item"] @keyword)
(variable_declaration "variable" @keyword)

;
;
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

; 3.12 FLWOR Expressions
[ 
  "at" 
  "in" 
  "where"
  ] @conditional
[ 
  "allowing"
  "as"
  "ascending"
  "by"
  "collation" 
  "count"
  "descending"
  "empty"
  "greatest"
  "group"
  "least"
  "let"
  "order"
  "ordered" 
  "stable"
  "unordered"
  ] @keyword
["return"] @keyword.return
;
;
[ 
  (variable)
  (var_ref)
  ] @variable
; (variable 
;   [ 
;     prefix: (identifier) @variable.namespace
;     local: (identifier) @variable
;     unprefixed: (identifier) @variable
;   ])



(function_call
  [
    prefix: (identifier) @function.namespace
    local: (identifier) @function
    unprefixed: (identifier) @function
  ])

(arrow_function 
  [
    prefix: (identifier) @function.namespace
    local: (identifier) @function
    unprefixed: (identifier) @function
  ])
; when in the tree context of
; sequence_type/item_type
; then identify as a builtin type
(atomic_or_union_type
  [ 
    prefix: (identifier) @namespace
    local: (identifier) @type.builtin
    unprefixed: (identifier) @type.builtin
    ])


;
; MISC
; TODO! hightlight annotation  TSAnnotaion %private %updating and maybe restxq
[ "%" ";" ":=" "," "|" ] @punctuation.delimiter
[ "/" "//" ] @punctuation.delimiter ; ? TODO xpath path
["{" "}" "(" ")"] @punctuation.bracket ; unless ( ) is used to *constuct* sequences eg ( 1 to 10 )
(interpolation ["`{" "}`"] @punctuation.special )  ; within string constructors; literals

[(string_literal)] @string
[(integer_literal) (decimal_literal) (double_literal) ] @number
(ERROR) @error
