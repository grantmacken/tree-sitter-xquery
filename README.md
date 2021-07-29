
# WIP tree-sitter-xQuery WIP

A tree-sitter grammar is built for an as-you-type experience in a text editor.
It should provide identification of syntax tree parts that enable
text highlighting, folding, scope info and more for a text editor.
The incremental tree-sitter parse should be a step above text highlighting with regular
expressions, but should not be confused with a validating parser. Unlike a 
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


```
## queries

$(HOME)/.config/nvim/queries/xquery

At this stage only the highlights query is available

To peek at tree-sitter in action, I also run some parse and query examples in 
[github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)
which you might want to look at. The parse examples should show what can be parsed into 
[S-expression](https://en.wikipedia.org/wiki/S-expression)
nested list (tree-structured) data. The query examples should show the capture items that can be highlighted in a
text editor.

Please note: this is very much a work in progress. I am learning as I go.

## Known limitations


## Contributing, Issues, and Tests 

[Contributions](CONTRIBUTING.md) and suggestions in form of 
[issues](https://github.com/grantmacken/tree-sitter-xquery/issues) are welcome.

Tests are run via [github actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)
and follow the main sections in the 
[xQuery 3.1](https://www.w3.org/TR/xquery-31/) W3C recomendation.
My focus is getting tree sitter to parse how xQuery is commonly used, and not so
much getting edge cases to work correctly.
