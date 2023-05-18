; non delimiting words
;   "NaN"
;   "allowing"
;   "as"
;   "ascending"
;   "at"
;   "attribute"
;   "base-uri"
;   "by"
;   "castable"
;   "child"
;   "collation"
;   "comment"
;   "context"
;   "copy-namespaces"
;   "count"
;   "decimal-format"
;   "decimal-separator"
;   "descendant"
;   "descendant-or-self"
;   "descending"
;   "digit"
;   "div"
;   "document"
;   "document-node"
;   "element"
;   "empty"
;   "empty-sequence"
;   "eq"
;   "except"
;   "exponent-separator"
;   "ge"
;   "greatest"
;   "group"
;   "grouping-separator"
;   "gt"
;   "idiv"
;   "import"
;   "in"
;   "infinity"
;   "inherit"
;   "intersect"
;   "is"
;   "le"
;   "least"
;   "let"
;   "lt"
;   "minus-sign"
;   "mod"
;   "namespace-node"
;   "ne"
;   "no-inherit"
;   "no-preserve"
;   "of"
;   "option"
;   "order"
;   "parent"
;   "pattern-separator"
;   "per-mille"
;   "percent"
;   "preceding"
;   "preceding-sibling"
;   "processing-instruction"
;   "schema"
;   "schema-attribute"
;   "schema-element"
;   "self"
;   "stable"
;   "text"
;   "to"
;   "treat"
;   "union"
;   "variable"
;   "where"
;
;

(version_declaration 
  ["xquery" "version" "encoding"] @keyword.declaration.version
  )
(version_declaration ";" @punctuation.delimiter.separator)


(module_declaration
  "module"  @keyword.declaration.module
  "namespace" @keyword.declaration.module
  (identifier) @namespace.define.module
   "=" @operator.assignment.module
 )

(prolog
  (_
    [
     "NaN"
     "base-uri"
     "boundary-space"
     "collation"
     "construction"
     "context"  
     "copy-namespaces"
     "decimal-format"
     "decimal-separator"
     "declare"
     "default"
     "digit"
     "element"
     "empty" 
     "exponent-separator"
     "external"
     "function"
     "greatest"  
     "grouping-separator"
     "import"
     "infinity"
     "inherit"
     "item"
     "least"
     "minus-sign"
     "module"
     "namespace"
     "no-inherit"
     "no-preserve"
     "order" 
     "ordered"  
     "ordering"  
     "pattern-separator"
     "per-mille"
     "percent"
     "preserve"
     "preserve"
     "schema"
     "strip"
     "unordered" 
     "variable"
     "zero-digit"
     ] @keyword.declaration.prolog
    ))

(prolog
  (_
   "namespace"
    name: (identifier) @namespace.define.prolog 
   ))

(prolog ";" @punctuation.delimiter.prolog )

(prolog
  (_ 
    ["=" ":="] @operator.assignment.prolog 
    ))

 ncname: (identifier) @label.ncname
 prefixed: (identifier) @namespace
 local: (identifier) @label.local
 (wildcard) @label.wildcard


; lhs rhs binary statements
;3.4.1 Constructing Sequences 
(range_expr [ "to" ] @operator.range)
;3.4.2 Combining Node Sequences
(union_expr [ "union" "|" ] @operator.union ) ; TODO '|' elsewhere
(intersect_except_expr [ "intersect" "except"] @keyword.operator )
;3.5 Arithmetic Expressions 
(additive_expr [ "-" "+"] @operator.additive)
(multiplicative_expr [ "*" "div" "idiv" "mod"] @operator.multiplicative )
(unary_expr [ "-" "+"] @operator)
;3.6 String Concatenation Expressions
(string_concat_expr ["||"] @operator.concat )
;3.7 Comparison Expressions 
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is"  "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator.comparison)
; 3.8 Logical Expressions 
(and_expr [ "and" ] @operator.and)
(or_expr [ "or" ] @operator.or)

; 3.1.6 Named Function References 
; 3.1.7 Inline Function Expressions 
; (inline_function_expr "function" ) @keyword.block.function


; expr blocks FLWOR, some, every, switch, typeswitch, try, if
; statement like expressions - prec 2 
; 3.12 FLWOR Expressions
(for_clause "for" @keyword.flwor)
(for_binding ["allowing" "empty" "at" "in" ] @keyword.flwor.binding)
(let_clause "let" @keyword.flwor )
(let_binding ":=" @operator.flwor.binding)
[
(count_clause "count")
(where_clause "where")
(order_by_clause 
  [
   "stable" 
   "order" 
   "by"
   "ascending" 
   "collation"
   "descending"
   "empty"
   "greatest"
   "least"
   "collation"
   ]@keyword.flwor.intermediate
  )
(group_by_clause "group" "by")
] @keyword.flwor.intermediate

(grouping_spec
  [
   ":=" @operator.assignment.flwor
   "collation" @keyword.flwor.intermediate
   ]
  )
(return_clause "return" @keyword.flwor.return)
; 3.13 Ordered and Unordered Expressions
[
(unordered_expr "unordered")
(ordered_expr "ordered")
] @keyword.block.order
; 3.14 Conditional Expressions
(if_expr
  "if"
  "then"
  "else"
  ) @keyword.block.conditional
;3.15 Switch Expression
(switch_expr
  "switch"
  "default"
  "return"
  ) @keyword.block.switch

(switch_clause
  "case" "return" 
  ) @keyword.clause.switch_case
;3.16 Quantified Expressions 
(quantified_expr
 ["some" "every"]
 "in"
) @keyword.block.quantified
;3.17 Try/Catch Expressions 
(try_catch_expr
  (try_clause "try")
  (catch_clause "catch")
) @keyword.block.try_catch
;3.18 Expressions on SequenceTypes
;3.18.1 Instance Of 
(instance_of_expr
  "instance" "of"
  ) @keyword.block.instance_of;
;3.18.2 Typeswitch
(typeswitch_expr "typeswitch"  "default" "return" ) @keyword.block.typeswitch
(typeswitch_case_clause "case" "return" ) @keyword.case.typeswitch
;3.18.3 Cast
(cast_expr  "cast"  "as" ) @keyword.block.cast
;3.18.4 Castable 
(castable_expr  "castable"  "as") @keyword.block.castable
;3.18.6 Treat
(treat_expr  "treat"  "as"  ) @keyword.block.treat
;3.19 Simple map operator (!) 
(bang_expr [ "!" ] @operator.bang )
; 3.20 Arrow operator (=>) 
(arrow_expr [ "=>" ]  @operator.arrow )
(arrow_function
  [ 
    local: (identifier) @function
    ncname: (identifier) @function
    ])

;delimiting terminal symbols
 ;S, "!", "!=", StringLiteral, "#", "#)", "$", "(", "(#", ")", "*", "*:", "+", (comma), "-", "-->", (dot), "..", "/", "//", "/>", (colon), ":*", "::", ":=", (semi-colon), "<", "<!--", "<![CDATA[", "</", "<<", "<=", "<?", "=", "=>", ">", ">=", ">>", "?", "?>", "@", BracedURILiteral, , "]]>", "]``", "``[", "`{", "{", "|", "||", "}", "}`" ] ;

[ "," ] @punctuation.delimiter

(function_call
  [ 
    local: (identifier) @function
    ncname: (identifier) @function
    ])
; 3.1.6 Named Function References 
;
;
; constructors
; node, array, map string   
; node construtors
;3.9.1 Direct Element Constructors 
(start_tag "<" ">" ) @tag.start
(end_tag "</" ">") @tag.end
(empty_tag "<" "/>" )@tag.empty
(direct_attribute ["="] @operator.assignment.attr)
(attribute_value ["'" "\"" ] @punctuation.bracket.attr)
; 3.9.3 Computed Constructors
computed_constructor: (_
    [
     "element"
      "attribute" 
      "document"
      "text"
      "processing-instruction"
      "comment"
      "namespace" 
     ] @tag.constructor
    ) 
; 3.10 String Constructors 
(string_constructor "``[" "]``" ) @function.constructor.string
(interpolation "`{" "}`" ) @function.interpolation.bracket
; 3.11 Maps and Arrays 
(map_constructor "map" "{" "}" ) @function.constructor.map
(square_array_constructor "[" "]" ) @function.constructor.array
(curly_array_constructor "array" (enclosed_expr)) @function.constructor.array


; 3.11.3 The Lookup Operator ("?") for Maps and Arrays 
; Unary lookup is used in predicates (e.g. $map[?name='Mike'] or with the simple map operator
(predicate
 [ "[" "]" ] @punctuation.bracket.predicate
)
;3.11.3.1 Unary Lookup 
 (unary_lookup 
   "?"  @operator.lookup.unary
    key: (_) @constant.key_specifier
   )
;3.11.3.2 Postfix Lookup 
(postfix_lookup
   "?" @keyword.lookup.postfix
    key: (_) @constant.key_specifier
   ) 
; xpath
[ "/" "//" ] @operator.path
axis_movement: (_) @keyword.path
["::"] @punctuation.delimiter.path

(context_item_expr) @operator.context

; vars
(variable
  [
  "$" @variable
  ncname: (identifier) @variable.def
  prefixed: (identifier) @namespace
  local: (identifier) @variable.def
  ]
  ) 

(var_ref 
  [
  "$" @variable.reference
  ncname: (identifier) @variable.ref
  prefixed: (identifier) @namespace
  local: (identifier) @variable.ref
  ]
  )

[ ":" ] @punctuation.delimiter 

(annotation  
  "%" @punctuation.delimiter.anno
  ["(" ")"] @punctuation.bracket.anno
  )
; sequence types
 name_test: (_) @type.name_test
 kind_test: (_) @type.kind_test
 (any_item) @type.any_test
 func_test: (_) @type.func_test
(occurrence_indicator) @type.occurrence
; pairs @punctuation.bracket
(enclosed_expr  [ "{" "}" ] @punctuation.bracket.enclosed_expr)
(parenthesized_expr [ "(" ")" ] @punctuation.bracket.paren_expr)
(arg_list [ "(" ")" ] @punctuation.bracket.args )

; strings
(string_literal [ "'" "\""] @punctuation.bracket.string ) 
(string_constructor_chars) @string
(char_data) @string
[
 (escape_quote)
 (escape_apos)
 (escape_enclosed)
 (char_ref)
 (predefined_entity_ref)
 ] @string.special
; numbers
[(integer_literal) (decimal_literal) (double_literal) ] @number
(comment) @comment
(ERROR) @error
