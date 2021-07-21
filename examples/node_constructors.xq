('3.9 Node Constructors',
'3.9.1 Direct Element Constructors',
<book isbn="isbn-0060229357">
    <title>Harold and the Purple Crayon</title>
    <author>
        <first>Crockett</first>
        <last>Johnson</last>
    </author>
</book>,
<example>
   <p> Here is a query. </p>
   <eg> $b/title </eg>
   <p> Here is the result of the query. </p>
   <eg>{ $b/title }</eg>
</example>,
'3.9.1.1 Attributes',
<shoe size="7"/>,
<shoe size="{7}"/>,
<shoe size="{()}"/>,
<chapter ref="[{1, 5 to 7, 9}]"/>,
<shoe size="As big as {$hat/@size}"/>,
<shoe size="As &amp; ""big"" as {{"/>,
'3.9.1.2 Namespace Declaration Attribute',
<cat xmlns = "http://example.org/animals">
  <breed>Persian</breed>
</cat>,
<box xmlns:metric = "http://example.org/metric/units"
     xmlns:english = "http://example.org/english/units">
  <height> <metric:meters>3</metric:meters> </height>
  <width> <english:feet>6</english:feet> </width>
  <depth> <english:inches>18</english:inches> </depth>
</box>,
'3.9.1.3 Content',
<a>{1}</a>,
<a>{1, 2, 3}</a>,
<c>{1}{2}{3}</c>,
<b>{1, "2", "3"}</b>,
<fact>I saw 8 cats.</fact>,
<fact>I saw {5 + 3} cats.</fact>,
<fact>I saw <howmany>{5 + 3}</howmany> cats.</fact>,
'3.9.1.4 Boundary Whitespace',
<book isbn="isbn-0060229357">
    <title>Harold and the Purple Crayon</title>
    <author>
        <first>Crockett</first>
        <last>Johnson</last>
    </author>
</book>,
<a>  {"abc"}  </a>,
<a>&#x20;{"abc"}</a>,
<a>{"  "}</a>,
<a>{ [ "one", "little", "fish" ] }</a>,
'TODO! 3.9.2 Other Direct Constructors',
'TODO! 3.9.3 Computed Constructors',
'end'
)
