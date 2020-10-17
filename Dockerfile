FROM node:lts-stretch-slim

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	npm install --global expo-cli 

WORKDIR /app
ADD entrypoint.sh .

CMD ["./entrypoint.sh"]
