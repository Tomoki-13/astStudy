const acorn = require('acorn');
import fsPromises from 'fs';
const { simple } = require('acorn-walk');

(async () => {
    try {
        const filePath = '../sample/samplecode.js';
        

        //別のファイルを読み込み、その内容を取得
        const fileContent= await fsPromises.readFile(filePath, 'utf8');

        //ASTを生成
        const parsed = acorn.parse(fileContent, { ecmaVersion: 2020 });
        console.log(parsed);

        simple(parsed, {
            enter(node) {
                console.log(node);
            }
        });
    } catch (err) {
        console.error("Error:", err);
    }
})();