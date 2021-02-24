import * as React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Button, TextInput, Dialog, Portal } from 'react-native-paper';
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
  const [recoveringPass, setRecoveringPass] = React.useState(false);
  const [recoverEmail, setRecoverEmail] = React.useState('');

  function _handleResponse(response) {
    if (response.hasError()) {
      alert(response.description());
      setLoading(false);
      return
    }

    try {
      let token = response.content().token;
      setToken(token);
    } catch(e) {
      console.log(e)
      setLoading(false);
    }
  }

  function handleLogin() {
    let loginDetails = {
      email: username.trim(),
      password: pass.trim(),
      push_token: ''
    }

    if (!(loginDetails.email && loginDetails.password)) {
      return alert("No se puede iniciar sesión sin usuario / contraseña")
    }

    requester.userLogin(loginDetails, _handleResponse);
    setLoading(true);
  }

  function handleRecoverPass() {
    if (!recoverEmail) {
      return alert('Ingresá un email válido')
    }
    requester.resetPassword(recoverEmail.trim(), (response) => {
      if(response.hasError()) {
        alert(response.description())
      } else {
        alert(`Revisa tu correo (${recoverEmail})`, recoverEmail)
      }
      setRecoveringPass(false);
    })
  }

  return (
    <LoadableView loading={loading} message="Iniciando sesión">
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Portal>
          <Dialog visible={recoveringPass} onDismiss={() => setRecoveringPass(false)}>
            <Dialog.Title>Recuperación de contraseña</Dialog.Title>
            <Dialog.Content>
                <Text style={{marginBottom: 20}}>Ingresá el email que usaste para registrarte. Enviaremos una nueva contraseña</Text>
                <TextInput mode="outlined" label="Email" onChangeText={text => setRecoverEmail(text)}/>
                <Button mode="contained" style={{marginTop: 20}} onPress={handleRecoverPass}>Enviar</Button>
            </Dialog.Content>
          </Dialog>
        </Portal>
        <AppLogo />
        <View style={{ marginBottom: 30 }}>
          <TextInput mode="outlined" onChangeText={setUsername} style={styles.input} label="Nombre de usuario" />
          <TextInput mode="outlined" secureTextEntry onChangeText={setPass} style={styles.input} label="Contraseña" />
        </View>
        <Button dark compact mode="contained" onPress={handleLogin}> Iniciar sesión </Button>
        <View style={{ flexDirection: 'row', paddingTop: 20 }}>
          <SocialIcon type="google" dark compact style={{ margin: 15 }} mode="contained" onPress={doGoogleLogin} />
        </View>
        <TouchableOpacity style={{margin: 10}} onPress={() => { props.navigation.navigate('Register'); }}>
          <Text style={{ ...styles.register, ...{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' } }}>Registrate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecoveringPass(true)}>
          <Text style={{ ...styles.register, ...{ color: 'blue', fontSize: 20, textDecorationLine: 'underline' } }}>¿Olvidaste tu contraseña?</Text>
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
