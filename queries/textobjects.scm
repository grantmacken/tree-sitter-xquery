


(function_declaration) @function.outer
(inline_function_expr) @function.outer
; (named_function_ref)

(function_call
  (arguments) @call.inner)
(function_call) @call.outer

(arguments
 (_) @parameter.inner)

(parameters
 (_) @parameter.inner)
