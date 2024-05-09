import { promises as fsPromises } from 'fs';
import acorn from 'acorn';
import { simple } from 'acorn-walk';
// ファイルのパス

(async () => {
    try {
        const filePath:string = './acornAstSample.ts';
        const fileContent:string = await fsPromises.readFile(filePath, 'utf8');
        //別のファイルのASTを生成 タイプスクリプトのAST作成には，追加作業必要
        const parsed = acorn.parse(fileContent, { ecmaVersion: 2020 ,sourceType: 'module'});
        const codes:string[] = [];
        console.log(parsed);
        //simple(node, visitors, base, state) astの探索
        simple(parsed, {
            VariableDeclaration(node) {
                for (const declaration of node.declarations) {
                    if (declaration.id.type === 'Identifier' && declaration.id.name.includes('acorn')){
                        //該当のコードの部分を取る
                        const code:string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    }
                }
            },
            CallExpression(node) {
                //関数の呼び出しを見つける
                if (node.callee.type === 'Identifier' && node.callee.name.includes('acorn')) {
                    console.log(node);
                    const code:string = fileContent.substring(node.start, node.end);
                    codes.push(code);
                }
            }
        });
        codes.forEach(code => {
            console.log(code);
        });
    } catch (err) {
        console.error("Error:", err);
    }
})();