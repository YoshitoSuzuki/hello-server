# AWS EC2 に公開する手順

講義 [TypeScript をサーバーで動かす](https://yoshito.me/learn/deploy/) をなぞって公開するときのチェックリスト。
詳しい説明は講義ノートのほうにある。EC2 の借り方は [クラウドの VM](https://yoshito.me/learn/cloud-vm/)。

```
ブラウザ → DNS → セキュリティグループ(22/80/443) → nginx(80/443) → node(127.0.0.1:3000) → dist/server.js
```

## 1. EC2 を用意する

- Ubuntu Server LTS / t3.micro など無料枠の範囲
- セキュリティグループは 22（自分の IP だけ）・80・443。**3000 は開けない**
- 鍵（.pem）をダウンロードして `chmod 400`

## 2. アプリを置いて手で動かす

```sh
ssh -i ~/.ssh/<鍵>.pem ubuntu@<EC2のIP>
sudo apt update && sudo apt upgrade -y
# Node.js（LTS）を入れる。入れ方は講義ノートの 2 章
git clone https://github.com/YoshitoSuzuki/hello-server.git
cd hello-server
npm ci
npm run build
PORT=3000 npm start
# 別の SSH から: curl http://localhost:3000/api/hello
```

## 3. systemd でサービスにする

`/etc/systemd/system/hello-server.service`

```ini
[Unit]
Description=hello-server (Node.js)
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/hello-server
Environment=PORT=3000
Environment=NODE_ENV=production
ExecStart=/usr/bin/node /home/ubuntu/hello-server/dist/server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

```sh
sudo systemctl daemon-reload
sudo systemctl enable --now hello-server
systemctl status hello-server
journalctl -u hello-server -f
```

node のパスは `which node` で確かめる。

## 4. nginx と HTTPS

- nginx をリバースプロキシにして `proxy_pass http://127.0.0.1:3000;`
- ドメインの A レコードを EC2 の IP（Elastic IP にしておくと再起動で変わらない）に向ける
- `sudo certbot --nginx -d <ドメイン>` で HTTPS にする

## 5. 更新するとき

```sh
cd ~/hello-server
git pull
npm ci
npm run build
sudo systemctl restart hello-server
```

## 片付け

練習が終わったら、EC2 インスタンスの終了と **Elastic IP の解放** を忘れない。
使っていない Elastic IP は課金される。
