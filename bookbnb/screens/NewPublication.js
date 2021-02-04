import * as React from 'react';
import {
  Image, AsyncStorage, Text, View, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';
import * as firebase from 'firebase';
import * as ImagePicker from 'expo-image-picker';
import { postPublication, uploadImageToFirebase } from '../utils';
import Map from '../components/maps';
import { CameraInput, CameraPreview } from '../components/camera';
import { SimpleTextInput, AddNewButton } from '../components/components';
import { UserContext } from '../context/userContext';

function NewPublicationScreen(props) {
  const { uid, newRequester } = React.useContext(UserContext);

  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [rooms, setRooms] = React.useState('');
  const [beds, setBeds] = React.useState('');
  const [bathrooms, setBathrooms] = React.useState('');
  const [price, setPrice] = React.useState('');

  const [coordinates, setCoordinates] = React.useState({ longitude: 0, latitude: 0 });
  const [images, setImages] = React.useState([]);

  React.useEffect(() => {
    if (props.route.params.editing) {
      /* Si ya me viene una publicación es porque estoy editando */
      const { publication } = props.route.params;
      setTitle(publication.title);
      setDescription(publication.description);
      setRooms(String(publication.rooms));
      setBeds(String(publication.beds));
      setPrice(String(publication.price_per_night));
      setBathrooms(String(publication.bathrooms));
      setImages([{
        uri: publication.images[0].url,
      }]);
      setCoordinates({
        latitude: publication.loc.latitude,
        longitude: publication.loc.longitude,
      });
    }
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setImages([result]);
    }
  };

  function isUploadedToFirebase(image) {
    return !(image.type)
  }

  async function handlePublish() {
    let photoURL = null;
    for (const image of images) {
      if (isUploadedToFirebase(image)) {
        /* si tiene type es porque la acabo de sacar */
        photoURL = await uploadImageToFirebase(image);
      } else {
        photoURL = image.uri;
      }
    }
    const publication = {
      user_id: Number(uid),
      title,
      description,
      rooms: Number(rooms),
      beds: Number(beds),
      bathrooms: Number(bathrooms),
      price_per_night: Number(price),
      photoURL: [photoURL],
      coordinates: [coordinates.latitude, coordinates.longitude],
    };
    if (props.route.params.editing) {
      publication.id = props.route.params.publication.id;
      newRequester.updatePublication(publication.id, publication, () => {
        props.navigation.navigate('Publicaciones');
      })
    } else {
      newRequester.postPublication(publication, () => {
        props.navigation.navigate('Publicaciones');
      })
    }
  }

  const DEFAULT_IMG = 'https://i.stack.imgur.com/y9DpT.jpg';

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={{ margin: 10 }}>
          <Text style={{ fontSize: 50, fontWeight: 'bold', textAlign: 'left' }}> Publicá </Text>
          <View style={styles.imagePreview}>
            <Image
              source={{ uri: (images.length && images[0].uri || DEFAULT_IMG) }}
              style={{
                flex: 1, width: '100%', height: 300, aspectRatio: 1,
              }}
            />
            <AddNewButton onPress={pickImage} />
          </View>

          <Text style={{ fontWeight: 'bold' }}> Título de la publicación </Text>
          <SimpleTextInput value={title} onChangeText={(title) => { setTitle(title); }} />

          <Text style={{ fontWeight: 'bold' }}> Cantidad de cuartos </Text>
          <SimpleTextInput numeric keyboardType="numeric" value={rooms} onChangeText={(rooms) => { setRooms(rooms); }} />

          <Text style={{ fontWeight: 'bold' }}> Cantidad de camas </Text>
          <SimpleTextInput value={beds} onChangeText={(beds) => { setBeds(beds); }} />

          <Text style={{ fontWeight: 'bold' }}> Cantidad de baños </Text>
          <SimpleTextInput value={bathrooms} onChangeText={(bathrooms) => { setBathrooms(bathrooms); }} />

          <Text style={{ fontWeight: 'bold' }}> Precio por noche </Text>
          <SimpleTextInput value={price} onChangeText={(price) => { setPrice(price); }} />

          <Map
            coordinates={[coordinates.latitude, coordinates.longitude]}
            onChangeCoordinates={(coordinates) => {
              setCoordinates({ latitude: coordinates[0], longitude: coordinates[1] });
            }}
          />

          <Text style={{ fontWeight: 'bold' }}> Descripción </Text>
          <SimpleTextInput value={description} multiline onChangeText={(description) => { setDescription(description); }} />

          <Button dark onPress={handlePublish} mode="contained"> Publicar </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  },
});

export { NewPublicationScreen };
