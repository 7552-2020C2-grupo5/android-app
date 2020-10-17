FROM node:lts-stretch-slim

ADD . /app

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	cd /app/bookbnb &&\
	npm install && npm install --global expo-cli

WORKDIR /app

CMD ["./entrypoint.sh"]
