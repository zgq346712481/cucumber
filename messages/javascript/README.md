# Cucumber Messages for JavaScript (Protocol Buffers)

## Lightweight NDJSON parser

The `pbjs` tool from `protobufjs` generates code for parsing and serialising messages to both binary protobuf and
NDJSON representation.

All this functionality has some overhead we don't need in a browser where we'll only be reading messages. The following
is superfluous:

- NDJSON encoding (we don't encode)
- Binary encoding (we don't use binary, and we don't encode)
- Binary decoding (we don't use binary)

All we need is the ability to decode NDJSON into objects that conform to the *read only* TypeScript types, i.e.
`IEnvelope` and its nested members.

It turns out that `JSON.parse` of each line will almost produce objects that conform to the TypeScript types.
The only exception is enum fields. They are represented as strings in JSON and must be converted back to an ordinal number.
Binary fields would have been an exception too, but we're not using them!

So to convert objects properly we just need to do:

```typescript
import { messages, envelopeReviver } from '@cucumber/messages'

const envelope: messages.IEnvelope = JSON.parse(json, envelopeReviver)
```

The `envelopeReviver` function is just a few lines of (generated) code.

When we use that we don't need 800k of generated JavaScript and another 300k of the
`protobufjs` runtime.
