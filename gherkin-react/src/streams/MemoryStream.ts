import {Readable} from "stream";
import {io} from "cucumber-messages";
import * as protobuf from "protobufjs";
import Wrapper = io.cucumber.messages.Wrapper;

/**
 * This stream reads cucumber messages from a memory buffer
 * (Uint8Array). This typically originates from a WebSocket,
 * or base64-encoded messages, embedded in an HTML document.
 */
export default class extends Readable {
    private _reader: protobuf.Reader | protobuf.BufferReader;

    constructor(array: Uint8Array) {
        super({objectMode: true})
        this._reader = protobuf.Reader.create(array)
    }

    _read() {
        try {
            const wrapper = Wrapper.decodeDelimited(this._reader)
            this.push(wrapper)
        } catch (err) {
            if(err instanceof RangeError) {
                this.push(null)
            } else {
                this.emit("error", err)
            }
        }
    }

}
