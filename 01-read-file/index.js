const path = require('path');
const { createReadStream } = require('fs');

const readStream = createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');

readStream.on('data', data => console.log(data))
readStream.on('error', error => console.log(error.message))