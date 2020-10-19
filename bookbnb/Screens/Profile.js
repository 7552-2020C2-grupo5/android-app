import * as React from 'react';
import { DataTable, Avatar, List, Divider } from 'react-native-paper';
import { StyleSheet, View, Text } from 'react-native';

var avatar_url = 'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg';

const ProfileRowData = (props) => {
    return (
        <DataTable.Row>
            <DataTable.Cell>
                <Text style={{fontWeight: 'bold'}}>{props.keyValue}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'right'}}>
                <Text> {props.value} </Text>
            </DataTable.Cell>
        </DataTable.Row>
    );
}

const ProfileScreen = (props) => {
    return (
        <View style={styles.container}>
            <Avatar.Image source={avatar_url} />
            <DataTable>
                <ProfileRowData/>
                <ProfileRowData keyValue='Nombre' value='Tomás'/>
                <ProfileRowData keyValue='Email' value='tflopez@fi.uba.ar'/>
            </DataTable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#eee',
        alignItems: 'center',
        textAlign: 'center',
        padding: 30,
        justifyContent: 'top'
    },
});

export { ProfileScreen }

