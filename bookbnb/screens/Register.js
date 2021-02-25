import * as React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SimpleTextInput } from '../components/components';
import { UserContext } from '../context/userContext';
import { LoadableView } from '../components/loading';
import { ToastError } from '../components/ToastError';

export function RegistrationScreen(props) {
  const { requester } = React.useContext(UserContext);

  const [name, setName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [passwordConfirmation, setPasswordConfirmation] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function sanitize(data) {
    return data.trim();
  }

  function validatePassword(password) {
    return (password.trim() == passwordConfirmation.trim())
  }

  function handleRegister() {
    const newUser = {
      first_name: sanitize(name),
      last_name: sanitize(lastName),
      email: sanitize(email),
      password: sanitize(password),
      profile_picture: '',
    };

    if (! (email && password))
      return ToastError('No se puede crear usuario sin email o password');

    if (!validatePassword(password))
      return ToastError("Las contraseñas no coinciden");

    requester.register(newUser, response => {
      setLoading(false);
      if (response.hasError())
        return ToastError(response.description())
      props.navigation.goBack(null);
    });

    setLoading(true);
  }

  return (
    <LoadableView loading={loading} message="Creando usuario">
      <View style={styles.registrationContainer}>
        <ScrollView>
          <Text style={styles.fieldTitle}> Nombre </Text>
          <SimpleTextInput onChangeText={(value) => { setName(value); }} />
          <Text style={styles.fieldTitle}> Apellido </Text>
          <SimpleTextInput onChangeText={(value) => { setLastName(value); }} />
          <Text style={styles.fieldTitle}> Email </Text>
          <SimpleTextInput onChangeText={(value) => { setEmail(value); }} />
          <Text style={styles.fieldTitle}> Contraseña </Text>
          <SimpleTextInput secureTextEntry onChangeText={(value) => { setPassword(value); }} />
          <Text style={styles.fieldTitle}> Repetí la contraseña </Text>
          <SimpleTextInput secureTextEntry onChangeText={(value) => { setPasswordConfirmation(value); }} />
          <Button dark onPress={handleRegister} mode="contained"> Registrarme </Button>
        </ScrollView>
      </View>
    </LoadableView>
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
