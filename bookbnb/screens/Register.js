import * as React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
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
    <View style={styles.registrationContainer}>
      <ScrollView>
        <Text style={styles.fieldTitle}> Nombre </Text>
        <SimpleTextInput onChangeText={(value) => { setName(value); }} />
        <Text style={styles.fieldTitle}> Apellido </Text>
        <SimpleTextInput onChangeText={(value) => { setLastName(value); }} />
        <Text style={styles.fieldTitle}> Email </Text>
        <SimpleTextInput onChangeText={(value) => { setEmail(value); }} />
        <Text style={styles.fieldTitle}> Contraseña </Text>
        <SimpleTextInput onChangeText={(value) => { setPassword(value); }} />
        <Text style={styles.fieldTitle}> Repetí la contraseña </Text>
        <SimpleTextInput onChangeText={(value) => { setPasswordConfirmation(value); }} />
        <Button dark onPress={handleRegister} mode="contained"> Registrarme </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
    fieldTitle: {
        fontWeight: 'bold',
        fontSize: 17,
    },
    registrationContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'stretch',
        margin: 2,
    },
});
