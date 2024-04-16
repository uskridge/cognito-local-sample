FROM public.ecr.aws/amazonlinux/amazonlinux:2

RUN yum update -y \
  && yum install -y jq unzip less groff \
  && yum clean all

ARG EXE_FILENAME=awscli-exe-linux-aarch64.zip

RUN curl "https://awscli.amazonaws.com/${EXE_FILENAME}" -o "awscliv2.zip" \
  && unzip awscliv2.zip \
  && ./aws/install --bin-dir /usr/local/bin/ --install-dir /usr/local/aws-cli/

WORKDIR /aws

ENTRYPOINT ["/bin/bash"]