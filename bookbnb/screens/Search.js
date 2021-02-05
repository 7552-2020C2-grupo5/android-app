import * as React from 'react';
import {
  View, ScrollView, StatusBar, Text, Title, StyleSheet
} from 'react-native';
import { Button, Surface, List, Divider } from 'react-native-paper';
import { SimpleTextInput, SimpleNumericInput } from '../components/components';
import { CheckBox } from 'react-native-elements';
import Map from '../components/maps';
import * as Location from 'expo-location';


export default function SearchScreen(props) {
  const [minBathCount, setMinBathCount] = React.useState('');
  const [minRoomCount, setMinRoomCount] = React.useState('');
  const [minBedCount, setMinBedCount] = React.useState('');
  const [minPrice, setMinPrice] = React.useState('');
  const [maxPrice, setMaxPrice] = React.useState('');
  const [searchRatio, setSearchRatio] = React.useState('');
  const [usingOwnLocation, setUsingOwnLocation] = React.useState(false);
  const [location, setLocation] = React.useState({latitude: 0, longitude: 0});

  const handleSearch = async () => {
    let searchParams = {}
    if (minBathCount != '') {
      searchParams.bathrooms = Number(minBathCount);
    }
    if (minRoomCount != '') {
      searchParams.rooms = Number(minRoomCount);
    }
    if (minBedCount != '') {
      searchParams.beds = Number(minBedCount);
    }
    if (maxPrice != '') {
      searchParams.price_per_night_max = Number(maxPrice);
    }
    if (minPrice != '') {
      searchParams.price_per_night_min = Number(minPrice);
    }
    if (location.latitude !== 0 && location.longitude !== 0 && searchRatio !== '') {
      searchParams.latitude = Number(location.latitude);
      searchParams.longitude = Number(location.longitude);
      searchParams.max_distance = Number(searchRatio);
    }
    props.navigation.navigate('SearchResults', { searchParams });
  };

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Se necesita permisos para acceder a la ubicación');
        return;
      }
    })();
  }, []);

  function handleToggleUseOwnLocation() {
    if (!usingOwnLocation) {
      Location.getCurrentPositionAsync({}).then(_location => {
        setLocation({
          latitude: _location.coords.latitude,
          longitude: _location.coords.longitude
        });
      }).catch(e => alert('No se pudo obtener ubicación actual'));
    }
    setUsingOwnLocation(value => !value)
  }

  function handleChangeMapCoordinates(coordinates) {
    setLocation({
      latitude: coordinates[0],
      longitude: coordinates[1]
    })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View>
          <Text style={styles.sectionBanner}>
            Encontrá
          </Text>
          <SimpleNumericInput
            onlyPositives
            label="Cantidad de baños"
            value={minBathCount}
            onChange={setMinBathCount}
            description="Cantidad de baños mínima que tiene el lugar"
           />
          <SimpleNumericInput
            onlyPositives
            label="Cantidad de cuartos"
            value={minRoomCount}
            onChange={setMinRoomCount}
            description="Cantidad de cuatros mínima que tiene el lugar"
          />
          <SimpleNumericInput
            onlyPositives
            label="Cantidad de camas"
            value={minBedCount}
            onChange={setMinBedCount}
            description="Cantidad de camas mínimas que tiene el lugar"
          />
          <SimpleNumericInput
            onlyPositives
            label="Precio mínimo"
            value={minPrice}
            onChange={setMinPrice}
            description="Precio mínimo en pesos argentinos del lugar"
          />
          <SimpleNumericInput
            onlyPositives
            label="Precio máximo"
            value={maxPrice}
            onChange={setMaxPrice}
            description="Precio máximo en pesos argentinos del lugar"
          />
          <SimpleNumericInput
            onlyPositives
            label="Radio de búsqueda (km)"
            value={searchRatio}
            onChange={setSearchRatio}
            description="Radio de búsqueda sobre la ubicación elegida. Si no se completa un radio de búsqueda no se tomará en cuenta la ubicación"
          />
          <CheckBox
            title="Utilizar mi ubicación actual"
            onPress={handleToggleUseOwnLocation}
            checked={usingOwnLocation}
          />
          {!usingOwnLocation && (
            <Map
              coordinates={[location.latitude, location.longitude]}
              onChangeCoordinates={handleChangeMapCoordinates}
            />
          )}
          <Button dark onPress={handleSearch} mode="contained"> Buscar </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  sectionBanner: {
    fontSize: 50,
    fontWeight: 'bold',
    textAlign: 'left',
    paddingBottom: 10
  },
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'stretch'
  },
});

export { SearchScreen };
