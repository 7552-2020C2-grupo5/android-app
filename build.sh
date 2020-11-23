#!/bin/bash

echo "Utilizando usuario $EXPO_USER"

./resolve_submodules.sh

LOG_FILE=/app/build.log
LINK_FILE="app.link"

cd /app/bookbnb

expo login -u $EXPO_USER -p $EXPO_PASSWORD && expo build:android --type apk --non-interactive | tee $LOG_FILE

cd /app

echo $(egrep -o "https.*/artifacts/.*" $LOG_FILE) > $LINK_FILE
