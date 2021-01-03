FROM bycedric/expo-cli 

ENV EXPO_USER=
ENV EXPO_PASSWORD=

ADD . /app

RUN 	apt-get update &&\
	apt-get install -y procps &&\
	cd /app/bookbnb &&\
	npm install 

RUN 	echo fs.inotify.max_user_watches=524288 | tee -a /etc/sysctl.conf && sysctl -p

WORKDIR /app

CMD ["/bin/bash -c ./entrypoint.sh"]
