import * as React from 'react';
import * as firebase from 'firebase';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './screens/Profile'
import { LoginScreen } from './screens/Login'
import { PublicationsScreen } from './screens/Publications'
import { PublicationScreen } from './screens/Publication'
import { ReservationsScreen } from './screens/Reservations'
import { RecomendationsScreen } from './screens/Recomendations'
import { SearchScreen } from './screens/Search'
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SnackBar } from './components/components';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

var firebaseConfig = {
  apiKey: "AIzaSyCt6nmt87OkmIYj8EqS4Xwev_Dr_jEmxnE",
  authDomain: "bookbnb-3c67c.firebaseapp.com",
};
firebase.initializeApp(firebaseConfig);

//@refresh reset

function Publications() {
  return (
    <Stack.Navigator initialRouteName="Publicaciones">
      <Stack.Screen name="Publicaciones" component={PublicationsScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Publicacion" component={PublicationScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

export default function App() {
  const [logged, setLogged] = React.useState(false);

  React.useEffect(() => {
    console.log('hare')
  }, [])


  return (
    <NavigationContainer>
      { logged == false? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={LoginScreen} initialParams={{func: setLogged}} options={{headerShown: false}}/>
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator initialRouteName="Recomendaciones">
          <Drawer.Screen name="Mis Recomendaciones" component={RecomendationsScreen} />
          <Drawer.Screen name="Buscar" component={SearchScreen} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} />
          <Drawer.Screen name="Mis Reservas" component={ReservationsScreen} />
          <Drawer.Screen name="Mis Publicaciones" component={Publications} />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}
