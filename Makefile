SHELL=/bin/bash
.ONESHELL:
.SHELLFLAGS := -eu -o pipefail -c
.DELETE_ON_ERROR:
MAKEFLAGS += --warn-undefined-variables
MAKEFLAGS += --no-builtin-rules
MAKEFLAGS += --dsilent
include .env
TS := bin/tree-sitter
NVIM_QUERIES := $(HOME)/.config/nvim/queries
Queries := $(NVIM_QUERIES)/xquery/$(notdir $(wildcard queries/*))

default: src/grammar.json $(NVIM_QUERIES)/xquery/highlights.scm $(NVIM_QUERIES)/xquery/textobjects.scm

# default: generate tree-sitter grammar
generate: src/grammar.json ## generate tree-sitter files

.PHONY: hl
hl: ## hightlight query specific example nominated in .env
	@$(TS) query --captures queries/highlights.scm examples/$(EXAMPLE).xq

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

.PHONY: test-all
test-all: ## test specific section nominated in .env
	@$(TS) test

.PHONY: parse
parse:  ## parse a specific example nominated in .env
	@$(TS) parse examples/spec/$(EXAMPLE).xq
	
.PHONY: parse-spec
parse-spec:  ## parse all spec examples
	@$(TS) parse -q examples/spec/*

.PHONY: parse-qt3
parse-app:  ## parse all app examples 
	@$(TS) parse -q examples/qt3/app/Demos/*
	@$(TS) parse -q examples/qt3/app/walmsley/*
	@$(TS) parse -q examples/qt3/app/XMark/*

$(NVIM_QUERIES)/xquery/%.scm: queries/%.scm
	@mkdir -p $(dir $@)
	@cp -v $< $@

# playground: tree-sitter-xQuery.wasm
# .PHONY: web
# web:
# 	@source /home/gmack/projects/emsdk/emsdk_env.sh &>/dev/null
# 	@emcc --version
# 	@rm -f tree-sitter-xquery.wasm
# 	@npx tree-sitter generate && \
# 	npx node-gyp rebuild && \
# 	npx tree-sitter build-wasm && \
# 	npx tree-sitter web-ui

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
	#npm init --yes
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

.PHONY: pr-create
pr-create: 
	gh pr create --help
	gh pr create --fill

.PHONY: pr-merge
pr-merge: 
	gh pr merge --help
	gh pr merge -s -d
	git pull

# .PHONY: headless
# headless:
# 	@nvim --headless +PackerSync +qall
	@#nvim --headless +TSUpdateSync +qall
