#!/bin/bash 

# script de util encargado de resolver los submodulos necesarios del proyecto
# heroku no funciona bien con submódulos

REQUESTER_PATH=bookbnb/requester
FETCH_URL=https://github.com/7552-2020C2-grupo5/server-requester.git

_do_resolve() {
        cd $REQUESTER_PATH
        git clone $FETCH_URL
        cd -
}

echo "Resolviendo submodulos $FETCH_URL"

_do_resolve()
