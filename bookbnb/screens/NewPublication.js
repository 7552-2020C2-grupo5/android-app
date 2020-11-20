import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { CameraInput, CameraPreview } from '../components/camera';
import { postPublication } from '../utils';
import * as firebase from 'firebase';
import MapView from 'react-native-maps';

function SimpleTextInput(props) {
    const styles = StyleSheet.create({
        input: {
            width: 330,
            height: 40,
            paddingBottom: 20,
        },
        multiline: {
            flex: 1,
            width: 330,
            height: 150,
            paddingBottom: 20,
        }
    })
    if(!props.multiline){
        return (
            <TextInput dense={true} label='' {...props} mode='outlined' style={styles.input}/>
        );
    }
    return (
        <TextInput textAlignVertical={"top"} numberOfLines={8} multiline={true} label='' {...props} mode='outlined' style={styles.multiline}/>
    );
}

function NewPublicationScreen(props) {
    const [publication, setPublication] = React.useState({
        title: '',
        description: '',
        rooms: '',
        beds: '',
        bathrooms: '',
        price_per_night: '',
        image_blob: [],
    });

    function handlePublish() {
        console.log(publication)
        postPublication(publication)
    }

    // TODO: mover a requester
    async function handlePhotoTaken(photo) {
        publication.image_blob.push(photo)
        setPublication(publication)

        try {
            const response = await fetch(photo.uri);
            const blob = await response.blob();

            // acá deberíamos usar algo como uuid() para generar identificadores únicos
            const ref = firebase.storage().ref().child('testing');
            await ref.put(blob)
            const url = ref.getDownloadURL().then(url => console.log(`URL es : ${url}`))
        } catch(e) {
            console.log(e.message)
        }
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
                        var _publication = publication;
                        _publication.title = text;
                        setPublication(_publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de cuartos </Text>
                    <SimpleTextInput onChangeText={text => {
                        var _publication = publication;
                        _publication.rooms = Number(text);
                        setPublication(_publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de camas </Text>
                    <SimpleTextInput onChangeText={text => {
                        var _publication = publication;
                        _publication.beds = Number(text);
                        setPublication(_publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Cantidad de baños </Text>
                    <SimpleTextInput onChangeText={text => {
                        var _publication = publication;
                        _publication.bathrooms = Number(text);
                        setPublication(_publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Precio por noche </Text>
                    <SimpleTextInput onChangeText={text => {
                        var _publication = publication;
                        _publication.price_per_night = Number(text);
                        setPublication(_publication);
                        }} />
                    <Text style={{fontWeight: 'bold'}}> Descripción </Text>
                    <SimpleTextInput multiline={true} onChangeText={text => {
                        var _publication = publication;
                        _publication.description = text;
                        setPublication(_publication);
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

