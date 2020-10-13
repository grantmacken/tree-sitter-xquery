SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent
include .env
TS_DOWNLOAD_URL := https://github.com/tree-sitter/tree-sitter/releases/download/
TS=node_modules/.bin/tree-sitter

generate: src/grammar.json

src/grammar.json: grammar.js
	@echo '==========================================='
	@$(TS) generate
	@#bin/tree-sitter parse examples/*.xq --quiet
	@echo '==========================================='

.PHONY: watch-grammar
watch-grammar:
	@while true;
	do $(MAKE) || true;
	inotifywait -qre close_write ./  &>/dev/null;
	done

.PHONY: test
test:
	@$(TS) -f '$(TEST_SECTION)'

.PHONY: parse
parse:
	@$(TS) parse examples/$(EXAMPLE).xq

.PHONY: query
query:
	@$(TS) query --captures queries/highlights.scm examples/$(EXAMPLE).xq

.PHONY: hl
hl:
	@$(TS) highlight  --scope source.xquery examples/$(EXAMPLE).xq

playground: tree-sitter-xQuery.wasm

tree-sitter-xQuery.wasm: grammar.js
	@$(TS) build-wasm
	@$(TS) web-ui

.PHONY: stow-config
stow-config:
	@pushd _config
	@stow -v -t ~/.tree-sitter .
	@popd

getTreeSitter: bin/tree-sitter

bin/tree-sitter: .env
	@mkdir -p bin
	@wget -O - $(TS_DOWNLOAD_URL)/$(TS_RELEASE)/tree-sitter-linux-x64.gz | gunzip - > bin/tree-sitter
	@chmod +x bin/tree-sitter
	@bin/tree-sitter --version

