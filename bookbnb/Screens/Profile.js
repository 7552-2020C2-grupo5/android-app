import * as React from 'react';
import { DataTable, Avatar } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';

var avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg';

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
            <Avatar.Image size={110} src={{avatar_url}} style={{marginTop: 50}}/>
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

