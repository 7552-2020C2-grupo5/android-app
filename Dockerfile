FROM node:lts-stretch-slim

# puertos para el navegador web
EXPOSE 19000 
EXPOSE 19001
EXPOSE 19006

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	npm install --global expo-cli

WORKDIR /app
ADD entrypoint.sh .

CMD ["./entrypoint.sh"]
