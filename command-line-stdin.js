#! /usr/bin/env node

"use strict";

import path from "path";
import * as fs from "fs";
import getStdin from "get-stdin";
import minimist from "minimist";

const args = minimist(process.argv.slice(2), {
    boolean: ["help", "in"],
    string: ["file"]
})

if (args.help) {
    printHelp();
}
else if (args.in || args._.includes("-")) {
    getStdin().then(processFile).catch(error)
}
else if (args.file) {
    fs.readFile(path.resolve(args.file), (err, contents) => {
        if (err) {
            error(err.toString())
        }
        else {
            processFile(contents);
        }
    });
    
}
else {
    error('Error', true);
}

function processFile(contents) {
    contents = contents.toString().toUpperCase();
    process.stdout.write(contents)
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