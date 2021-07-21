(
'3.7 Comparison Expressions',
'3.7.1 Value Comparisons',
$book1/author eq "Kennedy",
[ "Kennedy" ] eq "Kennedy",
//product[weight gt 100],
<a>5</a> eq <a>5</a>,
my:hatsize(5) eq my:shoesize(5),
fn:QName("http://example.com/ns1", "this:color") eq fn:QName("http://example.com/ns1", "that:color"),
'3.7.2 General Comparisons',
$book1/author = "Kennedy",
[ "Obama", "Nixon", "Kennedy" ] = "Kennedy",
(1, 2) = (2, 3),
(1, 2) != (2, 3),
'3.7.3 Node Comparisons',
/books/book[isbn="1558604820"] is /books/book[call="QA76.9 C3845"],
<a>5</a> is <a>5</a>,
/transactions/purchase[parcel="28-451"] << /transactions/sale[parcel="33-870"]
)
