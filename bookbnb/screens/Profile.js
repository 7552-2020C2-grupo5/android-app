import * as React from 'react';
import { DataTable, Avatar } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';
import { ProfileRowData } from '../components/components';

var avatar_url = 'https://s.gravatar.com/avatar/4b078d8d53d96c17ef187a93db816fe8?s=80';

export default function ProfileScreen(props) {
    var initial = {
        first_name: 'nothing',
        last_name: 'nothing',
        email: 'nothing',
        avatar: 'nothing'
    }
    const [data, setData] = React.useState(initial);

    React.useEffect(() => {
        fetch('https://reqres.in/api/users/2').then((response) => {
            response.json().then((value) => {
                setData({
                    first_name: value.data.first_name,
                    last_name: value.data.last_name,
                    email: value.data.email,
                    avatar: value.data.avatar
                });
            }).catch((err) => { setData(initial) })
        }).catch((err) => {
            setData(initial)
        })
    }, []);

    return (
        <View style={styles.container}>
            <Avatar.Image size={110} source={{uri: data.avatar}} style={{marginTop: 50}}/>
            <DataTable>
                <ProfileRowData/>
                <ProfileRowData keyValue="Nombre" value={data.first_name}/>
                <ProfileRowData keyValue="Apellido" value={data.last_name}/>
                <ProfileRowData keyValue="Email" value={data.email}/>
                <ProfileRowData keyValue="Fecha de nacimiento" value="18 de marzo de 1996"/>
                <ProfileRowData keyValue="Edad" value="24 años"/>
            </DataTable>
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

export { ProfileScreen, ProfileRowData }

