
# tree-sitter-xQuery

A tree-sitter grammar is built for an as-you-type experience in a text editor.
It should provide identification of syntax tree parts that enable
text highlighting, folding, scope info and more for a text editor.
The incremental tree-sitter parse should be a step above text highlighting with regular
expressions, however tree-sitter should not be confused with a validating parser. Unlike a 
validating parser, tree-sitter will not stop on-error, but continue to parse. 


- [tree-sitter presentation](https://www.youtube.com/watch?v=Jes3bD6P0To) - a new parsing system for programming tools
- [why tree sitter](https://github.com/github/semantic/blob/master/docs/why-tree-sitter.md) - github semantic team
- [awesome tree sitter](https://github.com/drom/awesome-tree-sitter)

# [installing tree-sitter]( https://tree-sitter.github.io/tree-sitter/creating-parsers#installation )

Clone and cd into this repo then run `make getTreeSitter` which will use npm to install the tree-sitter binary

# building

 All the work is done in the grammar.js file

The repo contains a Makefile as I use `make` for treeitter aliases.
The default `make` target is an alias for `tree-sitter generate` which will create tree-sitter files from the grammar

To see other make targets type
```
make help
```
## tests

Tests are run via [github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)

### parse xQuery examples without error

The parser might be lax at what it accepts, so any parsed text might not be able to compile. 
However the parser **SHOULD NOT** throw a parse error with any **valid** xQuery module text.

```
make parse-spec
make parse-qt3
```

The parsing examples that are derived from the [W3C xQuery recommendation](https://www.w3.org/TR/xquery-31)
are found in the 'examples/spec' folder.

Other parse examples are from the [qt3tests suite](https://github.com/w3c/qt3tests) and are in the examples/qt3tests folder

### the test corpus

```
make test-all
```
Will test everything in the `test/corpus` directory.  
The `test/corpus/` tree-sitter tests are mainly organised around the sections outlined in the 
[W3C xQuery recommendation](https://www.w3.org/TR/xquery-31).


 ### hightlight query examples

At this stage only the highlights query is available
The query examples should show the S-expresion *capture* items that can be highlighted in a
text editor.

To peek at tree-sitter highlight in action, I run some query examples in 
[github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)
which you might want to look at. 

# using tree-sitter with neovim

 -  [Video: Neovim Treesitter](https://www.youtube.com/watch?v=xQGbhiUbSmM)
 - [Video: Tree sitter & LSP: Short Comparison](https://www.youtube.com/watch?v=c17j09vY5sw)

Follow the instuctions at
[Github: nvim-treesitter ](https://github.com/nvim-treesitter/nvim-treesitter#adding-parsers)
to use the xquery treesitter

```
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.xquery = {
  install_info = {
    url = "~/projects/grantmacken/tree-sitter-xquery", -- where you have cloned this project
    files = {"src/parser.c"}
  }
}

dddd
```



## Known limitations


## Contributing, Issues, and Tests 

[Contributions](CONTRIBUTING.md) and suggestions in form of 
[issues](https://github.com/grantmacken/tree-sitter-xquery/issues) are welcome.


