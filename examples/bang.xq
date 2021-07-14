(
child::div1 / child::para / string() ! concat("id-", .),
$emp ! (@first, @middle, @last),
$docs ! ( //employee),
avg( //employee / salary ! translate(., '$', '') ! number(.)),
fn:string-join((1 to $n)!"*"),
$values!(.*.) => fn:sum(),
string-join(ancestor::*!name(), '/'),
("red", "blue", "green")!string-length(),
("red", "blue", "green")!position(),
("red", "blue", "green")!(position() = last()),
("red", "blue", "green") ! string-length() ! (.+1),
(/works/employee[2], /works/employee[1], /works/employee[2]) ! @name ! string(),
/works ! employee[2] ! hours[2] ! number(),
2 + (/ works ! employee[2] ! hours[2]) ! number() ! (-.),
(1 to 5) ! (1 to .) ! position(),
/ works ! employee[4] ! preceding-sibling::*[1] ! string(@name),
(1 to 5) ! (1 to .),
count(/ ! works)
)


