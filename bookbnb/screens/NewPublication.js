import * as React from 'react';
import { Image, AsyncStorage, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { postPublication } from '../utils';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import Map from '../components/maps';
import { CameraInput, CameraPreview } from '../components/camera';
import { SimpleTextInput, AddNewButton } from '../components/components';
import { Requester } from '../requester/requester';
import { uploadImageToFirebase } from '../utils';
import { UserContext } from '../context/userContext';


function NewPublicationScreen(props) {
    const { uid, token, setToken, requester } = React.useContext(UserContext);

    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [rooms, setRooms] = React.useState('');
    const [beds, setBeds] = React.useState('');
    const [bathrooms, setBathrooms] = React.useState('');
    const [price, setPrice] = React.useState('');

    const [coordinates, setCoordinates] = React.useState({longitude: 0, latitude: 0})
    const [images, setImages] = React.useState([]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImages([result]);
        }
    };

    async function handlePublish() {
        var photoURL = null
        for (const image of images) {
            photoURL = await uploadImageToFirebase(image);
        }
        var publication = {
            user_id: Number(uid),
            title: title,
            description: description,
            rooms: Number(rooms),
            beds: Number(beds),
            bathrooms: Number(bathrooms),
            price_per_night: Number(price),
            photoURL: [ photoURL ],
            coordinates: [coordinates.longitude, coordinates.latitude],
        }
        requester.publish(publication).then(() => {
            props.navigation.navigate('Publicaciones');
        })
    }

    let DEFAULT_IMG = "https://i.stack.imgur.com/y9DpT.jpg"

    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'left'}}> Publicá </Text>
                    <View style={styles.imagePreview}>
                        <Image
                            source={{uri: (images.length && images[0].uri || DEFAULT_IMG )}}
                            style={{flex: 1, width: '100%', height: 300, aspectRatio: 1}}
                        />
                        <AddNewButton onPress={pickImage}/>
                    </View>
                    <Text style={{margin: 15}}> Completá los datos de tu publicación! </Text>

                    <Text style={{fontWeight: 'bold'}}> Título de la publicación </Text>
                    <SimpleTextInput onChangeText={title => {setTitle(title)}} />

                    <Text style={{fontWeight: 'bold'}}> Cantidad de cuartos </Text>
                    <SimpleTextInput keyboardType='numeric' onChangeText={rooms => {setRooms(rooms)}} />

                    <Text style={{fontWeight: 'bold'}}> Cantidad de camas </Text>
                    <SimpleTextInput onChangeText={beds => { setBeds(beds)}} />

                    <Text style={{fontWeight: 'bold'}}> Cantidad de baños </Text>
                    <SimpleTextInput onChangeText={bathrooms => {setBathrooms(bathrooms)}} />

                    <Text style={{fontWeight: 'bold'}}> Precio por noche </Text>
                    <SimpleTextInput onChangeText={price => {setPrice(price)}} />

                    <Map onChangeCoordinates={coordinates => { setCoordinates({latitude: coordinates[0], longitude:coordinates[1]}) }}/>

                    <Text style={{fontWeight: 'bold'}}> Descripción </Text>
                    <SimpleTextInput multiline onChangeText={description => {setDescription(description)}}/>

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
    imagePreview: {
        borderWidth: 3,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    }
})

export { NewPublicationScreen }

