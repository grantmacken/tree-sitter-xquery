(
child::div1 / child::para / string() ! concat("id-", .),
$emp ! (@first, @middle, @last),
$docs ! ( //employee),
avg( //employee / salary ! translate(., '$', '') ! number(.)),
fn:string-join((1 to $n)!"*"),
$values!(.*.) => fn:sum(),
string-join(ancestor::*!name(), '/')
)


