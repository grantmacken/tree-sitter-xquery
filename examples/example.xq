('3.9 Node Constructors',
'3.9.3 Computed Constructors',
'3.9.3.1 Computed Element Constructors',
element book {
   attribute isbn {"isbn-0060229357" },
   element title { "Harold and the Purple Crayon"},
   element author {
      element first { "Crockett" },
      element last {"Johnson" }
   }
},
element {fn:node-name($e)}
   {$e/@*, 2 * fn:data($e)},
  element
    {$dict/entry[@word=name($e)]/variant[@xml:lang="it"]}
    {$e/@*, $e/node()},
'3.9.3.2 Computed Attribute Constructors',
attribute size {4 + 3},
attribute
   { if ($sex = "M") then "husband" else "wife" }
   { <a>Hello</a>, 1 to 3, <b>Goodbye</b> },
   '3.9.3.3 Document Node Constructors',
document
  {
      <author-list>
         {fn:doc("bib.xml")/bib/book/author}
      </author-list>
  },
  '3.9.3.4 Text Node Constructors',
  text {"Hello"},
  '3.9.3.5 Computed Processing Instruction Constructors',
  let $target := "audio-output",
    $content := "beep"
return processing-instruction {$target} {$content},
'3.9.3.6 Computed Comment Constructors',
let $homebase := "Houston"
return comment {fn:concat($homebase, ", we have a problem.")},
'3.9.3.7 Computed Namespace Constructors',
namespace a {"http://a.example.com" },
namespace {"a"} {"http://a.example.com" },
namespace { "" } {"http://a.example.com" },
element e { namespace {''} {'u'} },
'end'
)
