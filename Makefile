SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent
include .env
TS=bin/tree-sitter

generate: src/grammar.json

src/grammar.json: grammar.js
	@echo '==========================================='
	@$(TS) generate
	@#$(TS) parse examples/*.xq --quiet
	@echo '==========================================='

.PHONY: watch-grammar
watch-grammar:
	@while true;
	do $(MAKE) || true;
	inotifywait -qre close_write ./  &>/dev/null;
	done

.PHONY: test
test:
	@$(TS) test -f '$(TEST_SECTION)'

.PHONY: parse
parse:
	@$(TS) parse examples/$(EXAMPLE).xq

QUERIES_XQUERY_PATH := $(HOME)/.config/nvim/queries/xquery

.PHONY: query
query:  $(addprefix $(QUERIES_XQUERY_PATH)/, $(notdir $(wildcard queries/*)))

$(QUERIES_XQUERY_PATH)/%.scm: queries/%.scm
	@mkdir -p $(dir $@)
	@cp -v $< $@
	@$(TS) query --captures $< examples/$(EXAMPLE).xq

.PHONY: hl
hl:
	@$(TS) highlight  --scope source.xquery examples/$(EXAMPLE).xq

playground: tree-sitter-xQuery.wasm

tree-sitter-xQuery.wasm: grammar.js
	@$(TS) build-wasm
	@$(TS) web-ui

.PHONY: stow
stow:
	@pushd _config
	@stow -v -t ~/.tree-sitter .
	@popd

getTreeSitter: bin/tree-sitter

bin/tree-sitter:
	@mkdir -p bin
	if [ -e node_modules/.bin/tree-sitter ]
	then 
	npm update
	else
	npm install
	fi
	if ! [ -L bin/tree-sitter ]
	then
	pushd bin
	ln -s ../node_modules/.bin/tree-sitter
	popd
	fi
	@bin/tree-sitter --version

.PHONY: after-push
after-push: cp
	echo $@
	@pushd $(HOME)/.local/share/nvim/site/pack/packer/opt/nvim-treesitter
	@nvim --headless -c "luafile ./scripts/write-lockfile.lua"
	@jq '.' lockfile.json 
	@popd

.PHONY: cp
cp: 


