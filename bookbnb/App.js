import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './screens/Profile'
import { LoginScreen } from './screens/Login'
import { PublicationsScreen } from './screens/Publications'
import { PublicationScreen } from './screens/Publication'
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SnackBar } from './components/components';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

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

  return (
    <NavigationContainer>
      { logged == false? (
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Login" component={LoginScreen} initialParams={{func: setLogged}} options={{headerShown: false}}/>
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator initialRouteName="Recomendaciones">
          <Drawer.Screen name="Recomendaciones" component={ProfileScreen} />
          <Drawer.Screen name="Buscar" component={ProfileScreen} />
          <Drawer.Screen name="Perfil" component={ProfileScreen} />
          <Drawer.Screen name="Reservas" component={ProfileScreen} />
          <Drawer.Screen name="Publicaciones" component={Publications} />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
