import * as parser from '@babel/parser';
import { promises as fsPromises } from 'fs';
import traverse from "@babel/traverse";

(async () => {
    let codes:string[] = [];
    try {
        const libName: string  = process.argv[2];
        //ファイルの内容を取得
        const filePath:string = './acornAstSample.js';
        if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
            const fileContent: string = await fsPromises.readFile(filePath, 'utf8');
            const parsed = parser.parse(fileContent, {sourceType: 'script', plugins: ["typescript"] });
            traverse(parsed, {
                VariableDeclaration(path: any) {
                    const node = path.node;
                    for (const declaration of node.declarations) {
                        if (declaration.id.type === 'Identifier' && declaration.id.name.includes(libName)) {
                            const code = fileContent.substring(node.start, node.end);
                            codes.push(code);
                        }
                    }
                },
                CallExpression(path: any) {
                    const node = path.node;
                    //関数の呼び出しを見つける
                    if (node.callee.type === 'Identifier' && node.callee.name.includes(libName)) {
                        //UUID関数の呼び出しを見つけたら、そのノードを文字列に変換して保存
                        const code: string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    } else if (node.callee.type === 'MemberExpression') {
                        if (node.callee.object && node.callee.object.type === 'Identifier' && node.callee.object.name.includes(libName)) {
                            const code: string = fileContent.substring(node.start, node.end);
                            codes.push(code);
                        }
                    }
                }
            });
        }
        if(codes.length > 0){
            console.log(codes);
        }
    } catch (error) {
        console.log(`Failed to create AST for file`);
        console.error("Error:", error);
    }
})();