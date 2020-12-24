import * as React from 'react';
import { View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import { geoDecode, geoEncode } from '../utils';
import { Icon } from 'react-native-elements';

export default function Map(props) {
    const [text, setText] = React.useState('')
    const [coordinates, setCoordinates] = React.useState([0, 0])

    async function handleFind(text) {
        try {
            var coordinates = await geoEncode(text)
            console.log('geoencoding return')
            console.log(coordinates)
            setCoordinates([coordinates.latitude, coordinates.longitude])
            props.onChangeCoordinates([coordinates.latitude, coordinates.longitude])
        } catch(e) {
            alert(e)
        }
    }

    async function handleDragEnd(latitude, longitude) {
        var address = await geoDecode(latitude, longitude)
        setText(address.address)
        props.onChangeCoordinates([latitude, longitude])
    }

    React.useEffect(() => {
        setCoordinates(props.coordinates)
        geoDecode(props.coordinates[0], props.coordinates[1]).then(address => {
            setText(address.address)
        })
    }, [props.coordinates])

   return (
        <View style={{margin: 5, justifyContent: 'center', alignItems: 'stretch'}}>
            <Text style={{fontWeight: 'bold'}}> Dirección </Text>
            <View style={{alignItems: 'center', flexDirection: 'row' }}>
                <TextInput
                    style={{flex: 1}}
                    onChangeText={text => { setText(text) }}
                    value={text}
                    mode='outlined'
                />
                <Icon onPress={() => handleFind(text)} name='location' type='evilicon' color='black' size={50}/>
            </View>
            <View>
                <MapView
                    style={{height: 200, width: 310, margin: 10}}
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
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    multiline: {
        flex: 1,
        width: 330,
        height: 150,
        paddingBottom: 20,
    }
})


