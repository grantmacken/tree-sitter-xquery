SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent

include .env
NVIM_QUERIES := ../dotfiles/neovim/queries
Queries := $(NVIM_QUERIES)/xquery/$(notdir $(wildcard queries/*))

# default: generate
default: format generate queries parse hl
	echo ' => done'

# default: generate tree-sitter grammar
generate: src/grammar.json ## generate tree-sitter files
# $(NVIM_QUERIES)/xquery/textobjects.scm
queries: $(NVIM_QUERIES)/xquery/highlights.scm

.PHONY: help
help: ## show this help	
	@cat $(MAKEFILE_LIST) | 
	grep -oP '^[a-zA-Z_-]+:.*?## .*$$' |
	sort |
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# .PHONY: meld
# meld:
# 	meld queries/highlights.scm  ../nvim-treesitter/queries/xquery/highlights.scm

.PHONY: clean 
clean: ## remove tree-sitter generated artifacts
	rm -fr node_modules
	rm -f package-lock.json
	rm -fr build
	rm -f log.html
	rm -f tree-sitter-xquery.wasm
	rm -fr bin

src/grammar.json: grammar.js
	echo '==========================================='
	yarn generate
	echo '==========================================='

.PHONY: watch-grammar
watch-grammar: ## if changes in grammar.js then generate
	while true;
	do $(MAKE) || true;
	inotifywait -qre close_write ./  &>/dev/null;
	done

.PHONY: buildr
buildr: ## build wasm then open web ui
	yarn build

tree-sitter-xquery.wasm: buildr
	source /home/gmack/projects/emsdk/emsdk_env.sh 
	yarn build-wasm

.PHONY: docs
docs: tree-sitter-xquery.wasm ## publish to gh pages
	mkdir -p docs
	cp -v $< docs/
	cp -v node_modules/web-tree-sitter/tree-sitter.wasm docs/
	cp -v node_modules/web-tree-sitter/tree-sitter.js docs/
	cp -v node_modules/web-tree-sitter/tree-sitter-web.d.ts docs/

.PHONY: test
test: ## test specific section nominated in .env
	yarn test -f '$(TEST_SECTION)'

.PHONY: test-all
test-all: ## test everyyhin in the test dir
	yarn test

.PHONY: tags
tags:  ##  test out a tags query file nominated in .env
	echo 'examples/spec/$(EXAMPLE).xq'
	echo
	yarn tags examples/example.xquery
	echo

.PHONY: parse
parse:  ## parse a specific example nominated in .env
	echo 'examples/spec/$(EXAMPLE).xq'
	echo
	yarn parse examples/spec/$(EXAMPLE).xq
	echo

.PHONY: parse-all
parse-all: parse-spec parse-qt3 ## parse all examples
	
PHONY: parse-graph
parse-graph:  ## parse, then show svg grah in firefox
	yarn parse examples/spec/$(EXAMPLE).xq -D || true 
	firefox log.html

.PHONY: parse-spec
parse-spec:  ## parse all spec examples
	yarn parse -q examples/spec/*

.PHONY: parse-qt3
parse-qt3:  ## parse all app examples 
	yarn parse -q examples/qt3/app/Demos/*
	yarn parse -q examples/qt3/app/walmsley/*
	yarn parse -q examples/qt3/app/XMark/*

.PHONY: hl
hl: ## highlight query specific example nominated in .env
	yarn highlight examples/spec/$(EXAMPLE).xq

$(NVIM_QUERIES)/xquery/%.scm: queries/%.scm
	@mkdir -v -p $(dir $@)
	@cp -v $< $@

# playground: tree-sitter-xQuery.wasm
.PHONY: web
web:
	yarn web

.PHONY: install
install:
	@mkdir -p bin
	if [ -e node_modules/.bin/tree-sitter ]
	then 
	echo ' - upgrading via package json'
	yarn install
	else
	echo ' - upgrading via package json'
	yarn upgrade
	fi

.PHONY: pr-create
pr-create: parse-all
	@#gh pr create --help
	@gh pr create --fill

.PHONY: pr-merge
pr-merge: 
	@#gh pr merge --help
	@gh pr merge -s -d
	git pull

.PHONY: format
format:  grammar.js
	#prettier --list-different grammar.js
	./node_modules/.bin/prettier  --write --no-config --no-editorconfig --single-quote --print-width 180  grammar.js

.PHONY: rec
rec:
	@mkdir -p ../tmp
	@asciinema rec ../tmp/$(@).cast \
 --overwrite \
 --title='treesitter '\
 --idle-time-limit 1

PHONY: play
play:
	@asciinema play ../tmp/rec.cast

.PHONY: upload
upload:
	asciinema upload ../tmp/rec.cast
