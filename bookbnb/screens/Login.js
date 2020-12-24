import * as React from 'react';
import { StyleSheet, View, Text, AsyncStorage, TouchableOpacity } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SnackBar, AppLogo } from '../components/components';
import { SocialIcon } from 'react-native-elements';
import { doGoogleLogin, login } from '../utils';
import { UserContext } from '../context/userContext';


export default function LoginScreen(props) {
    const { UID, token, setToken, requester } = React.useContext(UserContext);
    const [username, setUsername] = React.useState('');
    const [pass, setPass] = React.useState('');

    async function userTokenIsSaved() {
        return !(token == null)
    }

    async function handleLogin() {
        var userCredentials = {
            username: username,
            password: pass
        }
        try {
            var loginResult = await requester.login(userCredentials);
            setToken(loginResult.token)
        } catch(e) {
            alert(e)
        }
    }

    //AsyncStorage.removeItem('userContext')

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
               <AppLogo/>
                <View style={{marginBottom: 30}}>
                    <TextInput mode='outlined' onChangeText={(value) => setUsername(value)} style={styles.input} label="Nombre de usuario" />
                    <TextInput mode='outlined' onChangeText={(value) => setPass(value)} style={styles.input} label="Contraseña" />
                </View>
                <Button dark={true} compact={true} mode="contained" onPress={handleLogin}> Iniciar sesión </Button>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <SocialIcon type='google' dark={true} compact={true} style={{margin: 30}} mode="contained" onPress={() => doGoogleLogin()} />
                </View>
                <Text style={styles.register}> No estás registrado? </Text>
                <TouchableOpacity onPress={() => { props.navigation.navigate('Register') }}>
                    <Text style={{...styles.register, ...{color: 'blue', fontSize: 20, textDecorationLine: 'underline'}}}>Registrate</Text>
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
    }
})

export { LoginScreen }
