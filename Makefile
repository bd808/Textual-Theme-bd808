TEXTUAL_DIR=$(HOME)/Library/Containers/com.codeux.irc.textual/Data/Library/Application\ Support/Textual\ IRC/Styles
RSYNC_FLAGS=--exclude ".git" --exclude ".DS_Store" --exclude "Makefile" --exclude "*.sw*"

all: install

install:
	rsync -av $(PWD)/ $(TEXTUAL_DIR)/bd808 $(RSYNC_FLAGS)

.PHONY: install
