; Literals

[
  (string_literal)
] @string

[
  (double_literal)
  (integer_literal)
] @numeric

; Function calls

(function_call
  name: (EQName) @function)  

(named_function_ref 
  name: (EQName) @function)


; Operators
[
(additive_op)
(and_op)
(arrow_op)
(bang_op)
(comparison_op)
(context_item_expr)
(multiplicative_op)
(or_op)
(range_op)
(unary_op)
] @operator

(path_op) @path.operator

[
(forward_axis)
] @path.axis

(path_expr 
  name_test: (wildcard) @path.test)
(path_expr 
  name_test: (EQName) @path.test)
(path_expr 
   (predicate) @path.filter)

[
  ","
  ":"
] @punctuation.delimiter

; Identifiers
(var_ref) @variable

; not sure what this highlight should be
(argument_placeholder) @variable

; Types

(type_declaration
  type: (sequence_type) @type)
(occurrence_indicator) @type.indicator 

[
"("
")"
"["
"]"
"{"
"}"
] @punctuation.bracket

; keywords mainly in statments

[
"let"
"as"
"for"
"in"
"allowing"
"empty"
"at"
"where"
"count"
"group"
"by"
"collation"
"order"
"stable"
"ascending"
"descending"
"empty"
"greatest"
"least"
] @keyword



