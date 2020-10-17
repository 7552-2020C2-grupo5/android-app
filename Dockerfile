FROM node:lts-stretch-slim

ADD . /app

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	cd /app/bookbnb && npm install

WORKDIR /app

CMD ["./entrypoint.sh"]
