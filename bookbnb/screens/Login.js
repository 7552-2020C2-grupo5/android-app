import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { SnackBar } from '../components/components';

export default function LoginScreen(props) {
    const [username, setUsername] = React.useState('');
    const [pass, setPass] = React.useState('');

    function login(username, password) {
        fetch('https://reqres.in/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: username,
                password: password,
            })
        }).then(response => {
            response.json().then(value => {
                console.log(value)
           })
        }).catch(error => {
            console.log(error)
        })
       // props.navigation.navigate('Perfil')
        props.route.params['func'](true)
    }

    React.useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', () => {
        });
        return unsuscribe
    }, [props.navigation])

    return (
        <View style={styles.container}>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <View style={{marginBottom: 30}}>
                    <TextInput mode='outlined' onChangeText={(value) => setUsername(value)} style={styles.input} label="Nombre de usuario"/>
                    <TextInput mode='outlined' onChangeText={(value) => setPass(value)} style={styles.input} label="Contraseña"/>
                </View>
                <Button dark={true} compact={true} mode="contained" onPress={() => login(username, pass)}> Iniciar sesión </Button>
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
