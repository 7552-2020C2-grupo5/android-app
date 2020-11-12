// Utils for mobile app

import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';

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

export { doGoogleLogin, login}
