(
$node/,
$node/text(),
$node/child::para/child::para/text(),
$node/*,
fn:doc("bib.xml")/books/book[fn:count(./author)>1],
$node/descendant::toy[./attribute::color = "red"]
)
