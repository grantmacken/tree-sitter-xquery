(
$N instance of element(),
$N instance of element(*),
$N instance of element(person),
$N instance of element(person, xx),
$N instance of element(person, xx ?),
$N instance of attribute(),
$N instance of attribute(*),
$N instance of attribute(price),
$N instance of attribute(price, currency),
$N instance of attribute(*, currency),
$N instance of schema-element(color),
$N instance of schema-attribute(color),
'string' instance of item(),
$N instance of node(),
$N instance of processing-instruction(),
$N instance of processing-instruction( foo )
$F instance of function(*),
$F instance of function(int, int) as int,
$F instance of function(xs:anyAtomicType) as item(),
$F instance of function(xs:anyAtomicType) as item()*,
map {} instance of map(*),
$M instance of map(xs:integer, xs:string),
array {} instance of array(*),
[] instance of array(*),
[] instance of array(xs:integer)
)

