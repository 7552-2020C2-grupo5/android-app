import * as React from 'react';
import {
  ScrollView, StyleSheet, View, Text, Image,
} from 'react-native';
import { Button, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import { uploadImageToFirebase, decodeJWTPayload } from '../utils';
import { UserContext } from '../context/userContext';
import { SimpleTextInput } from '../components/components';
import { LoadableView } from '../components/loading';

function EditProfileScreen(props) {
  const { uid, token, setToken, requester } = React.useContext(UserContext);
  const [userImage, setUserImage] = React.useState(null);
  const [userData, setUserData] = React.useState(props.route.params.userData);
  const [loading, setLoading] = React.useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setUserImage(result);
    }
  };

  React.useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita acceso a la galería para editar el perfil!');
      }
    })();
  }, []);

  async function buildUserDetails() {
    const userDetails = {
      first_name: userData.firstName,
      last_name: userData.lastName,
    }

    if (userImage) {
      let url = await uploadImageToFirebase(userImage);
      setUserData({ ...userData, avatar: url });
      userDetails.profile_picture = url
    }

    return userDetails
  }

  async function handleSave() {
    const userDetails = await buildUserDetails();

    requester.updateProfileData(
      userData.id, userDetails, () => props.navigation.goBack()
    );
    setLoading(true);
  }

  return (
    <LoadableView loading={loading} message="Guardando tus cambios">
      <ScrollView>
        <View style={{ padding: 10 }}>
          <View style={{ flex: 1, alignItems: 'center', padding: 30 }}>
            {userImage ? (
              <Avatar.Image source={{ uri: userImage.uri }} size={140} />
            ) : (
              <Icon name="pencil" type="evilicon" onPress={pickImage} reverse raised color="black" size={70} />
            )}
         </View>
          <Text style={{ fontWeight: 'bold' }}>Nombre</Text>
          <SimpleTextInput
            value={userData.firstName}
            onChangeText={(value) => {
              setUserData({ ...userData, firstName: value });
            }}
          />
          <Text style={{ fontWeight: 'bold' }}>Apellido</Text>
          <SimpleTextInput
            value={userData.lastName}
            onChangeText={(value) => {
              setUserData({ ...userData, lastName: value });
            }}
          />
          <Text style={{ fontWeight: 'bold' }}>Email</Text>
          <SimpleTextInput
            value={userData.email}
            disabled={true}
            onChangeText={(value) => {
              setUserData({ ...userData, email: value });
            }}
          />
          <Button dark onPress={handleSave} mode="contained"> Guardar </Button>
        </View>
      </ScrollView>
    </LoadableView>
  );
}

export { EditProfileScreen };
