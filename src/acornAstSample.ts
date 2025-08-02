import { promises as fsPromises } from 'fs';
import acorn from 'acorn';
import { simple } from 'acorn-walk';

(async () => {
    try {
        const searchWord: string  = process.argv[2];
        const filePath:string = './codesample/samplecode.js';
        const fileContent:string = await fsPromises.readFile(filePath, 'utf8');
        //別のファイルのASTを生成 タイプスクリプトのAST作成には，追加作業必要
        const parsed = acorn.parse(fileContent, { ecmaVersion: 2020 ,sourceType: 'module'});
        const codes:string[] = [];
        
        //astを見たい場合
        //console.log(parsed);

        //simple(node, visitors, base, state) astの探索
        simple(parsed, {
            VariableDeclaration(node) {
                for (const declaration of node.declarations) {
                    if (declaration.id.type === 'Identifier' && declaration.id.name.includes(searchWord)){
                        //該当のコードの部分を取る
                        const code:string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    }
                }
            },
            CallExpression(node) {
                if (node.callee.type === 'Identifier' && node.callee.name.includes(searchWord)) {
                    const code: string = fileContent.substring(node.start, node.end);
                    codes.push(code);
                }else if(node.callee.type === 'MemberExpression'&&node.callee.object.type === 'Identifier'&& node.callee.object.name.includes('acorn')){
                    const code: string = fileContent.substring(node.start, node.end);
                    codes.push(code);
                }
            }
        });
        console.log(codes);
    } catch (err) {
        console.error("Error:", err);
    }
})();