import {io} from "cucumber-messages";
import * as protobuf from "protobufjs";
import IWrapper = io.cucumber.messages.IWrapper;
import Wrapper = io.cucumber.messages.Wrapper;

function convertDataURIToBinary(base64: string): Uint8Array {
    const raw = window.atob(base64);
    const rawLength = raw.length;
    const array = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
    }
    return array;
}

export default function eachWrapper(data: string | Uint8Array, fn: (wrapper: IWrapper) => void) {
    const array: Uint8Array = typeof data === 'string' ? convertDataURIToBinary(data) : data;
    const reader = protobuf.Reader.create(array)
    while (true) {
        try {
            const wrapper = Wrapper.decodeDelimited(reader)
            fn(wrapper)
        } catch (eof) {
            break
        }
    }
}
