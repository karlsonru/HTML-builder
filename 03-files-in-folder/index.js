// Данные должны быть выведены в формате <имя файла>-<расширение файла>-<вес файла>. Пример: example - txt - 128.369kb
const fsPromises = require('fs/promises');
const path = require('path')

const secretFolder = path.join(__dirname, './secret-folder');

readDir(secretFolder);

// ------------
async function readDir(folder) {
    const files = await fsPromises.readdir(folder, {withFileTypes: true});
    for (const file of files) {
        if (!file.isFile()) continue;
        
        const filePath = path.join(folder, file.name);        
        const obj = path.parse(filePath)
        const stat = await fsPromises.stat(filePath, function(err, stat) {
            if (err) throw err;
            return stat; 
        })

        const sizeKb = (stat.size / 1024).toFixed(3);

        console.log(`${obj.name} - ${obj.ext.replace('.', '')} - ${sizeKb}kb`)
    }
}