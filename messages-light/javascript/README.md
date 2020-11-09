# Cucumber Messages for JavaScript (Light version)

## Messages Light

The `messagesLight` TypeScript types and the `messagesLightReviver` JSON reviver removes the need to use the protobuf
library to parse JSON messages. This removes the need to import 800k of generated JavaScript and another 300k of the
`protobufjs` runtime.

## Usage

```typescript
import { messagesLight, messagesLightReviver } from '@cucumber/messages'

const envelope: messagesLight.IEnvelope = JSON.parse(json, messagesLightReviver)
```

### Explanation

The `pbjs` tool from `protobufjs` generates code for parsing and serialising messages to both binary protobuf and
NDJSON representation.

All this functionality has some overhead we don't need in a browser where we'll only be reading messages. The following
is superfluous:

- NDJSON encoding (we don't encode)
- Binary encoding (we don't use binary, and we don't encode)
- Binary decoding (we don't use binary)

All we need is the ability to decode NDJSON into objects that conform to the `messagesLight` TypeScript types, i.e.
`IEnvelope` and its nested members.

It turns out that `JSON.parse` will almost produce objects that conform to the TypeScript types.
The only exception is enum fields. They are represented as strings in JSON and must be converted back to an ordinal number.
Binary fields would have been an exception too, but we're not using them!

The `messagesLight.ts` code is auto-generated from `messages.d.ts` by removing all the classes we don't need.

The `messagesLightReviver.ts` code is hand-written, and must be updated whenever we add or modify an enum. It
would be possible to auto-generate this file too (using a `proto-parser` library), if it becomes hard to maintain.
