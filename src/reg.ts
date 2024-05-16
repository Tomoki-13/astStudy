import { promises as fsPromises } from "fs";
(async () => {
	try {
		const searchWord: string  = process.argv[2];
        const filePath:string = '../codesample/samplecode.js';
        const fileContent: string = await fsPromises.readFile(filePath, 'utf8');
        //ファイルの内容を改行で区切る
		const lines = fileContent.split('\n');
        const searchLines:string[] = lines.filter(line => new RegExp(`${searchWord}`).test(line));
        console.log('検出したい文字列を含む行');
        console.log(searchLines);

	} catch (error) {
		console.error("エラーが発生しました:", error);
	} 
})();