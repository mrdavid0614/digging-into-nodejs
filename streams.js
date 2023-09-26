const decoder = new TextDecoder();
const encoder = new TextEncoder();

const readable = new ReadableStream({
    start(controller) {
        const text = "Stream me!";
        const encodedText = encoder.encode(text);
        controller.enqueue(encodedText);
        controller.close();
    }
});

const transform = new TransformStream({
    transform(chunk, controller) {
        const decodedText = decoder.decode(chunk);
        controller.enqueue(encoder.encode(decodedText.toUpperCase()));
    }
})

const writable = new WritableStream({
    write(chunk) {
        console.log({ chunk, decodedText: decoder.decode(chunk) })
    }
});

const writer = writable.getWriter();

// If we enqueue the readable with certain data type at start, when writing to a writable stream
// which is being piped with the readable, it should receive as param data with the same data type.
// For example: if we start the readable enqueueing an arraybuffer and then we try to write to the writable something like a string
// it will throw an error because it is waiting an arraybuffer instead of a string.
writer.write(encoder.encode("Writing..."));

writer.releaseLock();

readable.pipeThrough(transform).pipeTo(writable);

// -------------------

const readable2 = new ReadableStream({
    start(controller) {
        controller.enqueue("Testing stream");
        controller.enqueue("Testing stream 2");
        controller.enqueue("Testing stream 3");
        controller.enqueue("Testing stream 4");
    }
});

const writable2 = new WritableStream({
    write(chunk) {
        console.log({ chunk });
    }
})

const writer2 = writable2.getWriter();

writer2.write("Testing without encoder in readable");

writer2.releaseLock();

readable2.pipeTo(writable2);