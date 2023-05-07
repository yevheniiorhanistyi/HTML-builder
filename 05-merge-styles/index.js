const { join, extname } = require('node:path');
const { readdir } = require('node:fs/promises');
const { createWriteStream, createReadStream } = require('fs');

const stylesPath = join(__dirname, "styles");
const boundlePath = join(__dirname, "project-dist", "bundle.css");
const options = { withFileTypes: true };

const writeStream = createWriteStream(boundlePath);

async function mergeStyles() {

    try {
        const files = await readdir(stylesPath, options);

        for (const file of files) {
            const filePath = join(stylesPath, file.name);
            const fileExtname = extname(file.name).replace(".", "");

            if (file.isFile() && fileExtname === 'css') {
                const readStream = createReadStream(filePath);
                readStream.on('data', data => writeStream.write(data));
            }
        }
    } catch (err) {
        console.error(err);
    }
}

mergeStyles();