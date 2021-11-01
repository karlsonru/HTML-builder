const fs = require('fs');
const path = require('path');

const address = path.join(__dirname, './text.txt');

const readable = fs.createReadStream(address, encodig='utf-8');

readable.on('readable', () => {
    let text = readable.read();
    if (text != null) console.log(text);
});