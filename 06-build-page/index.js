/*
Создаёт папку project-dist.
Заменяет шаблонные теги в файле template.html с названиями файлов из папки components (пример:{{section}}) на содержимое одноимённых компонентов и сохраняет результат в project-dist/index.html.
Собирает в единый файл стили из папки styles и помещает их в файл project-dist/style.css.
Копирует папку assets в project-dist/assets
*/

const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const projectDist = path.join(__dirname, 'project-dist');
async () => await fsPromises.rm(projectDist, {force: true, recursive: true});
async () => await fsPromises.mkdir(projectDist, {recursive : true});

// Копирование assets
const assets = path.join(__dirname, './assets');
const assetsCopy = path.join(projectDist, './assets');

copyFiles(assets, assetsCopy);

// Сбор styles в единый style
const styles = path.join(__dirname, './styles');
const bundle = path.join(projectDist, './style.css');

uniteStyles(styles, bundle)

// Запись в новый html + сбор компонентов
const htmlFrom = path.join(__dirname, './template.html');
const htmlDest = path.join(projectDist, './index.html');
copyHtml(htmlFrom, htmlDest);

// ---------------------------------------------
async function copyHtml(from, dest) {
    const templatesPath = path.join(__dirname, './components');

    // получаем шаблоны и содержимое html
    const templates = await getTemplates(templatesPath);
    let indexData = await fsPromises.readFile(from, encodig='utf-8');

    for (let i in templates) {
        indexData = indexData.replace('{{' + i + '}}', templates[i]);
    }

    fs.writeFile(dest, indexData, {encoding: 'utf-8'}, (err) => {if (err) throw err});
}

async function getTemplates(from) {
    const templates = {};
    const files = await fsPromises.readdir(from, {withFileTypes: true});
    
    for (const file of files) {   
        const filePath = path.join(from, file.name);
        
        // Оставляем только html файлы
        const obj = path.parse(filePath)
        if (obj.ext != '.html') continue;
        
        const data = await fsPromises.readFile(filePath, encodig='utf-8');
        const name = file.name.split('.')[0];

        templates[name] = data;
    }
    return templates;
}

async function copyFiles(from, dest) {
    await fsPromises.rm(dest, {force: true, recursive: true});
    await fsPromises.mkdir(dest, {recursive : true});
    const files = await fsPromises.readdir(from, {withFileTypes: true});
    for (const file of files) {        
        const filePathFrom = path.join(from, file.name);        
        const filePathDest = path.join(dest, file.name);

        if (!file.isFile()) { 
            copyFiles(filePathFrom, filePathDest);
            continue;
        };

        fsPromises.copyFile(filePathFrom, filePathDest);
    }
}

async function uniteStyles(from, dest) {
    const bundle = fs.createWriteStream(dest, {flags: 'w'});
    const files = await fsPromises.readdir(from, {withFileTypes: true});
    
    for (const file of files) {
        if (!file.isFile()) continue;
        
        const filePath = path.join(from, file.name);
        const obj = path.parse(filePath)

        if (obj.ext != '.css') continue;

        const readable = fs.createReadStream(filePath, encodig='utf-8');

        // запись сразу прочитываемых данных в стрим записи, без загрузки в память
        readable.pipe(bundle);
    }
}