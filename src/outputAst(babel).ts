import { promises as fsPromises } from 'fs';
const parser = require("@babel/parser");
import path from 'path';
import fs from 'fs';

const createOutputDirectory = (dirPath: string): void => {
    if(!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const getUniqueOutputPath = (baseDir: string, baseName: string): string => {
    let outputPath = path.join(baseDir, `${baseName}.json`);
    if(fs.existsSync(outputPath)) {
        const now = new Date();
        const date = formatDateTime(now);
        outputPath = path.join(baseDir, `${baseName}_${date}.json`);
    }
    return outputPath;
};


function formatDateTime(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
}

(async () => {
    const filePath = './codesample/samplecode.js';
    const fileContent: string = await fsPromises.readFile(filePath, 'utf8');
    const parsed = parser.parse(fileContent, { sourceType: 'unambiguous', 
        plugins: [
            'typescript',
            'jsx',
            'decorators-legacy',
            'classProperties',
            'classPrivateProperties',
            'classPrivateMethods',
            'optionalChaining',
            'nullishCoalescingOperator'
        ]});
    const outputDirectory = path.resolve(__dirname, './output');
    createOutputDirectory(outputDirectory);
    fs.writeFileSync(getUniqueOutputPath(outputDirectory,'ast'), JSON.stringify(parsed,null,2));
})();
