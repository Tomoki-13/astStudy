import { promises as fsPromises } from "fs";
import * as babel from "@babel/core";

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
			console.log(commonJsResult);
			//console.log(commonJsResult.code);
		} else {
			console.error("Babel変換に失敗");
		}
	} catch (error) {
		console.error("エラーが発生しました:", error);
	} 
})();