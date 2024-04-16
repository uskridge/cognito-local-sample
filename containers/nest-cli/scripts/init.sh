#!/bin/bash

CONFIG=/usr/src/app/containers/aws-cli/.aws/cognito.config.json
ENV_LOCAL=/usr/src/app/.env.local

# ファイルが存在するかどうかをポーリング
while [ ! -f $CONFIG ]
do
  echo "Waiting for cognito.config.json to be created..."
  sleep 3
done

echo -e "\nCopying cognito.config.json to .env.local..."

# JSON ファイルからキーと値を読み取ってループ
jq -r 'to_entries|map("\(.key)=\(.value)")|.[]' $CONFIG | while IFS= read -r line; do
  # キーと値に分割
  key=$(echo $line | cut -d '=' -f 1)
  value=$(echo $line | cut -d '=' -f 2)

  # envファイルを更新
  sed -i "s/^$key=.*/$key=$value/" $ENV_LOCAL
done

echo -e "\nUpdated env file:"
cat $ENV_LOCAL

echo -e "\nLaunching Backend..."

yarn && yarn dev:docker