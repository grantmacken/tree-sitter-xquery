'3.20 Arrow operator (=>)', 
U => F(A, B, C),
'is the same as',
F(U, A, B, C),
tokenize((normalize-unicode(upper-case($string))),"\s+"),
'is the same as',
$string => upper-case() => normalize-unicode() => tokenize("\s+")
