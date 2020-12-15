import * as React from 'react';
import { View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { SimpleTextInput } from '../components/components';
import { Requester } from '../requester/requester';


export default function SearchScreen(props) {
    const [minBathCount, setMinBathCount] = React.useState(0);
    const [minRoomCount, setMinRoomCount] = React.useState(0);
    const [minBedCount, setMinBedCount] = React.useState(0);
    const [maxPrice, setMaxPrice] = React.useState(null);

    var requester = new Requester();

    const handleSearch = async () => {
        var searchParams = {
            bathrooms: minBathCount,
            rooms: minRoomCount,
            beds: minBedCount
        }
        props.navigation.navigate('SearchResults', {searchParams: searchParams})
    }

    return (
        <ScrollView>
            <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
                <View>
                    <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'left', paddingBottom: 10}}> Encontrá </Text>
                    <Text style={{fontWeight: 'bold'}}> Mínima cantidad de baños </Text>
                    <SimpleTextInput style={{width: 30}} onChangeText={text => setMinBathCount(text)}/>
                    <Text style={{fontWeight: 'bold'}}> Mínima cantidad de cuartos </Text>
                    <SimpleTextInput style={{width: 30}} onChangeText={text => setMinRoomCount(text)}/>
                    <Text style={{fontWeight: 'bold'}}> Mínima cantidad de camas </Text>
                    <SimpleTextInput style={{width: 30}} onChangeText={text => setMinBedCount(text)}/>
                    <Text style={{fontWeight: 'bold'}}> Precio máximo por noche </Text>
                    <SimpleTextInput style={{width: 30}} onChangeText={text => setMaxPrice(text)}/>
                    <Button dark={true} onPress={handleSearch} mode="contained"> Buscar </Button>
                </View>
            </View>
        </ScrollView>
    );
}

export { SearchScreen }
