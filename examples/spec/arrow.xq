(
$string => upper-case() => normalize-unicode() => tokenize("\s+"),
'abc'=> substring(1,2),
let $string := 'aa bb cc' 
return
 $string=>replace('a','b')=>normalize-space()=>tokenize("\s")
)


