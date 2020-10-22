import * as React from 'react';
import { DataTable, Avatar } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';

var avatar_url = 'https://s.gravatar.com/avatar/4b078d8d53d96c17ef187a93db816fe8?s=80';

const ProfileRowData = (props) => {
    return (
        <DataTable.Row style={{justifyContent: 'flex-start'}}>
            <DataTable.Cell>
                <Text style={{fontWeight: 'bold'}}>{props.keyValue}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'flex-end'}}>
                <Text> {props.value} </Text>
            </DataTable.Cell>
        </DataTable.Row>
    );
}

export default function ProfileScreen(props) {
    return (
        <View style={styles.container}>
            <Avatar.Image size={110} source={{uri: avatar_url}} style={{marginTop: 50}}/>
            <DataTable>
                <ProfileRowData/>
                <ProfileRowData keyValue="Nombre" value="Tomas"/>
                <ProfileRowData keyValue="Email" value="tflopez@fi.uba.ar"/>
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

export { ProfileScreen }

