import * as React from 'react';
import { View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { geoDecode, geoEncode } from '../utils';

export default function Map(props) {
    const [text, setText] = React.useState('')
    const [coordinates, setCoordinates] = React.useState([0, 0])

    async function handleFind(text) {
        try {
            var coordinates = await geoEncode(text)
            console.log(coordinates)
            setCoordinates([coordinates.latitude, coordinates.longitude])
        } catch(e) {
            alert(e)
        }
    }

    async function handleDragEnd(latitude, longitude) {
        var address = await geoDecode(latitude, longitude)
        console.log(address)
        setText(address)
    }

    return (
        <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
            <View>
                <TextInput dense={true} onChangeText={text => { setText(text) }} label='' {...props} mode='outlined' style={styles.input}/>
            </View>
            <MapView
                style={{height: 300, width: 300}}
                region={{latitude: coordinates[0], longitude: coordinates[1], latitudeDelta: 0.0922, longitudeDelta: 0.0421,}}
            >
                <Marker
                    draggable
                    coordinate={{latitude: coordinates[0], longitude: coordinates[1]}}
                    onDragEnd={e => handleDragEnd(
                        e.nativeEvent.coordinate.latitude,
                        e.nativeEvent.coordinate.longitude
                    )}
                />
            </MapView>
            <Button mode="contained" dark={true} onPress={() => handleFind(text)}> Buscar </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    input: {
        width: 330,
        height: 40,
        paddingBottom: 20,
    },
    multiline: {
        flex: 1,
        width: 330,
        height: 150,
        paddingBottom: 20,
    }
})


