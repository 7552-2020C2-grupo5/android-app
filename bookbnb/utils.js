// Utils for mobile app

import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { v4 as uuidv4 } from 'uuid';

const PUBLICATIONS_ENDPOINT = "https://bookbnb5-publications.herokuapp.com/v1/publication"


async function uploadImageToFirebase(photo) {
    try{
        const response = await fetch(photo.uri);
        const blob = await response.blob();

       // acá deberíamos usar algo como uuid() para generar identificadores únicos
        const ref = firebase.storage().ref().child(uuidv4());
        await ref.put(blob)
        const url = ref.getDownloadURL();
        return url
    } catch(e) {
        alert(e)
    }
}


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

// MAPS
//
const DECODE_URL = "https://us1.locationiq.com/v1/reverse.php"
const ENCODE_URL = "https://us1.locationiq.com/v1/search.php"
const ACCESS_TOKEN = "pk.6504284c5b80234a71c42b240e54012e"

async function geoDecode(latitude, longitude) {
    console.log(`geodecoding for latitude=${latitude}, longitude=${longitude}`)

    var url = DECODE_URL + "?key=" + ACCESS_TOKEN + "&format=json&lat=" + latitude + "&lon=" + longitude

    // TODO: corregir
    return fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.json().then(value => {
            return {
                address: value.display_name
            }
        })
    }).catch(e => {
        console.log(`Ocurrió un error ${e}`)
    })
}

async function geoEncode(str) {
    console.log(`geoencoding for str=${str}`)

    var url = ENCODE_URL + "?key=" + ACCESS_TOKEN + "&format=json&q=" + encodeURIComponent(str)

    //TODO pasar a await
    return fetch(url, {
        method: 'GET',
    }).then(response => {
        return response.json().then(value => {
            console.log(value)
            return {
                latitude: Number(value[0].lat),
                longitude: Number(value[0].lon)
            }
        })
    }).catch(e => {
        console.log(`Ocurrió un error ${e}`)
    })
}

export { doGoogleLogin, login, postPublication, geoEncode, geoDecode, uploadImageToFirebase }
