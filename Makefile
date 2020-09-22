SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --silent
include .env
ts_download_url := https://github.com/tree-sitter/tree-sitter/releases/download/

generate: src/grammar.json

src/grammar.json: grammar.js
	@echo '==========================================='
	@bin/tree-sitter generate
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
	@bin/tree-sitter test -f '$(TEST_SECTION)'

.PHONY: parse
parse:
	@bin/tree-sitter parse examples/$(EXAMPLE).xq

.PHONY: query
query:
	@bin/tree-sitter query --captures queries/highlights.scm examples/$(EXAMPLE).xq

.PHONY: hl
hl:
	@bin/tree-sitter highlight  --scope source.xQuery examples/$(EXAMPLE).xq

.PHONY: stow-config
stow-config:
	@pushd _config
	@stow -v -t ~/.tree-sitter .
	@popd

getTreeSitter: bin/tree-sitter

bin/tree-sitter:
	@mkdir -p bin
	@wget -nc -O - $(ts_download_url)/$(TS_RELEASE)/tree-sitter-linux-x64.gz | gunzip - > bin/tree-sitter
	@chmod +x bin/tree-sitter
	@bin/tree-sitter --version

