(
'3.2 Postfix Expressions',
'3.2.1 Filter Expressions',
$products[price gt 100],
(1 to 100)[. mod 5 eq 0],
(21 to 29)[5],
$orders[fn:position() = (5 to 9)],
$book/(chapter | appendix)[fn:last()],
'3.2.2 Dynamic Function Calls',
$f(2, 3),
$f[2]("Hi there"),
$f()[2]
)
