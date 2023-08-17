#! /usr/bin/env node

"use strict";

const path = require("path");
const fs = require("fs");
const args = require("minimist")(process.argv.slice(2), {
    boolean: ["help"],
    string: ["file"]
})

if (args.help) {
    printHelp();
}
else if (args.file) {
    // processFileSync(path.resolve(args.file))
    processFile(path.resolve(args.file))
}
else {
    error(msg, true);
}

function processFileSync(filepath) {
    const contents = fs.readFileSync(filepath);

    // fs.readFileSync return a buffer with the file content, but if we pass "utf-8" as second param, it converts the buffer content to the actual text content.
    // const contents = fs.readFileSync(filepath, "utf-8");

    // printing the buffer returned by fs.readFileSync with console.log will output a stringified buffer with the file content.
    // console.log(contents);

    // printing the buffer returned by fs.readFileSync with process.stdout.write will output the actual text content as it convert the buffer content to utf-8 text by default.
    // process.stdout.write(contents)

    process.stdout.write(contents)
}

function processFile(filepath) {
    fs.readFile(filepath, (err, contents) => {
        if (err) {
            error(err.toString())
        }
        else {
            contents = contents.toString().toUpperCase();
            process.stdout.write(contents)
        }
    });
}

function error(msg, includeHelp = false) {
    console.error(msg);

    if (includeHelp) {
        printHelp();
    }
}

function printHelp() {
    console.log("command-line usage:")
    console.log("   command-line.js --file={FILENAME}");
    console.log("   command-line.js --help");
    console.log("");
    console.log("--file={FILENAME}      Process the file");
    console.log("--help                 Print script help");
}