import * as React from 'react';
import * as firebase from 'firebase';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './screens/Profile'
import { LoginScreen } from './screens/Login'
import { PublicationsScreen } from './screens/Publications'
import { PublicationScreen } from './screens/Publication'
import { ReservationsScreen } from './screens/Reservations'
import { RecomendationsScreen } from './screens/Recomendations'
import { NewPublicationScreen } from './screens/NewPublication'
import { SearchScreen } from './screens/Search'
import { View, StatusBar, Text, StyleSheet, SafeAreaView } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SnackBar } from './components/components';
import { SafeAreaStyle } from './styles/GlobalStyles';
import Geocoder from 'react-native-geocoding';


//@refresh reset

var firebaseConfig = {
  apiKey: "AIzaSyCEZML3QG8KaNvYS2LgTzp_ElHXGICHYGU",
  authDomain: "bookbnb-3c67c.firebaseapp.com",
  storageBucket: 'bookbnb-3c67c.appspot.com',
};

Geocoder.init(firebaseConfig.apiKey)

if (!firebase.apps.length) {
  console.log('Inicializando app de firebase')
  firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function Publications() {
  return (
    <Stack.Navigator initialRouteName="Publicaciones">
      <Stack.Screen name="Publicaciones" component={PublicationsScreen} options={{headerShown: false}}/>
      <Stack.Screen name="new_publication" component={NewPublicationScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Publicacion" component={PublicationScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

function Screens() {
  const [logged, setLogged] = React.useState(true);

  React.useEffect(() => {
    console.log(`Logged = ${logged}`)
  }, [logged])


  return (
    <NavigationContainer>
      { logged == false? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={LoginScreen} initialParams={{func: setLogged}} options={{headerShown: false}}/>
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator initialRouteName="Recomendaciones">
          <Drawer.Screen name="Mis Recomendaciones" options={{headerShown: false}} component={RecomendationsScreen} />
          <Drawer.Screen name="Buscar" options={{headerShown: false}} component={SearchScreen} />
          <Drawer.Screen name="Perfil" options={{headerShown: false}} component={ProfileScreen} />
          <Drawer.Screen name="Mis Reservas" options={{headerShown: false}} component={ReservationsScreen} />
          <Drawer.Screen name="Mis Publicaciones" options={{headerShown: false}} component={Publications} />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaView style={SafeAreaStyle.droidSafeArea}>
      <Screens/>
    </SafeAreaView>
  );
}
