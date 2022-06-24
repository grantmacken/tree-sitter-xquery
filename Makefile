SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent
include .env
NVIM_QUERIES := $(HOME)/.config/nvim/queries
Queries := $(NVIM_QUERIES)/xquery/$(notdir $(wildcard queries/*))

default: src/grammar.json $(NVIM_QUERIES)/xquery/highlights.scm $(NVIM_QUERIES)/xquery/textobjects.scm

# default: generate tree-sitter grammar
generate: src/grammar.json ## generate tree-sitter files

.PHONY: help
help: ## show this help	
	@cat $(MAKEFILE_LIST) | 
	grep -oP '^[a-zA-Z_-]+:.*?## .*$$' |
	sort |
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: meld
meld:
	meld queries/highlights.scm  ../nvim-treesitter/queries/xquery/highlights.scm

.PHONY: clean 
clean: ## remove tree-sitter generated artifacts
	rm -fr node_modules
	rm -f package-lock.json
	rm -fr build
	rm -f log.html
	rm -f tree-sitter-xquery.wasm
	rm -fr bin


src/grammar.json: grammar.js
	@echo '==========================================='
	@yarn generate
	@echo '==========================================='

.PHONY: watch-grammar
watch-grammar: ## if changes in grammar.js then generate
	@while true;
	do $(MAKE) || true;
	inotifywait -qre close_write ./  &>/dev/null;
	done

.PHONY: buildr
buildr: ## build wasm the open web ui
	yarn build

tree-sitter-xquery.wasm: buildr
	source /home/gmack/projects/emsdk/emsdk_env.sh 
	yarn build-wasm


.PHONY: publish
publish: tree-sitter-xquery.wasm ## publish to gh pages
	mkdir -p publish
	cp -v $< publish/
	cp -v node_modules/web-tree-sitter/tree-sitter.wasm publish/
	cp -v node_modules/web-tree-sitter/tree-sitter.js publish/
	cp -v node_modules/web-tree-sitter/tree-sitter-web.d.ts publish/



.PHONY: test
test: ## test specific section nominated in .env
	yarn test -f '$(TEST_SECTION)'

.PHONY: test-all
test-all: ## test specific section nominated in .env
	yarn test

.PHONY: parse
parse:  ## parse a specific example nominated in .env
	@yarn parse examples/spec/$(EXAMPLE).xq

.PHONY: parse-all
parse-all:  parse-spec parse-qt3 ## parse all examples
	
PHONY: parse-graph
parse-graph:  ## parse, then show svg grah in firefox
	@$(TS) parse examples/spec/$(EXAMPLE).xq -D || true 
	@firefox log.html

.PHONY: parse-spec
parse-spec:  ## parse all spec examples
	yarn parse -q examples/spec/*

.PHONY: parse-qt3
parse-qt3:  ## parse all app examples 
	yarn parse -q examples/qt3/app/Demos/*
	yarn parse -q examples/qt3/app/walmsley/*
	yarn parse -q examples/qt3/app/XMark/*
	# parse  examples/qt3/app/XMark/XMark_All.xq -D || true
	#firefox log.html

.PHONY: hl
hl: ## highlight query specific example nominated in .env
	yarn highlight examples/spec/$(EXAMPLE).xq

$(NVIM_QUERIES)/xquery/%.scm: queries/%.scm
	@mkdir -p $(dir $@)
	@cp -v $< $@

# playground: tree-sitter-xQuery.wasm
.PHONY: web
web:
	# podman pull docker.io/emscripten/emsdk:2.0.24
	

xxxx:
	# rm -f tree-sitter-xquery.wasm
	# tree-sitter build-wasm 
	# tree-sitter web-ui
# 	@npx tree-sitter generate && \
# 	npx node-gyp rebuild && \
# 	npx tree-sitter build-wasm && \
# 	npx tree-sitter web-ui

.PHONY: stow
stow:
	@pushd _config
	@stow -v -t ~/.tree-sitter .
	@popd

.PHONY: install
install:
	@mkdir -p bin
	if [ -e node_modules/.bin/tree-sitter ]
	then 
	yarn update
	else
	yarn install
	fi


# .PHONY: after-push
# after-push: cp
# 	echo $@
# 	@pushd $(HOME)/.local/share/nvim/site/pack/packer/opt/nvim-treesitter
# 	@nvim --headless -c "luafile ./scripts/write-lockfile.lua"
# 	@jq '.' lockfile.json 
# 	@popd

.PHONY: pr-create
pr-create: parse-all test-all query-all 
	@#gh pr create --help
	@gh pr create --fill

.PHONY: pr-merge
pr-merge: 
	@#gh pr merge --help
	@gh pr merge -s -d
	git pull

# .PHONY: headless
# headless:
# 	@nvim --headless +PackerSync +qall
	@#nvim --headless +TSUpdateSync +qall

.PHONY: format
format:  grammar.js
	@#prettier --list-different grammar.js
	@prettier  --write --no-config --no-editorconfig --single-quote --print-width 120  grammar.js

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
