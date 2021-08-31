Thank you for contributing
==========================

## Project Setup

The project consists of 
 - grammar.js  the tree-sitter grammar for xQuery.
 - test/corpus/   
 - queries/       highlight.scm  etc
 - examples/      xQuery example files
 - config        this is the symlinked to the `$HOME/.tree-sitter`
 - Makefile: some tree-sitter shortcut commands, helped by a dot env file

 The top-level `make` just invokes `tree-sitter generate`.
 To adjust what files are tested, parsed or queried, I alter vars in '.env'.
 `make test` var TEST_SECTION: will test my current working **section** under test.  
 For `make parse`, `make test`, `make query` and `make hl`, will use the EXAMPLE file in the examples folder

## xQuery Treesitter Grammar

Although there is a lot to digest the guides I have found useful are

- [writing the grammar](http://tree-sitter.github.io/tree-sitter/creating-parsers#writing-the-grammar)
- [grammar development guide](https://github.com/github/semantic/blob/master/docs/grammar-development-guide.md)


## xQuery Treesitter Queries

Capture queries are written as S-expresions

1. hightlights: WIP
2. locals: TODO 
3. folds: TODO
4. indents: TODO

The above are built in, but there should be other queries associated with treesitter plugin modules

Apart from looking at how other grammar queries are constructed, I refer to the following
 * [pattern matching with queries](https://tree-sitter.github.io/tree-sitter/using-parsers#pattern-matching-with-queries)
 * [syntax highlighting queries](https://tree-sitter.github.io/tree-sitter/syntax-highlighting#queries)
 * [emacs syntax highlighting query guide](https://emacs-tree-sitter.github.io/syntax-highlighting/queries/)↲
 * [neovim treesitter contributing](https://github.com/nvim-treesitter/nvim-treesitter/blob/master/CONTRIBUTING.md)

Captures will only capture if a query will resolve to a valid node in the grammer.
So frequently running `make query-all` is a good idea, as it will throw an diagnostic error 

## Known limitations/issues

### comments

errors if ':' or ')' at end of comment delimiter

```xquery

(: OK! (: xquery allows embed comments :) :)
(:~
:  ok with doc style comments
:
:)
 (: but this will error ::)
```

There are no lookahead regex expr allowed for tree-sitter grammars,
so this might no be resolved, unless a c lexer is used. Thats what other
TS grammars use.


###  extra node can appear in direct constructors

not sure how to resolve

###  regex edge cases 

 TODO



