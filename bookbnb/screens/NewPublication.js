import * as React from 'react';
import {Image, ScrollView, StyleSheet, Text, View,} from 'react-native';
import {Button} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import {uploadImageToFirebase} from '../utils';
import Map from '../components/maps';
import {AddNewButton, SimpleTextInput} from '../components/components';
import {UserContext} from '../context/userContext';
import NumericInput from "../components/NumericInput";


function NewPublicationScreen(props) {
  const { uid, requester, mnemonic } = React.useContext(UserContext);

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

  function isUploadedToFirebase(image) { return !(image.type) }

  function requiredFieldsCompleted() {
    const normalRequiredFields = [title, rooms, beds, bathrooms, price];
    const hasImages = images.length > 0;
    const allNormalRequiredFieldsCompleted = normalRequiredFields.every(field => field !== "");
    console.log("Normal fields: " + allNormalRequiredFieldsCompleted + " HasImages: " + hasImages);
    return allNormalRequiredFieldsCompleted && hasImages;
  }

  async function buildPublication() {
    let photoURL = null;
    for (const image of images) {
      if (!isUploadedToFirebase(image)) {
        photoURL = await uploadImageToFirebase(image);
      } else {
        photoURL = image.uri;
      }
    }

    return {
        user_id: Number(uid),
        title: title,
        description: description,
        rooms: Number(rooms),
        beds: Number(beds),
        bathrooms: Number(bathrooms),
        price_per_night: Number(price),
        images: [{ url: photoURL }],
        loc: {latitude: coordinates.latitude, longitude: coordinates.longitude},
        mnemonic: mnemonic,
    };
  }

  function isNotValidNumber(number) {
    return isNaN(number) || number < 0;
  };

  function validatePublication(publication) {
    if (publication.images[0].url == '')
      throw new Error("No se pueden hacer publicaciones sin imágenes");

    if (isNotValidNumber(publication.rooms))
      throw new Error("La cantidad de cuartos tiene que ser un número");

    if (isNotValidNumber(publication.beds))
      throw new Error("La cantidad de camas tiene que ser un número");

    if (isNotValidNumber(publication.bathrooms))
      throw new Error("La cantidad de baños tiene que ser un número");

    if (isNotValidNumber(publication.price_per_night))
      throw new Error("El precio por noche tiene que ser un número");
  }

  async function checkForPublicationStatus(publicationId, onStatusConfirmed) {
    requester.getPublication(publicationId, response => {
      if (response.content().blockchain_status == 'UNSET') {
        return setTimeout(() => checkForPublicationStatus(publicationId, onStatusConfirmed), 3000);
      }
      onStatusConfirmed(response.content());
    });
  }

  async function handlePublish() {
    try {
      let publication = await buildPublication();

      validatePublication(publication);

      if (props.route.params.editing) {
        //TODO. handlear errores
        publication.id = props.route.params.publication.id;
        requester.updatePublication(publication.id, publication, () => {
          props.navigation.navigate('Publicaciones');
        })
      } else {
        requester.postPublication(publication, response => {
            checkForPublicationStatus(response.content().id, () => {
            props.navigation.navigate('Publicaciones');
          })
        })
      }
    } catch(e) {
      alert(e.message);
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

          <SimpleTextInput label={"Título"} required value={title} onChangeText={(title) => { setTitle(title); }} />

          <NumericInput label={"Cant. de cuartos"} value={rooms} onChangeText={(rooms) => { setRooms(rooms); }} />

          <NumericInput label={"Cant. de camas"} value={beds} onChangeText={(beds) => { setBeds(beds); }} />

          <NumericInput  label={"Cant. de baños"}  value={bathrooms} onChangeText={(bathrooms) => { setBathrooms(bathrooms); }} />

          <NumericInput label={"Precio por noche (ETH)"}  value={price} onChangeText={(price) => { setPrice(price); }} />

          <Map
            coordinates={[coordinates.latitude, coordinates.longitude]}
            onChangeCoordinates={(coordinates) => {
              setCoordinates({ latitude: coordinates[0], longitude: coordinates[1] });
            }}
          />

          <SimpleTextInput multiline numberOfLines={5} label={"Descripción"} value={description}
                           onChangeText={(description) => { setDescription(description); }} />

          <Button dark onPress={handlePublish} disabled={!requiredFieldsCompleted()} mode="contained"> Publicar </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  imagePreview: {
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 17,
  },
});

export { NewPublicationScreen };
