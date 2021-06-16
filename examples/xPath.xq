(
$node/,
$node/text(),
$node/child::para/child::para/text(),
$node/*,
$node/descendant::toy[./attribute::color = "red"],
fn:doc("bib.xml")/books/book[fn:count(./author)>1]
)
