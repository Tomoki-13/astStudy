import * as parser from '@babel/parser';
import { promises as fsPromises } from 'fs';
import traverse from "@babel/traverse";

(async () => {
    let codes:string[] = [];
    try {
        const searchWord: string  = process.argv[2];
        //ファイルの内容を取得
        const filePath:string = './codesample/samplecode.js';
        if (filePath.endsWith('.js') || filePath.endsWith('.ts')) {
            const fileContent: string = await fsPromises.readFile(filePath, 'utf8');
            // unambiguous：ファイルがES/CommonJSモジュールなのかを自動判別
            // pluginsを増やせば，対応するファイルを増やせます
            const parsed = parser.parse(fileContent, {sourceType: 'unambiguous', plugins: ["typescript"] });
            traverse(parsed, {
                VariableDeclaration(path: any) {//importやrequire等の呼び出しを見たい場合
                    const node = path.node;
                    for (const declaration of node.declarations) {
                        if (declaration.id.type === 'Identifier' && declaration.id.name.includes(searchWord)) {
                            const code = fileContent.substring(node.start, node.end);
                            codes.push(code);
                        }
                    }
                },
                CallExpression(path: any) {//関数を見たい場合
                    const node = path.node;
                    if (node.callee.type === 'Identifier' && node.callee.name.includes(searchWord)) {
                        const code: string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    } else if(node.callee.type === 'MemberExpression'&&node.callee.object.type === 'Identifier'&& node.callee.object.name.includes(searchWord)){
                        const code: string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    }
                },
                // 関数宣言: function foo() {...}
                FunctionDeclaration(path) {
                },

                // アロー関数式: const foo = () => {...}
                ArrowFunctionExpression(path) {
                },
                // import 文: import foo from 'bar';
                ImportDeclaration(path) {
                },
                // export 文: export const foo = ...;
                ExportNamedDeclaration(path) {
                    // node.declaration に VariableDeclaration などが入る
                },

                // モジュールエクスポート: module.exports = ...;
                AssignmentExpression(path) {
                },
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