# cognito-local-sample

Docker で AWS CLI 環境を作り、Cognito をエミュレートできる moto を使って、同じくDocker上で動くNestのバックエンドでローカルで認証が試せる環境を構築するサンプルです。
バックエンドは yarn workspaces を使ったモノレポとする想定です。


# 起動

```shell
% docker-compose up
```

起動すると、`User Pool ID` と `Client ID` が `/Containers/aws-cli/.aws/cognito.config.json` にできる（コンテナの起動毎に変わる）。

```/Containers/aws-cli/.aws/cognito.config.json
{
  "USER_POOL_ID" : "ap-northeast-1_12363360e1303b42ff0c6f320e6916236898b0a1",
  "CLIENT_ID" : "13531g7o6ezqu2byh7st43xo6q"
}
```

# 動作確認

- Cognito
  - http://localhost:9099/
  - http://localhost:9099/moto-api/

- API
  http://localhost:3000/api/
  - 認証NGの場合：`{"message":"Unauthorized","statusCode":401}`
  - 認証OKの場合：`Hello World!` （そして nest-cli のコンソールに色々表示されるはず）


## aws-cliのコンテナからcognitoコンテナ向けに aws cognito-idp admin-initiate-auth を実行する

ホストで

```shell:ホストで
% docker exec -it aws-cli bash
```

コンテナで

```shell:コンテナで
bash-4.2# sh /root/scripts/auth.sh 

{
    "AuthenticationResult": {
        "AccessToken": "eyJ0eXAiOiJKV1QiLCJraWQiOiJkdW1teSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfNTQxZTY1ZGJiZGFmNDUzNzkwMTU1OTI0ZWIxMTBiYmIiLCJzdWIiOiI3N2Q5MmE3Zi1iMDExLTQ4ODEtYjA4YS0xOTk2NmMzNjNmZGYiLCJjbGllbnRfaWQiOiJiN3Z6MnUzbzZqd3lrMTh5eHp3bW8zZjU3YiIsInRva2VuX3VzZSI6ImFjY2VzcyIsImF1dGhfdGltZSI6MTcxMzI0OTI4NSwiZXhwIjoxNzEzMjUyODg1LCJ1c2VybmFtZSI6ImJ0cy1kZXYtdXNlckBpcmlkZ2UuanAifQ.KTQqCHFYg8lLbBVkfmZJNR-kTBMagrbZ52CL4Y0nG9dNHw4c4oxsF5W_4uTvk_zRW3HRnpDkUvaoGQpWTAz6IdNH3PeU0KT3mqd9KUAhieR4hg7YlyFTUrMSmn7Cbs34h_pddK_ziOf9vQF2mfurG2LYI3iBEU8Jt1FLJcJTaUIz5IRlSpLaUVu7MeKdQzNVpcrYHLLuJobs8inkQAeAJiT3puueIMD1yOuL-jGD6892_jNUuFohlrczkM-q0VSSUFZ2iMYdPf6tgfUIZMWDrXieAyJXo6JRWzQY1f8RR5ua1Yoi8Pcxj8JV1pwFk4gGYjycbEW0zX35Knfq6f27Rg",
        "ExpiresIn": 3600,
        "TokenType": "Bearer",
        "RefreshToken": "50764e21-4419-4e5d-aa76-29496c03a2b7",
        "IdToken": "eyJ0eXAiOiJKV1QiLCJraWQiOiJkdW1teSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfNTQxZTY1ZGJiZGFmNDUzNzkwMTU1OTI0ZWIxMTBiYmIiLCJzdWIiOiI3N2Q5MmE3Zi1iMDExLTQ4ODEtYjA4YS0xOTk2NmMzNjNmZGYiLCJhdWQiOiJiN3Z6MnUzbzZqd3lrMTh5eHp3bW8zZjU3YiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEzMjQ5Mjg1LCJleHAiOjE3MTMyNTI4ODUsImNvZ25pdG86dXNlcm5hbWUiOiJidHMtZGV2LXVzZXJAaXJpZGdlLmpwIn0.Jj8lpO2R9pT40BH6OyCw_47Zg2xuhGD7q0UnN8sbuJYtWnFdIdIpVRlShbR9Q4yIPkiDp5VYA1bnA15rUbtYqOz3nggEIJJWaha0TFRt-DWpauLCEBdeJ4rJeoPTQCxCcyJKNygn99I6D4NG1SiFmhmxuZYgUqSuQ4xnxpNxs3jjI_6e09M9nzD1TnSOXdh9jP8pvtV6eGQwNHSJrWRNoD1daOLJLlasfWIjX6sH4ktzQ94xoXfFfRxPQTQdst3e7sItQOAN2qAogo3vApl5qVHCUsAEzqJTMnthtq-2e0pIfpllTNI5O8gBz3DLnMe-iAQmLO8RzvO4d_RjRU7_3Q"
    }
}
```

## aws-cliのコンテナから nestコンテナ向けに Bearer付きのリクエストを送る

```shell
bash-4.2# IdToken=eyJ0eXAiOiJKV1QiLCJraWQiOiJkdW1teSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLmFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb20vYXAtbm9ydGhlYXN0LTFfNTQxZTY1ZGJiZGFmNDUzNzkwMTU1OTI0ZWIxMTBiYmIiLCJzdWIiOiI3N2Q5MmE3Zi1iMDExLTQ4ODEtYjA4YS0xOTk2NmMzNjNmZGYiLCJhdWQiOiJiN3Z6MnUzbzZqd3lrMTh5eHp3bW8zZjU3YiIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzEzMjQ5Mjg1LCJleHAiOjE3MTMyNTI4ODUsImNvZ25pdG86dXNlcm5hbWUiOiJidHMtZGV2LXVzZXJAaXJpZGdlLmpwIn0.Jj8lpO2R9pT40BH6OyCw_47Zg2xuhGD7q0UnN8sbuJYtWnFdIdIpVRlShbR9Q4yIPkiDp5VYA1bnA15rUbtYqOz3nggEIJJWaha0TFRt-DWpauLCEBdeJ4rJeoPTQCxCcyJKNygn99I6D4NG1SiFmhmxuZYgUqSuQ4xnxpNxs3jjI_6e09M9nzD1TnSOXdh9jP8pvtV6eGQwNHSJrWRNoD1daOLJLlasfWIjX6sH4ktzQ94xoXfFfRxPQTQdst3e7sItQOAN2qAogo3vApl5qVHCUsAEzqJTMnthtq-2e0pIfpllTNI5O8gBz3DLnMe-iAQmLO8RzvO4d_RjRU7_3Q

bash-4.2# curl -H "Authorization: Bearer ${IdToken}" http://nest-cli:3000/api/
Hello World!
```

##  aws-cliのコンテナから motoserverコンテナ向けにpublicKeyの取得を行う

```shell
bash-4.2# curl http://cognito:9099/ap-northeast-1_805bc3e2ff2149b99524f71db3142f45/.well-known/jwks.json -H "Authorization: AWS4-HMAC-SHA256 Credential=mock_access_key/20220524/us-east-1/cognito-idp/aws4_request, SignedHeaders=content-length;content-type;host;x-amz-date, Signature=asdf"
{
  "keys": [
    {
      "alg": "RS256",
      "e": "AQAB",
      "kid": "dummy",
      "kty": "RSA",
      "n": "j1pT3xKbswmMySvCefmiD3mfDaRFpZ9Y3Jl4fF0hMaCRVAt_e0yR7BeueDfqmj_NhVSO0WB5ao5e8V-9RFQOtK8SrqKl3i01-CyWYPICwybaGKhbJJR0S_6cZ8n5kscF1MjpIlsJcCzm-yKgTc3Mxk6KtrLoNgRvMwGLeHUXPkhS9YHfDKRe864iMFOK4df69brIYEICG2VLduh0hXYa0i-J3drwm7vxNdX7pVpCDu34qJtYoWq6CXt3Tzfi3YfWp8cFjGNbaDa3WnCd2IXpp0TFsFS-cEsw5rJjSl5OllJGeZKBtLeyVTy9PYwnk7MW43WSYeYstbk9NluX4H8Iuw",
      "use": "sig"
    }
  ]
}
```


# motoでできること

https://docs.getmoto.org/en/latest/docs/services/cognito-idp.html