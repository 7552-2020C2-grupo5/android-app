import * as React from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SnackBar } from '../components/components';
import { SocialIcon } from 'react-native-elements';
import { doGoogleLogin, login } from '../utils';

//@refresh reset

export default function LoginScreen(props) {
    const [username, setUsername] = React.useState('');
    const [pass, setPass] = React.useState('');

    async function _handleLoginSucessful(token) {
        await AsyncStorage.setItem('token', token);
        props.route.params['func'](true)
        console.log(`saved token! ${token}`);
    }

    AsyncStorage.removeItem('token');

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{marginBottom: 30}}>
                    <TextInput mode='outlined' onChangeText={(value) => setUsername(value)} style={styles.input} label="Nombre de usuario"/>
                    <TextInput mode='outlined' onChangeText={(value) => setPass(value)} style={styles.input} label="Contraseña"/>
                </View>
                <Button dark={true} compact={true} mode="contained" onPress={() => login(username, pass, _handleLoginSucessful)}> Iniciar sesión </Button>
                <View style={{flexDirection: 'row', paddingTop: 20}}>
                  <SocialIcon type='google' dark={true} compact={true} style={{margin: 30}} mode="contained" onPress={() => doGoogleLogin()} />
                  <SocialIcon type='facebook' dark={true} compact={true} style={{margin: 30}} mode="contained" />
                </View>
                <SnackBar timeout={2000} text='Logeado como' />
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
})

export { LoginScreen }
