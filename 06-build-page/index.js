const { join, extname, basename } = require('node:path');
const { rm, copyFile, mkdir, readdir, readFile, writeFile} = require('node:fs/promises');

const buildFolder = join(__dirname, 'project-dist');

const path = {
    src: {
        assets: join(__dirname, 'assets'),
        styles: join(__dirname, 'styles'),
        template: join(__dirname, 'template.html'),
        components: join(__dirname, 'components')
    },
    build: {
        assets: join(buildFolder, 'assets'),
        styles: join(buildFolder, 'style.css')
    }
}

async function copyDirectory(srcPath, buildPath) {
  await mkdir(buildPath, { recursive: true });
  await readdir(srcPath, { withFileTypes: true, recursive: true}) 
  .then ( dir => {
    dir.forEach(async folder => {
    await mkdir(join(buildPath, folder.name), { recursive: true });
    const file = await readdir(join(srcPath, folder.name), { withFileTypes: true, recursive: true});
    file.forEach(item => {
      copyFile( join(srcPath, folder.name, item.name), join(buildPath, folder.name, item.name));
    });
   });
  });
};

async function mergeStyles (srcPath, buildPath) {
 await readdir(srcPath, { withFileTypes: true, recursive: true, encodnig: "utf8" })
  .then((data) => data.filter(file => extname(file.name).replace(".", "") === 'css' && file.isFile()))
  .then( (files) => Promise.all(files.map(async file => await readFile(join(srcPath, file.name), "utf-8"))))
  .then(async (bundle) => { await writeFile(buildPath, bundle.join('\n')) })
  .catch(error => console.log(error.message))
}

async function bundleHTML() {
  await readdir(path.src.components, { withFileTypes: true, recursive: true, encoding: "utf-8"})
  .then( async (data) => {
    let tempFileRead = await readFile(path.src.template, "utf-8");
    const result = data.map(async file => {
      const patternExt = extname(file.name);
      if (patternExt === '.html' && file.isFile()) {
        const patternName = basename(file.name, extname(file.name))
        let patternRead = await readFile(join(path.src.components, file.name));
        tempFileRead = tempFileRead.replace(new RegExp('{{' + patternName + '}}','g'), patternRead);
      }
      return tempFileRead;
    })
    return Promise.all(result)
  })
  .then( async value => {
   await writeFile(join(__dirname, 'project-dist', 'index.html'), value.pop(), "utf-8")
  })
  .catch(error => console.log(error.message));
}

async function buildPage() {
  await rm(buildFolder, { force: true, recursive: true });
  await mkdir(buildFolder, { recursive: true });

  await copyDirectory(path.src.assets, path.build.assets);
  await mergeStyles(path.src.styles, path.build.styles);
  await bundleHTML()
}

buildPage()