; non delimiting words
;   "NaN"
;   "allowing"
;   "as"
;   "ascending"
;   "at"
;   "attribute"
;   "base-uri"
;   "by"
;   "cast"
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
;   "for"
;   "function"
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
;   "instance"
;   "intersect"
;   "is"
;   "le"
;   "least"
;   "let"
;   "lt"
;   "minus-sign"
;   "mod"
;   "namespace"
;   "namespace-node"
;   "ne"
;   "no-inherit"
;   "no-preserve"
;   "of"
;   "option"
;   "order"
;   "ordered"
;   "ordering"
;   "parent"
;   "pattern-separator"
;   "per-mille"
;   "percent"
;   "preceding"
;   "preceding-sibling"
;   "processing-instruction"
;   "return"
;   "schema"
;   "schema-attribute"
;   "schema-element"
;   "self"
;   "stable"
;   "text"
;   "to"
;   "treat"
;   "union"
;   "unordered"
;   "variable"
;   "where"
;   "zero-digit"
;
(module_declaration
  [
  "module"  @keyword.declaration.module
  "namespace" @keyword.declaration.module
   "=" @operator.assignment.module
    ";" @delimiter.declaration
  (identifier) @namespace.define
  ]
 )

(prolog
  (_ 
    [
    "=" @operator.assignment.prolog 
    ";" @delimiter.declaration.prolog
    ]
    ))
(prolog
  (_
    [ 
      "declare"
      "function"
      "variable"
      "element"
      "default"
      "namespace"
      "external"
      "base-uri"
      "boundary-space"
      "preserve"
      "construction"
      "strip"
      "context"  
      "item"
      ] @keyword.declaration.prolog
    ))


 ncname: (identifier) @label.ncname
 prefixed: (identifier) @namespace
 local: (identifier) @label.local
 (wildcard) @label.wildcard

; FLWOR, some, every, switch, typeswitch, try, if
; statement like expressions - prec 2 
[ 
  "try"
  "catch"
  "every"
  "some"
  "switch"
  "typeswitch"
  "if"
  ] @keyword.block

["case" "default" "return" "then" "else"  ] @keyword.clause

[ 
  "at" 
  "in"
  "where"
  "where"
  "satisfies"
  ] @keyword.conditional

(version_declaration 
  ["xquery" "version" "encoding"] @keyword.declaration
  )

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

(inline_function_expr "function" @keyword.function)
; lhs rhs binary statements

(range_expr [ "to" ] @operator.range)
(additive_expr [ "-" "+"] @operator.additive)
(multiplicative_expr [ "*" "div" "idiv" "mod"] @operator.multiplicative )
(comparison_expr [ "eq" "ne" "lt" "le" "gt" "ge" "is"  "=" "!=" "<" "<=" ">" ">="  "<<" ">>" ] @operator.comparison)
(unary_expr [ "-" "+"] @operator)
(and_expr [ "and" ] @operator.and)
(or_expr [ "or" ] @operator.or)
; ; other lhs rhs expr operators that are words  
(instance_of_expr ["instance" "of"] @keyword.operator ) 
(cast_expr [ "cast"] @operator.cast ) 
(castable_expr [ "castable"] @operator.castable ) 
(treat_expr [ "treat"] @operator.treat ) 
(intersect_except_expr [ "intersect" "except"] @keyword.operator )
(union_expr [ "union" "|" ] @operator.union ) ; TODO '|' elsewhere
(string_concat_expr ["||"] @operator.concat )
(bang_expr [ "!" ] @operator.bang )
(arrow_expr [ "=>" ]  @operator.arrow)



; 3.12 FLWOR Expressions

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
;

(lookup
  [
    key: (identifier) @constant
  ])

;delimiting terminal symbols
 ;S, "!", "!=", StringLiteral, "#", "#)", "$", "(", "(#", ")", "*", "*:", "+", (comma), "-", "-->", (dot), "..", "/", "//", "/>", (colon), ":*", "::", ":=", (semi-colon), "<", "<!--", "<![CDATA[", "</", "<<", "<=", "<?", "=", "=>", ">", ">=", ">>", "?", "?>", "@", BracedURILiteral, , "]]>", "]``", "``[", "`{", "{", "|", "||", "}", "}`" ] ;

[ ";" ":=" "," ] @punctuation.delimiter

; constructors
; node, array, map string  
; node construtors
[ 
  ">"
  "<"
  "</"
  "/>"
 ] @punctuation.bracket.tag

(start_tag 
  [
  ncname: (identifier) @tag.start
  prefixed: (identifier) @namespace
  local: (identifier) @tag.start
  ]
  )
(end_tag 
  [
  ncname: (identifier) @tag.end
  prefixed: (identifier) @namespace
  local: (identifier) @tag.end
  ]
  )
(empty_tag 
  [
  ncname: (identifier) @tag.empty
  prefixed: (identifier) @namespace
  local: (identifier) @tag.empty
  ]
  )

(direct_attribute ["="] @operator.assignment)
(attribute_value ["'" "\"" ] @punctuation.bracket.attr)

constructor: (_) @function.constructor
(interpolation [ "`{" "}`" ] @function.interpolation.bracket)

(unary_lookup 
  [
   "?" @operator.lookup 
   key: (identifier) @label.key.ncname
   key: (wildcard) @label.key.wildcard
   key: (integer_literal) @label.key.integer
  ]
  )

(predicate
[ "[" "]" ] @punctuation.bracket.filter
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

(function_call
  [ 
    local: (identifier) @function
    ncname: (identifier) @function
    ])

(arrow_function
  [ 
    local: (identifier) @function
    ncname: (identifier) @function
    ])


[ ":" ] @punctuation.delimiter 

;     [          
;     prefixed: (identifier) @namespace
;     local: (identifier) @label.local
;     ncname: (identifier) @label.ncname
;     name: (wildcard) @label.wildcard
;     ]
;  )
;
(annotation  
  [ 
    "%" @punctuation.delimiter.anno
    "(" @punctuation.bracket.anno
    ")" @punctuation.bracket.anno

  ])

; sequence types
 name_test: (_) @type.name_test
 kind_test: (_) @type.kind_test
 (any_item) @type.any_test
 func_test: (_) @type.func_test
(occurrence_indicator) @type.occurrence

; 
; pairs @punctuation.bracket
(enclosed_expr  [ "{" "}" ] @punctuation.bracket.expr)
(parenthesized_expr [ "(" ")" ] @punctuation.bracket.expr )
(arg_list [ "(" ")" ] @punctuation.bracket.args )
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

[(integer_literal) (decimal_literal) (double_literal) ] @number


(comment) @comment

(ERROR) @error
