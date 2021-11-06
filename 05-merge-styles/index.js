const fs = require('fs')
const fsPromises = require('fs/promises')
const path = require('path')

const styles = path.join(__dirname, './styles');
const bundle = path.join(__dirname, './project-dist/bundle.css');

uniteStyles(styles, bundle);

// ----------------------
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