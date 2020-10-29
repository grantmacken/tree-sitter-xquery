


map {} instance of map(*),
$n instance of element(),
$n instance of element( person ),
$n instance of  element(person, surgeon),
$n instance of  element(person, surgeon? ),
$n instance of  element(*),
$n instance of  element(*, surgeon),
$n instance of  element(*, surgeon?),
$n instance of attribute(),
$n instance of attribute(price),
$n instance of attribute(price, currency),
$n instance of attribute(*, currency),
(: Schema Element Test:)
$n instance of schema-element(customer),
$n instance of schema-attribute(color)
$n instance of item(),
$n instance of node(),
$n instance of text(),
$p instance of processing-instruction(),
$p instance of processing-instruction(xml-stylesheet),
$n instance of comment(),
$n instance of namespace-node(),
$n instance of document-node(),
$n instance of  document-node(element(book)),
$n instance of  ( text() )
)

# WIP tree-sitter-xQuery

A tree-sitter grammar is built for an as-you-type experience in a text editor.
It should provide identification of syntax tree parts that enable
text highlighting, folding, scope info and more for a text editor.
The incremental tree-sitter parse should be a step above text highlighting with regular
expressions, but should not be confused with a validating parser. Unlike a 
validating parser, tree-sitter will not stop on-error, but continue to parse. 

- [tree-sitter presentation](https://www.youtube.com/watch?v=Jes3bD6P0To) - a new parsing system for programming tools
- [why tree sitter](https://github.com/github/semantic/blob/master/docs/why-tree-sitter.md) - github semantic team
- [awesome tree sitter](https://github.com/drom/awesome-tree-sitter)

## playground


```
# get tree-sitter cli
make getTreeSitter
#  generate the tree-sitter grammar  
make
# convert to web assembly and play with 
# the result in the web ui interface
make playground
```

To see highlighting in action check the query checkbox and
paste the highlight query found in queries folder.

To peek at tree-sitter in action, I also run some parse and query examples in 
[github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)
which you might want to look at. The parse examples should show what can be parsed into 
[S-expression](https://en.wikipedia.org/wiki/S-expression)
nested list (tree-structured) data. The query examples should show the capture items that can be highlighted in a
text editor.

Please note: this is very much a work in progress. I am learning as I go, and may go down many dead end or wrong paths

## contributing, issues, and tests 

[Contributions](CONTRIBUTING.md) and suggestions in form of 
[issues](https://github.com/grantmacken/tree-sitter-xQuery/issues) are welcome.

Tests are run via [github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)
and follow the main sections in the 
[xQuery 3.1](https://www.w3.org/TR/xquery-31/) W3C recomendation.
My focus is getting tree sitter to parse how xQuery is commonly used, and not so
much getting edge cases to work correctly.
