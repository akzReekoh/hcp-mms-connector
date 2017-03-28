FROM node:boron

MAINTAINER Reekoh

RUN apt-get update && apt-get install -y build-essential

RUN mkdir -p /home/node/hcp-mms
COPY . /home/node/hcp-mms

WORKDIR /home/node/hcp-mms

# Install dependencies
RUN npm install pm2 yarn -g
RUN yarn install

CMD ["pm2-docker", "--json", "app.yml"]
