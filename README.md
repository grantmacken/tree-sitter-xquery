# WIP tree-sitter-xQuery

Please note: this is very much a **work in progress**.
I am learning as I go, and may go down many dead end or wrong paths.
Contributions and suggestions welcome. 

A tree-sitter grammar is built for an as-you-type experience in a text editor.
It should provide identification of syntax tree parts that enable
text highlighting, folding and scope info for a text editor.
The incremental tree-sitter parse should be a step above text highlighting with regular
expressions, but should not be confused with a validating parser. Unlike a 
validating parser, tree-sitter will not stop on-error, but continue to parse. 

- [tree-sitter presentation](https://www.youtube.com/watch?v=Jes3bD6P0To) - a new parsing system for programming tools
- [awesome tree sitter](https://github.com/drom/awesome-tree-sitter)
- [why tree sitter](https://github.com/github/semantic/blob/master/docs/why-tree-sitter.md) - github semantic team
 
## Project Setup

I obtained the tree-sitter cli from the 
tree-sitter repo releases(https://github.com/tree-sitter/tree-sitter/releases)
If you run a linux OS then running `make getTreeSitter` from this repo root  should download the latest release and place it place in `~/.local/bin`.  
Check to see if is PATH reachable by `which tree-sitter`. If not make sure  `~/.local/bin`
is on your PATH.

The project consists of 
 - grammar.js  the tree-sitter grammar for xQuery.
 - test/corpus: some tests for the grammar with based on **sections** in the xQuery 3.1 spec
 - queries: the highlight queries 
 - Makefile: tree-sitter shortcut commands
   - make: tree-sitter generate
   - make test  
   - make parse
   - make query

 Makefile reads '.env' file.
 To adjust what files are tested, parsed or queried, alter vars in '.env'.

## xQuery Grammar

Although there is a lot to digest the guides I have found useful are

- [writing the grammar](http://tree-sitter.github.io/tree-sitter/creating-parsers#writing-the-grammar)
- [grammar development guide](https://github.com/github/semantic/blob/master/docs/grammar-development-guide.md)

### TODO list

- TODO

<!--
@see https://www.w3.org/2013/01/xquery-30-use-cases/xquery-30-example-queries.txt
-->






