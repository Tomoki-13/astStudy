import  * as parser from "@babel/parser";
import { promises as fsPromises } from "fs";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

(async () => {
	try {
		const searchWord: string  = process.argv[2];
		const filePath:string = '../codesample/samplecode.js';
		const fileContent: string = await fsPromises.readFile(filePath, "utf8");

		const commonJsResult = babel.transformSync(fileContent, {
			presets: [["@babel/preset-env", { modules: "commonjs" }]],
			plugins: ["@babel/plugin-transform-typescript"],
			sourceType: "unambiguous",
		});
		if (commonJsResult !== null && commonJsResult.code !== null && commonJsResult.code !== undefined) {
			console.log(commonJsResult.code);
			const parsed = parser.parse(commonJsResult.code, {
				sourceType: "unambiguous", 
				plugins: ["typescript"]
			});
			const codes: string[] = [];

			traverse(parsed, {
				VariableDeclaration(path: any) {
					const node = path.node;
					for (const declaration of node.declarations) {
						if (declaration.id.type === 'Identifier' && declaration.id.name.includes(searchWord)) {
						const code = fileContent.substring(node.start, node.end);
						codes.push(code);
						}
					}
				},
				CallExpression(path: any) {
                    const node = path.node;
                    //関数の呼び出しを見つける
                    if (node.callee.type === 'Identifier' && node.callee.name.includes(searchWord)) {
                        //UUID関数の呼び出しを見つけたら、そのノードを文字列に変換して保存
                        const code: string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    } else if(node.callee.type === 'MemberExpression'&&node.callee.object.type === 'Identifier'&& node.callee.object.name.includes(searchWord)){
                        const code: string = fileContent.substring(node.start, node.end);
                        codes.push(code);
                    }
                }
			});

			console.log(codes);
		} else {
			console.error("Babel変換に失敗");
		}
	} catch (error) {
		console.error("エラーが発生しました:", error);
	} 
})();