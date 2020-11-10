include default.mk

.codegen: src/messages.ts

src/messages.ts: ../../messages/javascript/src/messages.d.ts writeMessagesLight.ts
	cat $< | ./node_modules/.bin/ts-node ./writeMessagesLight.ts > $@

clean:
	rm -rf dist src/messages.ts
