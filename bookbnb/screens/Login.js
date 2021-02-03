import * as React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SocialIcon } from 'react-native-elements';
import { SnackBar, AppLogo } from '../components/components';
import { doGoogleLogin, login } from '../utils';
import { UserContext } from '../context/userContext';

export function LoginScreen(props) {
  const { token, setToken, newRequester } = React.useContext(UserContext);
  const [username, setUsername] = React.useState('');
  const [pass, setPass] = React.useState('');

  function _handleResponse(response) {
    try {
      let token = response.content().token;
      setToken(token);
    } catch(e) {
      alert(response.description());
    }
  }

  function handleLogin() {
    newRequester.userLogin({email: username, password: pass}, _handleResponse);
  }

  return (
    <View style={styles.container}>
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <AppLogo />
        <View style={{ marginBottom: 30 }}>
          <TextInput mode="outlined" onChangeText={(value) => setUsername(value)} style={styles.input} label="Nombre de usuario" />
          <TextInput mode="outlined" onChangeText={(value) => setPass(value)} style={styles.input} label="Contraseña" />
        </View>
        <Button dark compact mode="contained" onPress={handleLogin}> Iniciar sesión </Button>
        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
          <SocialIcon type="google" dark compact style={{ margin: 30 }} mode="contained" onPress={() => doGoogleLogin()} />
        </View>
        <Text style={styles.register}> No estás registrado? </Text>
        <TouchableOpacity onPress={() => { props.navigation.navigate('Register'); }}>
          <Text style={{ ...styles.register, ...{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' } }}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    margin: 10,
    width: 300,
  },
  register: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
