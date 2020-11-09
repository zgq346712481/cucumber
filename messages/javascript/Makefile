include default.mk

.codegen: src/messages.js src/messages.d.ts src/messagesLight.ts

src/messages.js: messages.proto
	cat $< | sed 's|package io.cucumber|//package io.cucumber|' > $<.tmp
	./node_modules/.bin/pbjs --target static-module --wrap commonjs --out $@ $<.tmp
	rm $<.tmp

src/messages.d.ts: src/messages.js
	./node_modules/.bin/pbts $< > $@

src/messagesLight.ts: src/messages.d.ts writeMessagesLight.ts
	cat $< | ./node_modules/.bin/ts-node ./writeMessagesLight.ts > $@

clean:
	rm -rf dist src/messages.js src/messages.d.ts src/messagesLight.ts

