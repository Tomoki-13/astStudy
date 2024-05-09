import  * as parser from "@babel/parser";
import { promises as fsPromises } from "fs";
import * as babel from "@babel/core";
import traverse from "@babel/traverse";

(async () => {
	try {
		const libName: string  = process.argv[2];
		const filePath:string = './acornAstSample.ts';
		const fileContent: string = await fsPromises.readFile(filePath, "utf8");

		const commonJsResult = babel.transformSync(fileContent, {
			presets: [["@babel/preset-env", { modules: "commonjs" }]],
			plugins: ["@babel/plugin-transform-typescript"],
			sourceType: "unambiguous",
		});
		if (commonJsResult !== null && commonJsResult.code !== null && commonJsResult.code !== undefined) {
			console.log(commonJsResult.code);
			const parsed = parser.parse(commonJsResult.code, {
				sourceType: "script", 
			});
			const codes: string[] = [];

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
					if (node.callee.type === 'Identifier' && node.callee.name === libName) {
						const code: string = fileContent.substring(node.start, node.end);
						codes.push(code);
					} else if (node.callee.type === 'MemberExpression') {
						if (node.callee.object && node.callee.object.type === 'Identifier' && node.callee.object.name === libName) {
						const code: string = fileContent.substring(node.start, node.end);
						codes.push(code);
						}
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