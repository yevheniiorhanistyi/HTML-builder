const { join } = require('node:path');
const { rm, copyFile, mkdir, readdir } = require('node:fs/promises');
const { createWriteStream, createReadStream } = require('fs');

const srcFolder = join(__dirname);
const destFolder = join(__dirname, "project-dist");
const options = { recursive: true, force: true };

const writeStream = createWriteStream(boundlePath);

function buildPage() {

    try {
        rm(destFolder, options).then(async () => {
            await mkdir(destFolder, { recursive: true }, (err) => { if (err) throw err; });
            copyDirectory(join(srcFolder, 'assets'), join(destFolder, 'assets'));
            mergeStyles()
        })
    } catch (err) {
        console.log(err);
    }
}

buildPage();

async function copyDirectory(srcPath, destPath) {
    
    try {
        await mkdir(destPath, { recursive: true });
        const files = await readdir(srcPath, { withFileTypes: true });

        for (const file of files) {
            if (file.isDirectory()) {
                copyDirectory(join(srcPath, file.name), join(destPath, file.name));
            } else {
                const filePath = join(srcPath, file.name);
                await copyFile(filePath, join(destPath, `${file.name}`));
            }
        }
    } catch (err) {
        console.error(err.message);
    }
}

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