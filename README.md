## aststudy
## 使用方法
### 準備
```bash
    npm install
```
### acornAstSample.tsの実行：acornを用いたコード抽出
```bash
    #acornの部分は，入力ファイルによって変えてください
    ts-node acornAstSample.ts acorn
```
### babelAstSample.tsの実行：babelを用いたコード抽出
```bash
    ts-node babelAstSample.ts acorn
    ts-node babelAstSample.ts fs
```
### reg.tsの実行：正規表現でコードを取得する例
```bash
    ts-node reg.ts acorn
```
### outputAst(babel).ts：ASTの構造を見る用
```bash
    ts-node reg.ts acorn
```

### 入力ファイルのパスを変更して，　いろいろ試してみてください