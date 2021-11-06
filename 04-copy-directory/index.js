// Данные должны быть выведены в формате <имя файла>-<расширение файла>-<вес файла>. Пример: example - txt - 128.369kb
const fsPromises = require('fs/promises')
const path = require('path')

const files = path.join(__dirname, './files');
const filesCopy = path.join(__dirname, './files-copy');

copyFiles(files, filesCopy);

// ------------------------
async function copyFiles(from, dest) {
    // если директория уже существует, то удаляем её
    await fsPromises.rm(dest, {force: true, recursive: true});
    await fsPromises.mkdir(dest, {recursive : true});
    const files = await fsPromises.readdir(from, {withFileTypes: true});
    
    for (const file of files) {
        if (!file.isFile()) continue;
        
        const filePathFrom = path.join(from, file.name);        
        const filePathDest = path.join(dest, file.name);

        fsPromises.copyFile(filePathFrom, filePathDest);
    }
}
