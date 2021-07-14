(
"12.5",
12,
12.5,
125E2,
"He said, ""I don't like it.""",
"Ben &amp; Jerry&apos;s",
"&#8364;99.50",
'3.1.2 Variable References',
$var,
'3.1.3 Parenthesized Expressions',
(), ('hello'),
'3.1.4 Context Item Expression',
., (:note: static ok but needs a context item so a xquery engine would raise a dynamic error :)
'evaluate to a node',
fn:doc("bib.xml")/books/book[fn:count(./author)>1],
'evaluate to a atomic value or expression',
'TODO (1 to 100)[. mod 5 eq 0])',
'END'
)
