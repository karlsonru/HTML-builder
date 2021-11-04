const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require("readline");

console.log('Добро пожаловать! Для выхода нажмите ctrl+c или введите exit')

let filePath = path.join(__dirname, './text.txt')
let stream = fs.createWriteStream(filePath);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
 });
 
rl.on('line', (input) => {
    if (input.trim().toLowerCase() == 'exit') {
        rl.close();
        return
    }
    stream.write(input + '\n');
});

rl.on('close', () => {
    console.log('Всего хорошего!');
    rl.close();
})