export default function (binaryString: string): Uint8Array {
    const rawLength = binaryString.length
    const array = new Uint8Array(new ArrayBuffer(rawLength))
    for (let i = 0; i < rawLength; i++) {
        array[i] = binaryString.charCodeAt(i)
    }
    return array
}
