FROM bycedric/expo-cli 

ENV EXPO_USER=
ENV EXPO_PASSWORD=

ADD . /app

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	cd /app/bookbnb &&\
	npm install && npm install --global expo-cli

WORKDIR /app

CMD ["/bin/bash -c ./entrypoint.sh"]
