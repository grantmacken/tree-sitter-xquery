# A tree-sitter for XQuery

A tree-sitter grammar is built for an as-you-type experience in a text editor.

The aim is to provide fast identification of syntax tree parts that enable
text highlighting, indenting, folding, scope info and more for a text editor.

The incremental tree-sitter parse should be a step above text highlighting with regular
expressions, however tree-sitter should not be confused with a validating parser. Unlike a 
validating parser, tree-sitter will not stop on-error, but continue to parse and provide
a syntax highlighting.

- [tree-sitter presentation](https://www.youtube.com/watch?v=Jes3bD6P0To)  a new parsing system for programming tools
- [why tree sitter](https://github.com/github/semantic/blob/master/docs/why-tree-sitter.md) GitHub semantic team

## A tree-sitter web playground 

Visit the interactive treesitter web [playground](https://grantmacken.github.io/tree-sitter-xquery) to see the 
XQuery tree-sitter in action.

## Building

Both Make and Yarn are required to use this repo, so you will need to install both.
Clone and `cd` into this repo then run `make install` which will use Yarn to install the tree-sitter cli.


 All the work is done in the `grammar.js` file

The repo contains a Makefile as I use `make` for treesitter aliases.
The default `make` target is an alias for `tree-sitter generate` which will create tree-sitter files from the grammar

To see other make targets type `make help`

## Identifiers in XQuery

An identifier in XQuery is a Extended QName, aka an EQName.
The aim of the XQuery highlight captures for identifiers is show their syntactic role.

```
my:salary(),
(: highlight 'my' as 'namespace', 'salary' as 'function.call' :)
(salary, bonus),
(: highlight 'salary' and  'bonus' as type.name_test :)
```

I have attempted to make highlight captures indicates syntactic context

```
let $salary := 1000 return $salary
(: 
first '$salary' as  variable.let_binding 
'return' as  keyword.return.flwor 
next '$salary' as variable.reference 
:)
```


## An attempt to eliminate semantic token ambiguity

Note: This list is incomplete

### brackets

 - [x]  ` "["  "]" `  predicate in postfix expression
 - [x]  ` "["  "]" `  predicate in axis step
 - [x]  ` "["  "]" `  square array constructor

### keywords

 - [x]  `element`  in prolog declarations
 - [x]  `element`  in computed element constructor
 - [x]  `element`  in element kind test   

 - [x]  `function`  in prolog declarations 'default namespace declaration' and 'function declaration'
 - [x]  `function`  in inline function expression
 - [x]  `function`  in any function test 

 - [x]  `item`  in prolog declarations 'context item declarations'
 - [x]  `item`  in any item test

## Testing Goals: <!--1, 2  TODO , 3 -->

1. `make parse-all` The parser **SHOULD NOT** throw a parse error with any **valid** XQuery module text.
<!-- 3. `make query-all` The query capture S-expressions **should not** error -->
<!-- 2. `make test-all` All tree-sitter tests in the test/corpus **should not** error -->

Tests are run via [GitHub actions](https://github.com/grantmacken/tree-sitter-xQuery/actions)

The parsing examples that are derived from the [W3C xQuery recommendation](https://www.w3.org/TR/xquery-31)
are found in the 'examples/spec' folder. Other parse examples are from the [qt3tests suite](https://github.com/w3c/qt3tests) and are in the examples/qt3tests folder

<!-- TODO
The `test/corpus/` tree-sitter tests are mainly organised around the sections outlined in the 
[W3C xQuery recommendation](https://www.w3.org/TR/xquery-31).
-->

To peek at tree-sitter highlight captures in action, I run some query examples in 
[GitHub actions](https://github.com/grantmacken/tree-sitter-xQuery/actions), 
which you might want to look at. 

## using tree-sitter with neovim

 - [Video: Neovim Treesitter](https://www.youtube.com/watch?v=xQGbhiUbSmM)
 - [Video: Tree sitter & LSP: Short Comparison](https://www.youtube.com/watch?v=c17j09vY5sw)

Follow the instructions at
[GitHub: nvim-treesitter ](https://github.com/nvim-treesitter/nvim-treesitter#adding-parsers)
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

<!--

## better semantic highlighting: example in neovim

![terminal screeshot](assets/2021-09-02_10-56.png)

1. '\*' in the context of sequence_type/any_array_test/wildcard 
2. '+'  in the context of sequence_type/occurrence
3. '+'  in the context of additive_expr so colored as an operator
4. 'xs:date' in this context is a constuctor function so it is colored as a function, whereas elsewhere as the 2nd line 'xs:integer' this appears in the 
sequence_type context so it will be colored as a type.

More spot the semantic color differences
 - '[' ']' can be a square array constructors or delimit predicates
 - '(' ')' can be a parenthesized expr or delimit parameter and argument lists

-->

## Contributing, Discussions and Issues

[Contributions](CONTRIBUTING.md) and suggestions in form of 
[issues](https://github.com/grantmacken/tree-sitter-xquery/issues) are welcome.


