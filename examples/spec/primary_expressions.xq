('3.1 Primary Expressions',
'3.1.1 Literals',
"12.5",
12,
12.5,
125E2,
"escape quotes: He said, ""I don't like it.""",
"predefined entity: Ben &amp; Jerry&apos;s",
"character reference: &#8364;99.50",
'boolean values, via builtin function calls', fn:true(), fn:false(),
'constructor functions', xs:integer("12"), xs:date("2001-08-25"), xs:dayTimeDuration("PT5H"),
'3.1.2 Variable References',
$var,
'3.1.3 Parenthesized Expressions',
(), ('hello'),
'3.1.4 Context Item Expression',
., (:note: static ok but needs a context item so a xquery engine would raise a dynamic error :)
'evaluate to a node',
fn:doc("bib.xml")/books/book[fn:count(./author)>1],
'evaluate to a atomic value or expression',
'TODO: '
(1 to 100)[. mod 5 eq 0],
'3.1.5 Static Function Calls',
my:three-argument-function(1, 2, 3),
my:two-argument-function((1, 2), 3),
my:one-argument-function((1, 2, 3)),
my:one-argument-function(( )),
my:zero-argument-function( ),
'3.1.5.1 Evaluating Static and Dynamic Function Calls',
'Example: Partial Application of an Anonymous Function ',
let $f := function ($seq, $delim) { 
    fn:fold-left($seq, "", fn:concat(?, $delim, ?)) },
    $paf := $f(?, ".")
return $paf(1 to 5),
'Example: Partial Application of a Map',
let $a := map {"A": 1, "B": 2}(?) return $a("A"),
'Example: Derived Types and Nonlocal Variable Bindings',
let $incr := 1,
    $f := function ($i as xs:decimal) as xs:decimal { $i + $incr }
return $f(5),
'Example: Using the Context Item in an Anonymous Function',
let $vat := function($art) { $art/@vat + $art/@price }
return shop/article/$vat(.),
let $ctx := shop/article,
$vat := function() { for $a in $ctx return $a/@vat + $a/@price }
return $vat(),
'Example: A Built-in Function',
fn:base-uri(),
'3.1.5.3 Function Coercion',
let $f := function($a) { starts-with($a, "E") }
return
local:filter(("Ethel", "Enid", "Gertrude"), $f),
'example: map treated as a function',
let $m := map {
  "Monday" : true(),
  "Wednesday" : true(),
  "Friday" : true(),
  "Saturday" : false(),
  "Sunday" : false()
},
$days := ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
return fn:filter($days,$m),
'3.1.6 Named Function References',
fn:abs#1,
fn:concat#5,
local:myfunc#2,
'3.1.7 Inline Function Expressions',
function() as xs:integer+ { 2, 3, 5, 7, 11, 13 },
function($a as xs:double, $b as xs:double) as xs:double { $a * $b },
function($a) { $a },
collection()/(let $a := . return function() { $a }),
'3.1.8 Enclosed Expressions',
{ 'hello'},
{ 'hello', 'world'},
{()},
{},
'END'
)
