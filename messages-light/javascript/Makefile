include default.mk

.codegen: src/messagesLight.ts

src/messagesLight.ts: ../../messages/javascript/src/messages.d.ts writeMessagesLight.ts
	cat $< | ./node_modules/.bin/ts-node ./writeMessagesLight.ts > $@

clean:
	rm -rf dist src/messages.js src/messages.d.ts src/messagesLight.ts
