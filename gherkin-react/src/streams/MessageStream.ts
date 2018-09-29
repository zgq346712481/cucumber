import {io} from "cucumber-messages"
import * as protobuf from "protobufjs"
import {Readable} from "stream"
import Wrapper = io.cucumber.messages.Wrapper;

/**
 * This stream reads cucumber messages from a memory buffer
 * (Uint8Array). This typically originates from a WebSocket,
 * or base64-encoded messages, embedded in an HTML document.
 */
export default class MessageStream extends Readable {
    private reader: protobuf.Reader | protobuf.BufferReader
    private count: number;

    constructor(data: Uint8Array) {
        super({objectMode: true})
        console.log("new MessageStream")
        if (!data) {
            throw new Error("No data")
        }
        this.reader = protobuf.Reader.create(data)
        this.count = 0
    }

    public _read() {
        try {
            console.log("Decoding...")
            const wrapper = Wrapper.decodeDelimited(this.reader)
            console.log(`Decoded ${++this.count}`, JSON.stringify(wrapper.toJSON()))
            this.push(wrapper)
        } catch (err) {
            console.log("READ ERROR", err)
            if (err instanceof RangeError) {
                this.push(null)
            } else {
                this.emit("error", err)
            }
        }
    }
}
