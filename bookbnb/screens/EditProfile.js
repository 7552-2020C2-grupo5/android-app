import * as React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { SimpleTextInput } from '../components/components';
import { Button } from 'react-native-paper';
import { Requester } from '../requester/requester';


function EditProfileScreen(props) {
    const [userData, setUserData] = React.useState(props.route.params.userData);
    const [test, setTest] = React.useState('test');

    var requester = new Requester();

    var nameFields = {
        'Nombre': 'firstName',
        'Apellido': 'lastName',
        'Email': 'email'
    }

    async function handleSave() {
        await requester.updateProfileData(userData.id, {
            first_name: userData.firstName,
            last_name: userData.lastName,
        })
        props.navigation.goBack()
    }

    return (
        <ScrollView>
            <View style={{padding: 10}}>
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
