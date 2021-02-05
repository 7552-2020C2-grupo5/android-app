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
import { UserContext } from '../context/userContext';

export function RegistrationScreen(props) {
  const { newRequester } = React.useContext(UserContext);

  const [name, setName] = React.useState(null);
  const [lastName, setLastName] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [passwordConfirmation, setPasswordConfirmation] = React.useState(null);

  async function handleRegister() {
    const newUser = {
        first_name: name,
        last_name: lastName,
        email: email,
        password: password,
        profile_picture: '',
    };

    newRequester.register(newUser, () => { props.navigation.goBack(null) });
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
