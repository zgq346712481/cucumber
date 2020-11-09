include default.mk

.codegen: src/messages.js src/messages.d.ts

src/messages.js: messages.proto
	cat $< | sed 's|package io.cucumber|//package io.cucumber|' > $<.tmp
	./node_modules/.bin/pbjs --force-number --target static-module --wrap commonjs --out $@ $<.tmp
	rm $<.tmp

src/messages.d.ts: src/messages.js
	./node_modules/.bin/pbts $< > $@

clean:
	rm -rf dist src/messages.js src/messages.d.ts
