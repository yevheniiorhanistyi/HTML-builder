const { stat } = require('fs');
const { readdir } = require('fs/promises');
const { join, extname } = require('node:path');

const dirPath = join(__dirname, "secret-folder");
const options = { withFileTypes: true };

async function logFile() {

    try {
        const files = await readdir(dirPath, options);

        for (const file of files) {
            if (!file.isDirectory()) {
                const filePath = join(dirPath, file.name);
                stat(filePath, (err, stats) => {
                    if (err) throw err;
                    console.log(`${file.name} - ${extname(file.name).replace(".", "")} - ${Number(stats.size / 1024).toFixed(2)}kb`);
                });
            }
        }

    } catch (err) {
        console.error(err);
    }
}

logFile();
