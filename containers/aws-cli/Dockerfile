FROM python:3.9.19-slim

RUN apt-get update \
  && apt-get install -y curl unzip less groff jq docker.io \
  && apt-get clean

ARG AWS_CLI_ZIP=awscli-exe-linux-aarch64.zip
ARG SAM_CLI_ZIP=aws-sam-cli-linux-arm64.zip

RUN curl "https://awscli.amazonaws.com/${AWS_CLI_ZIP}" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install --bin-dir /usr/local/bin/ --install-dir /usr/local/aws-cli/

RUN curl -L "https://github.com/aws/aws-sam-cli/releases/latest/download/${SAM_CLI_ZIP}" -o "samcli.zip" \
  && unzip samcli.zip -d sam-installation\
  && ./sam-installation/install --bin-dir /usr/local/bin/ --install-dir /usr/local/aws-sam-cli/

# Node.jsのインストール
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@stable --activate
RUN npm install -g aws-cdk

WORKDIR /usr/workspaces

ENTRYPOINT ["/bin/bash"]