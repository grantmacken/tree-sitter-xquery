SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --dsilent
include .env

generate: src/grammar.json ## default: generate tree-sitter grammar

.PHONY: help
help: ## show this help	
	@cat $(MAKEFILE_LIST) | 
	grep -oP '^[a-zA-Z_-]+:.*?## .*$$' |
	sort |
	awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'


.PHONY: clean 
clean: ## remove tree-sitter generated artifacts
	@rm -f Cargo.toml
	@rm -fr node_modules
	@rm -f package*
	@rm -f binding.gyp
	@rm -fr bindings/
	@rm -fr src/

src/grammar.json: grammar.js
	@echo '==========================================='
	@$(TS) generate
	@#$(TS) parse examples/*.xq --quiet
	@echo '==========================================='

.PHONY: watch-grammar
watch-grammar: ## if changes in grammar.js then generate
	@while true;
	do $(MAKE) || true;
	inotifywait -qre close_write ./  &>/dev/null;
	done

.PHONY: test
test: ## test specific section nominated in .env
	@$(TS) test -f '$(TEST_SECTION)'

.PHONY: parse
parse:  ## parse specific example nominated in .env
	@$(TS) parse examples/$(EXAMPLE).xq

QUERIES_XQUERY_PATH := $(HOME)/.config/nvim/queries/xquery

.PHONY: query 
query:  $(addprefix $(QUERIES_XQUERY_PATH)/, $(notdir $(wildcard queries/*))) ## query specific example nominated in .env

$(QUERIES_XQUERY_PATH)/%.scm: queries/%.scm
	@mkdir -p $(dir $@)
	@cp -v $< $@
	@$(TS) query --captures $< examples/$(EXAMPLE).xq

.PHONY: hl
hl:
	@$(TS) highlight  --scope source.xquery examples/$(EXAMPLE).xq

# playground: tree-sitter-xQuery.wasm

# tree-sitter-xQuery.wasm: grammar.js
# 	@rm -f tree-sitter-xquery.wasm
# 	@$(TS) build-wasm
# 	@$(TS) web-ui

.PHONY: stow
stow:
	@pushd _config
	@stow -v -t ~/.tree-sitter .
	@popd

.PHONY: getTreeSitter
getTreeSitter:
	@mkdir -p bin
	if [ -e node_modules/.bin/tree-sitter ]
	then 
	npm update
	else
	npm init
	npm install --save nan
	npm install --save-dev tree-sitter-cli
	fi
	if ! [ -L bin/tree-sitter ]
	then
	pushd bin
	ln -s ../node_modules/.bin/tree-sitter
	popd
	fi
	@bin/tree-sitter --version

# .PHONY: after-push
# after-push: cp
# 	echo $@
# 	@pushd $(HOME)/.local/share/nvim/site/pack/packer/opt/nvim-treesitter
# 	@nvim --headless -c "luafile ./scripts/write-lockfile.lua"
# 	@jq '.' lockfile.json 
# 	@popd

