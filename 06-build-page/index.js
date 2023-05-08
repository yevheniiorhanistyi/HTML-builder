const { join, extname, basename } = require('node:path');
const { rm, copyFile, mkdir, readdir, readFile, writeFile } = require('node:fs/promises');

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
        styles: join(buildFolder, 'style.css'),
        HTML: join(buildFolder, 'index.html')
    }
}

async function copyDirectory(srcPath, buildPath) {
    try {
        await mkdir(buildPath, { recursive: true });
        const entries = await readdir(srcPath, { withFileTypes: true });
        for (const entry of entries) {
            const srcEntryPath = join(srcPath, entry.name);
            const buildEntryPath = join(buildPath, entry.name);
            if (entry.isDirectory()) {
                await copyDirectory(srcEntryPath, buildEntryPath);
            } else if (entry.isFile()) {
                await copyFile(srcEntryPath, buildEntryPath);
            }
        }
    } catch (err) {
        console.error(err);
    }
}

async function mergeStyles(srcPath, buildPath) {
    try {
        const files = await readdir(srcPath, { withFileTypes: true, recursive: true, encoding: "utf8" });
        const cssFiles = files.filter(file => extname(file.name).replace(".", "") === 'css' && file.isFile());
        const cssContents = await Promise.all(cssFiles.map(async file => await readFile(join(srcPath, file.name), "utf-8")));
        await writeFile(buildPath, cssContents.join('\n'));
    } catch (err) {
        console.error(err);
    }
}

async function buildHTML(src, build, data) {
    try {
        const [template, components] = await Promise.all([readFile(src), readdir(data)]);
        let html = template.toString();

        for (const component of components) {
            const componentPath = join(data, component);
            const componentExt = extname(componentPath);
            const componentName = basename(componentPath, componentExt);
            const componentData = await readFile(componentPath);
            const componentDataStr = componentData.toString();
            html = html.replace(`{{${componentName}}}`, componentDataStr);
        }

        await writeFile(build, html);
    } catch (err) {
        console.error(err);
    }
}


async function buildPage() {
    await rm(buildFolder, { force: true, recursive: true });
    await mkdir(buildFolder, { recursive: true });

    await copyDirectory(path.src.assets, path.build.assets);
    await mergeStyles(path.src.styles, path.build.styles);
    await buildHTML(path.src.template, path.build.HTML, path.src.components);
}

buildPage();