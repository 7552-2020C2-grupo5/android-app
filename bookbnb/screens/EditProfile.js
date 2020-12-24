import * as React from 'react';
import { ScrollView, StyleSheet, View, Text, Image } from 'react-native';
import { SimpleTextInput } from '../components/components';
import { Button, Avatar } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Requester } from '../requester/requester';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { uploadImageToFirebase, decodeJWTPayload } from '../utils';
import { UserContext } from '../context/userContext';


function EditProfileScreen(props) {
    const { uid, token, setToken } = React.useContext(UserContext);
    const [userImage, setUserImage] = React.useState(null);
    const [userData, setUserData] = React.useState(props.route.params.userData);

    var requester = new Requester();

   const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setUserImage(result);
        }
    };

    var nameFields = {
        'Nombre': 'firstName',
        'Apellido': 'lastName',
        'Email': 'email'
    }

    React.useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Se necesita acceso a la galería para editar el perfil!');
            }
        })();
    }, []);


    async function handleSave() {
        let url = null;
        if (userImage) {
            url = await uploadImageToFirebase(userImage)
            setUserData({...userData, avatar: url})
        }
        if (url) {
            await requester.updateProfileData(userData.id, {
                first_name: userData.firstName,
                last_name: userData.lastName,
                profile_picture: url
            })
        } else {
            await requester.updateProfileData(userData.id, {
                first_name: userData.firstName,
                last_name: userData.lastName,
            })
        }
        props.navigation.goBack()
    }

    return (
        <ScrollView>
            <View style={{padding: 10}}>
                <View style={{flex: 1, alignItems: 'center', padding: 30}}>
                  {userImage? (
                      <Avatar.Image source={{ uri: userImage.uri }} size={140}/>
                  ):(
                      <Icon name='pencil' type='evilicon' onPress={pickImage} reverse={true} raised color='black' size={70}/>
                  )}
                </View>
                <Text style={{fontWeight: 'bold'}}>Nombre</Text>
                <SimpleTextInput value={userData.firstName} onChangeText={value => {
                    setUserData({...userData, firstName: value}) }} />
                <Text style={{fontWeight: 'bold'}}>Apellido</Text>
                <SimpleTextInput value={userData.lastName} onChangeText={value => {
                    setUserData({...userData, lastName: value}) }} />
                <Text style={{fontWeight: 'bold'}}>Email</Text>
                <SimpleTextInput value={userData.email} onChangeText={value => {
                    setUserData({...userData, email: value}) }} />
                <Button dark={true} onPress={handleSave} mode="contained"> Guardar </Button>
            </View>
        </ScrollView>
    );
}

export { EditProfileScreen }
