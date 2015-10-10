COFFEEC = coffee
LESSC = lessc

TEXTUAL_DIR = $(HOME)/Library/Group\ Containers/com.codeux.apps.textual/Library/Application\ Support/Textual/Styles

RSYNC_FLAGS = --exclude ".git" --exclude ".DS_Store" --exclude "Makefile" --exclude "*.sw*" --exclude "src" --exclude "build" --exclude ".gitignore"
LESSC_FLAGS = --no-ie-compat -O2 --strict-imports

JSSRC = $(wildcard src/scripts/*.coffee)
JSOBJ = ${JSSRC:src/scripts/%.coffee=build/%.js}
JSOUT = scripts.js

.PHONY: all
all: compile install

$(JSOUT): $(JSOBJ)
	cat $^ > $@

build/%.js: src/scripts/%.coffee
	@mkdir -p $(@D)
	$(COFFEEC) -cp $< > $@

CSSSRC = src/styles/design.less
CSSOBJ = ${CSSSRC:src/styles/%.less=build/%.css}
CSSOUT = design.css

$(CSSOUT): $(CSSOBJ)
	cat $^ > $@

build/%.css: src/styles/%.less
	$(LESSC) $(LESSC_FLAGS) $< > $@

.PHONY: compile
compile: $(JSOUT) $(CSSOUT)

.PHONY: install
install:
	rsync -av $(PWD)/ $(TEXTUAL_DIR)/bd808 $(RSYNC_FLAGS)

.PHONY: clean
clean:
	-rm -rf build
