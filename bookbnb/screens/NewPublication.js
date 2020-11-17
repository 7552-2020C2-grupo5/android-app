import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { CameraInput, CameraPreview } from '../components/camera';
import { postPublication } from '../utils';

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
    });

    function handlePublish() {
        console.log(publication)
        postPublication(publication)
    }

    return (
        <ScrollView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 30}}>
                    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 10}}>
                        <CameraInput/>
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

export { NewPublicationScreen }

