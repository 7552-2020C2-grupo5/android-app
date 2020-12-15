import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { postPublication } from '../utils';
import * as firebase from 'firebase';
import Map from '../components/maps';
import { CameraInput, CameraPreview } from '../components/camera';
import { SimpleTextInput } from '../components/components';
import { Requester } from '../requester/requester';
import { uploadImageToFirebase } from '../utils';

function NewPublicationScreen(props) {
    var emptyPublication = {
        title: '',
        description: '',
        rooms: '',
        beds: '',
        bathrooms: '',
        price_per_night: '',
        image_blob: [],
        coordinates: [0, 0],
    }

    const [publication, setPublication] = React.useState(emptyPublication);

    var requester = new Requester();

    async function handlePublish() {
        var photoURL = null
        var blob = null
        if (publication.image_blob.length){
            blob = publication.image_blob.pop();
            photoURL = await uploadImageToFirebase(blob);
        }
        publication.photoURL = [ photoURL ]
        await requester.publish(publication)
        props.navigation.navigate('Publicaciones');
    }

    async function handlePhotoTaken(photo) {
        while (publication.image_blob.length) {
            publication.image_blob.pop()
        }
        publication.image_blob.push(photo)
        setPublication(publication)
    }

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{padding: 10}}>
                    <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'left'}}> Publicá </Text>
                    <View style={styles.cameraView}>
                        <CameraInput onPhoto={handlePhotoTaken}/>
                    </View>
                    <Text style={{fontWeight: 'bold'}}> Título de la publicación </Text>
                    <SimpleTextInput onChangeText={text => {
                        publication.title = text;
                        setPublication(publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de cuartos </Text>
                    <SimpleTextInput keyboardType='numeric' onChangeText={text => {
                        publication.rooms = Number(text);
                        setPublication(publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de camas </Text>
                    <SimpleTextInput onChangeText={text => {
                        publication.beds = Number(text);
                        setPublication(publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de baños </Text>
                    <SimpleTextInput onChangeText={text => {
                        publication.bathrooms = Number(text);
                        setPublication(publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Precio por noche </Text>
                    <SimpleTextInput onChangeText={text => {
                        publication.price_per_night = Number(text);
                        setPublication(publication);
                        }} />
                    <Map onChangeCoordinates={coordinates => {
                        publication.coordinates = coordinates;
                        setPublication(publication);
                    }}/>
                    <Text style={{fontWeight: 'bold'}}> Descripción </Text>
                    <SimpleTextInput multiline={true} onChangeText={text => {
                        publication.description = text;
                        setPublication(publication);
                        }} />
                    <Button dark={true} onPress={handlePublish} mode="contained"> Publicar </Button>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    }
})

export { NewPublicationScreen }

