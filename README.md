# hello-server

`/api/hello` にアクセスすると、メッセージと現在時刻を JSON で返すだけの小さな HTTP サーバー。
TypeScript と Node.js 標準の `node:http` だけで書いている。

[yoshito.me の解説スライド「Git からサーバー公開まで」](https://yoshito.me/learn/) の
[TypeScript 入門](https://yoshito.me/learn/typescript/) で作り、
[TypeScript をサーバーで動かす](https://yoshito.me/learn/deploy/) で AWS EC2 に公開する練習用。

## 動かし方

```sh
npm install
npm run build          # src/server.ts → dist/server.js
PORT=3000 npm start    # listening on http://localhost:3000

# 別のターミナルで
curl localhost:3000/api/hello
# {"text":"Hello from TypeScript!","time":"..."}
```

待ち受けるポートは環境変数 `PORT` で変えられる（既定は 3000）。

## EC2 に公開する

手順は [docs/aws-deploy.md](docs/aws-deploy.md)。
