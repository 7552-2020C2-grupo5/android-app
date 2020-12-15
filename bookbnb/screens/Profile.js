import * as React from 'react';
import { DataTable, Avatar } from 'react-native-paper';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { ProfileRowData } from '../components/components';
import { Requester } from '../requester/requester';
import { Icon } from 'react-native-elements';


export default function ProfileScreen(props) {
    const [userData, setUserData] = React.useState({
        id: null,
        firstName: 'nothing',
        lastName: 'nothing',
        email: 'nothing',
        avatar: 'nothing',
        registerDate: ''
    });

    var requester = new Requester()

    async function fetchData() {
        AsyncStorage.getItem('userID').then(userID => {
            requester.profileData({id: userID}).then(userData => {
                setUserData({
                    id: userID,
                    firstName: userData.first_name,
                    lastName: userData.last_name,
                    avatar: userData.profile_picture,
                    email: userData.email,
                    registerDate: new Date(userData.register_date).toDateString(),
                })
            })
        }).catch(e => {
            console.log(`No se encontró userID = ${userID}`)
        });
    }

    React.useEffect(() => {
        const unsuscribe = props.navigation.addListener('focus', () => {
            fetchData()
        })

        return unsuscribe;
    }, []);

    return (
        <View style={{flex: 1}}>
            <View style={styles.container}>
                <Avatar.Image size={110} source={{uri: userData.avatar}} style={{margin: 50}}/>
                { /* Ver como alinearlo a la derecha */ }
                <View>
                    <Icon onPress={() => props.navigation.navigate('EditProfile', {userData: userData})} name='pencil' type='evilicon' color='black' size={40}/>
                </View>
                <DataTable>
                    <ProfileRowData keyValue="Nombre" value={userData.firstName}/>
                    <ProfileRowData keyValue="Apellido" value={userData.lastName}/>
                    <ProfileRowData keyValue="Email" value={userData.email}/>
                    <ProfileRowData keyValue="Fecha de registro" value={userData.registerDate}/>
                </DataTable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 20,
    },
});

export { ProfileScreen }

