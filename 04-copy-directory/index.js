const { rm, copyFile, mkdir, readdir } = require('node:fs/promises');
const { join } = require('node:path');

const srcFolder = join(__dirname, "files");
const destFolder = join(__dirname, "files-copy");

  rm(destFolder, {
    recursive: true,
    force: true,
  }).finally( async function copyDirectory() {
    try {
      await mkdir(destFolder, { recursive: true })
      const files = await readdir(srcFolder);

      for (const file of files) {
          const filePath = join(srcFolder, file);
          await copyFile(filePath, join(destFolder, `${file}`));
      }
    } catch (err) {
      console.error(err.message);
    }
  });