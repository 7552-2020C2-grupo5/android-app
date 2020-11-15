// Utils for mobile app

import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

const PUBLICATIONS_ENDPOINT = "https://bookbnb5-publications.herokuapp.com/v1/publication"

function login(username='eve.holt@reqres.in', password='cityslicka', token_callback) {
    var user = username;
    var pass = 'none';
    // si nos pasan test nos logeamos con los defaults
    if (username == 'test') {
        username = "eve.holt@reqres.in";
        password = "cityslicka";
    }
    console.log(`Making post with ${username}, ${password}`)
    fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: username,
            password: password,
        })
    }).then(response => {
        response.json().then(value => token_callback(value.token) )
    }).catch(error => {
        console.log(error)
    })
}

// Abre una view para realizar logeo con google, devuelve las credenciales
async function doGoogleLogin() {
    let loginResult = await Google.logInAsync({
        scopes: ['openid', 'profile'],
        clientId: '323498260525-irodasbifo350ic2lftmj226ltink5mp.apps.googleusercontent.com',
    });
    const credential = firebase.auth.GoogleAuthProvider.credential(loginResult.idToken);
    loginResult = await firebase.auth().signInWithCredential(credential);
}

async function postPublication(publication) {
    fetch(PUBLICATIONS_ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: publication.title,
            description: publication.description,
            rooms: publication.rooms,
            beds: publication.beds,
            bathrooms: publication.bathrooms,
            price_per_night: publication.price_per_night,
        })
    }).then(async response => {
        var response_json = await response.json()
        console.log(response_json)
    }).catch(error => {
        console.log('error')
    })
}

export { doGoogleLogin, login, postPublication }
