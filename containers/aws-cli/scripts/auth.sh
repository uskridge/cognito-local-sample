#!/bin/bash

CONFIG=/root/.aws/cognito.config.json

# JSON ファイルからキーと値を読み込み、それぞれのキーに対して環境変数を設定
__USER_POOL_ID=$(jq -r '.USER_POOL_ID' $CONFIG)
__CLIENT_ID=$(jq -r '.CLIENT_ID' $CONFIG)

aws cognito-idp admin-initiate-auth \
  --user-pool-id ${__USER_POOL_ID} \
  --client-id ${__CLIENT_ID} \
  --auth-flow ADMIN_USER_PASSWORD_AUTH \
  --auth-parameters "USERNAME=${COGNITO_USER_EMAIL},PASSWORD=${COGNITO_USER_PASSWORD}" \
  --profile local \
  --endpoint-url ${COGNITO_ENDPOINT_URL}