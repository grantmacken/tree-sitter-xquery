Thank you for contributing
==========================

## Project Setup

I obtained the tree-sitter cli from the 
tree-sitter repo releases(https://github.com/tree-sitter/tree-sitter/releases)
If you run a linux OS then running `make getTreeSitter` should download the latest release and place it place in `~/.local/bin`.  
Check to see if is PATH reachable by `which tree-sitter`. If not make sure  `~/.local/bin` is on your PATH.

The project consists of 
 - grammar.js  the tree-sitter grammar for xQuery.
 - test/corpus/   
 - queries/       highlight.scm  etc
 - examples/      xQuery example files:vs
 - _config        this is the symlinked to the `~/.tree-sitter
 - Makefile: some tree-sitter shortcut commands, helped by a dot env file
   - make
   - make test      
   - make parse
   - make query
   - make highlight

 The top-level `make` just invokes `tree-sitter generate`.
 To adjust what files are tested, parsed or queried, I alter vars in '.env'.
 `make test` var TEST_SECTION: will test my current working **section** under test.  
 For `make parse`, `make test`, `make query` and `make highlight`, will use the EXAMPLE file in the examples folder

## xQuery Grammar

Although there is a lot to digest the guides I have found useful are

- [writing the grammar](http://tree-sitter.github.io/tree-sitter/creating-parsers#writing-the-grammar)
- [grammar development guide](https://github.com/github/semantic/blob/master/docs/grammar-development-guide.md)

## Known limitations/issues

### Resolving rhs for xPath axis expressions

`$node/descendant::toy[attribute::color = "red"]`
throws error as we require right hand side for axis expressions,
`$node/descendant::toy[./attribute::color = "red"]`
solution is to use context expression 

###  extra node in direct constructors

not sure how to resolve

###  regex edge cases 

 TODO



