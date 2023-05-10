const path = require('path');
const { stdin, stdout } = process;
const { createWriteStream } = require('fs');
const { createInterface } = require('readline');

const rl = createInterface({
    input: stdin,
    output: stdout
});

const writeStream = createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

console.log('Welcome! Please enter some text:');

rl.on('line', (input) => {
    if (input.toLowerCase() === 'exit' || input === '\u0003') {
        console.log('Goodbye!');
        process.exit();
    } else {
        writeStream.write(`${input}\n`);
    }
});

rl.on('SIGINT', () => {
    console.log('Goodbye!');
    process.exit();
});