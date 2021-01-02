import * as React from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  Text,
  Title,
  StyleSheet,
  AsyncStorage,
} from 'react-native';

import { Button } from 'react-native-paper';
import { SimpleTextInput } from '../components/components';
import { Requester } from '../requester/requester';

export default function RegistrationScreen(props) {
  const [name, setName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(null);

  const requester = new Requester();

  async function handleRegister() {
    const newUser = {
      name,
      lastName,
      email,
      password,
    };

    try {
      const registerResult = await requester.register(newUser);
      await AsyncStorage.setItem('userToken', registerResult.token);
      await AsyncStorage.setItem('userID', String(registerResult.id));
      props.navigation.goBack(null);
    } catch (e) {
      console.log('Error: ');
      console.log(e);
      alert(e);
    }
  }

  return (
    <View style={{
      flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    }}
    >
      <>
        <Text style={{ fontWeight: 'bold' }}> Nombre </Text>
        <SimpleTextInput onChangeText={(value) => { setName(value); }} />
        <Text style={{ fontWeight: 'bold' }}> Apellido </Text>
        <SimpleTextInput onChangeText={(value) => { setLastName(value); }} />
        <Text style={{ fontWeight: 'bold' }}> Email </Text>
        <SimpleTextInput onChangeText={(value) => { setEmail(value); }} />
        <Text style={{ fontWeight: 'bold' }}> Contraseña </Text>
        <SimpleTextInput onChangeText={(value) => { setPassword(value); }} />
        <Text style={{ fontWeight: 'bold' }}> Repetí la contraseña </Text>
        <SimpleTextInput onChangeText={(value) => { setPasswordConfirmation(value); }} />
        <Button dark onPress={handleRegister} mode="contained"> Registrarme </Button>
      </>
    </View>
  );
}

export { RegistrationScreen };
