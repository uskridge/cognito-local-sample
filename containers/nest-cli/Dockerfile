# ベースイメージとして公式のNode.jsイメージを使用
FROM node:20

# アプリケーションディレクトリを作成
WORKDIR /usr/src/app

# init.shで使うjqをインストール
RUN apt-get update \
  && apt-get install -y jq

# アプリケーションの依存関係をインストール
COPY package.json ./
COPY yarn.lock ./

# Nest CLI とパッケージ依存関係をインストール
RUN corepack enable && corepack prepare yarn@stable --activate
RUN npm install -g @nestjs/cli
RUN touch .yarnrc.yml & echo "nodeLinker: node-modules" > .yarnrc.yml \
  && yarn

# アプリを起動するポート番号を指定
EXPOSE 3000