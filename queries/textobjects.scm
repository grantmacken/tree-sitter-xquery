


(function_declaration) @function.outer
(inline_function_expr) @function.outer
; (named_function_ref)

(function_call
  (arg_list) @call.inner)
(function_call) @call.outer

(arg_list
 (_) @parameter.inner)

(param_list
 (_) @parameter.inner)
