COFFEEC = coffee
LESSC = lessc

TEXTUAL_DIR = $(HOME)/Library/Containers/com.codeux.irc.textual/Data/Library/Application\ Support/Textual\ IRC/Styles

RSYNC_FLAGS = --exclude ".git" --exclude ".DS_Store" --exclude "Makefile" --exclude "*.sw*" --exclude "src" --exclude "build" --exclude ".gitignore"

JSSRC = $(wildcard src/scripts/*.coffee)
JSOBJ = ${JSSRC:src/scripts/%.coffee=build/%.js}
JSOUT = scripts.js

.PHONY: all
all: compile install

$(JSOUT): $(JSOBJ)
	@cat $^ > $@

build/%.js: src/scripts/%.coffee
	@mkdir -p $(@D)
	@$(COFFEEC) -cp $< > $@

CSSSRC = src/styles/design.less
CSSOBJ = ${CSSSRC:src/styles/%.less=build/%.css}
CSSOUT = design.css

$(CSSOUT): $(CSSOBJ)
	@cat $^ > $@

build/%.css: src/styles/%.less
	@$(LESSC) $< > $@

.PHONY: compile
compile: $(JSOUT) $(CSSOUT)

.PHONY: install
install:
	rsync -av $(PWD)/ $(TEXTUAL_DIR)/bd808 $(RSYNC_FLAGS)

.PHONY: clean
clean:
	@-rm -rf build
