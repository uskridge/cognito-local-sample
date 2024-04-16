# bts-backend-sample

Docker で AWS CLI 環境を作り、Cognito をエミュレートできる moto を使って、同じくDocker上で動くNestのバックエンドでローカルで認証が試せる環境を構築するサンプルです。
バックエンドは yarn workspaces を使ったモノレポとする想定です。


# 起動

```shell
% docker-compose up
```

# 動作確認

- Cognito
  http://localhost:9099/

- API
  http://localhost:3000/api/
  - 認証NGの場合：`{"message":"Unauthorized","statusCode":401}`
  - 認証OKの場合：`Hello World!`