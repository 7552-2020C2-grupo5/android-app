// Utils for mobile app

import * as firebase from 'firebase';
import * as Google from 'expo-google-app-auth';
import { Buffer } from 'buffer';
import { v4 as uuidv4 } from 'uuid';

export function dateStringyfier(date) {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
}

async function uploadImageToFirebase(photo) {
  try {
    const response = await fetch(photo.uri);
    const blob = await response.blob();

    // acá deberíamos usar algo como uuid() para generar identificadores únicos
    const ref = firebase.storage().ref().child(uuidv4());
    await ref.put(blob);
    const url = ref.getDownloadURL();
    return url;
  } catch (e) {
    alert(e);
  }
}

function decodeJWTPayload(jwt) {
  const payload = jwt.split('.')[1];
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

// Abre una view para realizar logeo con google, devuelve las credenciales
async function getGoogleLoginToken() {
  let loginResult = await Google.logInAsync({
    scopes: ['openid', 'profile'],
    clientId: '323498260525-irodasbifo350ic2lftmj226ltink5mp.apps.googleusercontent.com',
    androidStandaloneAppClientId: '323498260525-ehrvng0r0fn7igkv3gflmchruda28g2s.apps.googleusercontent.com' ,
  });
  const credential = firebase.auth.GoogleAuthProvider.credential(loginResult.idToken);

  return firebase.auth().signInWithCredential(credential)
}

// MAPS
//
const DECODE_URL = 'https://us1.locationiq.com/v1/reverse.php';
const ENCODE_URL = 'https://us1.locationiq.com/v1/search.php';
const ACCESS_TOKEN = 'pk.abba15d0315049d6c0443e65b53a4d54';

async function geoDecode(latitude, longitude) {
  console.log(`geoDecoding for latitude=${latitude}, longitude=${longitude}`);

  const url = `${DECODE_URL}?key=${ACCESS_TOKEN}&format=json&lat=${latitude}&lon=${longitude}`;

  // TODO: corregir
  return fetch(url, {
    method: 'GET',
  }).then((response) => response.json().then((value) => ({
    address: value.display_name,
    country: value.address.country,
    state: value.address.state,
    city: value.address.county,
  }))).catch((e) => {
    console.log(`Ocurrió un error ${e}`);
  });
}

async function geoEncode(str) {
  console.log(`geoencoding for str=${str}`);

  const url = `${ENCODE_URL}?key=${ACCESS_TOKEN}&format=json&q=${encodeURIComponent(str)}`;

  // TODO pasar a await
  return fetch(url, {
    method: 'GET',
  }).then((response) => response.json().then((value) => {
    console.log(value);
    return {
      latitude: Number(value[0].lat),
      longitude: Number(value[0].lon),
    };
  })).catch((e) => {
    console.log(`Ocurrió un error ${e}`);
  });
}

export {
  getGoogleLoginToken, decodeJWTPayload, geoEncode, geoDecode, uploadImageToFirebase,
};
