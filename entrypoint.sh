#!/bin/bash

LOG_FILE=/app/build.log

cd /app/bookbnb

expo login -u $EXPO_USER -p $EXPO_PASSWORD && expo build:android --type apk | tee $LOG_FILE

cd /app

export DOWNLOAD_LINK="$(egrep -o "https.*/artifacts/.*" $LOG_FILE)"

echo "El link de descarga es $DOWNLOAD_LINK"

node download_server.js
