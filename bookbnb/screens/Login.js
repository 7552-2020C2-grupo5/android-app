import * as React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SocialIcon } from 'react-native-elements';
import { SnackBar, AppLogo } from '../components/components';
import { doGoogleLogin, login } from '../utils';
import { UserContext } from '../context/userContext';
import { LoadableView } from '../components/loading';

export function LoginScreen(props) {
  const { token, setToken, requester } = React.useContext(UserContext);
  const [username, setUsername] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  function _handleResponse(response) {
    try {
      let token = response.content().token;
      setToken(token);
    } catch(e) {
      alert(response.description());
    }
  }

  function handleLogin() {
    let loginDetails = {
      email: username.trim(),
      password: pass.trim()
    }
    requester.userLogin(loginDetails, _handleResponse);
    setLoading(true);
  }

  return (
    <LoadableView loading={loading} message="Iniciando sesión">
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
       <AppLogo />
        <View style={{ marginBottom: 30 }}>
          <TextInput mode="outlined" onChangeText={setUsername} style={styles.input} label="Nombre de usuario" />
          <TextInput mode="outlined" secureTextEntry onChangeText={setPass} style={styles.input} label="Contraseña" />
        </View>
        <Button dark compact mode="contained" onPress={handleLogin}> Iniciar sesión </Button>
        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
          <SocialIcon type="google" dark compact style={{ margin: 30 }} mode="contained" onPress={doGoogleLogin} />
        </View>
        <Text style={styles.register}> No estás registrado? </Text>
        <TouchableOpacity onPress={() => { props.navigation.navigate('Register'); }}>
          <Text style={{ ...styles.register, ...{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' } }}>Registrate</Text>
        </TouchableOpacity>
      </View>
    </LoadableView>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 10,
    width: 300,
  },
  register: {
    fontWeight: 'bold',
    fontSize: 15,
  },
});
