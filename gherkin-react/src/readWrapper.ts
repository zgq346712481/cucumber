import {io} from "cucumber-messages";
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

export default function readWrapper(data: string | Uint8Array): IWrapper {
    const array: Uint8Array = typeof data === 'string' ? convertDataURIToBinary(data) : data;
    return Wrapper.decodeDelimited(array)
}
