// Utils for mobile app

import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { Buffer } from 'buffer';
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


function decodeJWTPayload(jwt) {
    var payload = jwt.split('.')[1]
    return JSON.parse(Buffer.from(payload, "base64").toString());
}

// Abre una view para realizar logeo con google, devuelve las credenciales
async function doGoogleLogin() {
    let loginResult = await Google.logInAsync({
        scopes: ['openid', 'profile'],
        clientId: '323498260525-irodasbifo350ic2lftmj226ltink5mp.apps.googleusercontent.com',
        androidStandaloneAppClientId: "AIzaSyDQV_tOPoqC9V8_muOya5qOgTLyRyqRAPc"
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
            console.log(`returning ${value.display_name}`)
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

export { doGoogleLogin, decodeJWTPayload, postPublication, geoEncode, geoDecode, uploadImageToFirebase }
