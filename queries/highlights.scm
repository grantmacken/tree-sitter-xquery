; declared namespace indentifiers
 (module_import name: (identifier) @namespace)
 (schema_import name: (identifier) @namespace)

[
 (module_declaration )
 (namespace_declaration)
 ] @namespace

; declarations TODO rm dups
[
  "NaN"
  "base-uri"
  "boundary-space"
  "collation"
  "construction"
  "copy-namespaces"
  "decimal-format"
  "decimal-separator"
  "declare"
  "default"
  "digit"
  "encoding"
  "exponent-separator"
  "external"
  "grouping-separator"
  "infinity"
  "inherit"
  "minus-sign"
  "module"
  "namespace"
  "no-inherit" 
  "no-preserve"
  "option"
  "ordering" 
  "pattern-separator"
  "per-mille"
  "percent"
  "preserve"
  "schema" 
  "strip"
  "strip"
  "variable"
  "version"  
  "xquery" 
  "zero-digit"
  ] @keyword
; TSinclude:
 [ "import" ] @include

; expressions
;TSConditional
[
"case"
"catch"
"default"
"else"
"every"
"if"
"in"
"satisfies"
"some"
"switch"
"then" 
"try"
] @conditional

[ "catch" ] @exeption

[ 
  "for" 
  "typeswitch" 
  ] @repeat

; disambiguation
(wildcard) @conditional
(sequence_type
  (occurrence_indicator) @attribute
  )



; TODO
  [ "function" ] @keyword.function

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
["function"] @keyword.function

[axis_movement: (_)]  @keyword.operator
  
[":=" "="] @operator
; PATH 
(abbrev_reverse) @operator
(abbrev_foward) @operator
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
; other lhs rhs expr operators that are words  
(instance_of_expr ["instance" "of"] @keyword.operator ) 
(cast_expr [ "cast"] @keyword.operator ) 
(castable_expr [ "castable"] @keyword.operator ) 
(treat_expr [ "treat"] @keyword.operator ) 
(intersect_except_expr [ "intersect" "except"] @keyword.operator )
(union_expr [ "union" ] @keyword.operator )
(string_concat_expr ["||"] @operator )
(bang_expr [ "!" ] @operator )
(arrow_expr [ "=>" ]  @operator)
(context_item_expr [ "." ] @operator)
(postfix_lookup "?" @operator ) 
(unary_lookup "?" @operator )


[ "/" "//" ] @punctuation.delimiter
["{" "}" "(" ")"] @punctuation.bracket
; unless ( ) is used to *constuct* sequences eg ( 1 to 10 )
; TODO! hightlight annotation  TSAnnotaion %private %updating and maybe restxq
 [ "%" ";" ":" "," "|" "(:" ":)"] @punctuation.delimiter
; constructors 
(square_array_constructor ["[" "]"] @constructor )
(curly_array_constructor ["array" ] @constructor )
(map_constructor ["map" ] @constructor )
(string_constructor ["``[" "]``"] @constructor )
(interpolation ["`{" "}`"] @constructor )
(comp_elem_constructor ["element"] @constructor )
(comp_attr_constructor ["attribute"] @constructor )
(comp_doc_constructor ["document"] @yconstructor )
(comp_text_constructor ["text" ] @constructor )
(comp_comment_constructor ["comment" ] @constructor )
(comp_pi_constructor ["processing-instruction" ] @constructor )
(comp_namespace_constructor ["namespace" ] @constructor )
; also say these are constuctors
(parenthesized_expr ["(" ")"] @constructor)
(predicate ["[" "]"] @constructor) 

 ; declarations, direct_attribute and 'let' assignment operators
; literals
[(string_literal) (char_data) (char_ref) (char_group) ] @string
[ (integer_literal) (decimal_literal) (double_literal) (lookup_digit) ] @number

[
 ns_builtin: (identifier)
 prefix: (identifier) 
 ] @namespace

[
 param: (NCName)
 local_part: (identifier)
 unprefixed: (identifier) 
 ] @constant

; when in the tree context of
; sequence_type/item_type
; then identify as a builtin type
(atomic_or_union_type
  [ 
    local_part: (identifier) @type.builtin
    unprefixed: (identifier) @type.builtin
    ])

 (var_ref 
   [ "$" @variable
     local_part: (identifier) @variable
     unprefixed: (identifier) @variable
     ])

 (arrow_function 
   [ 
     local_part: (identifier) @function
     unprefixed: (identifier) @function
     ])

 
 (function_call
   [ 
     local_part: (identifier) @function
     unprefixed: (identifier) @function
     ])

; TSType`
; TSTypeBuiltin`
    

(sequence_type
  (_
    [
     "item"
     ; kind tests - complex
     "attribute"
     "element"
     "processing-instruction"
     "schema-attribute"
     "schema-element"
     ; kind tests - simple
     "comment"
     "namespace-node"
     "node"
     "text"
     ; function tests
     "function"
     "map"
     "array"
     ] @type
    ))
 

; direct XML constructors
[(start_tag) (end_tag) (empty_tag)  ] @tag
(direct_attribute 
  attr_name: (identifier) @tag.attribute
  attr_value: (direct_attribute_value) @string
  )


[ 
 (direct_comment)
 (comment)
 ] @comment
(ERROR) @error
