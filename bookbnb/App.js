import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './Screens/Profile'
import { View, StatusBar, Text, StyleSheet } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Buscar" component={ProfileScreen} />
        <Drawer.Screen name="Recomendaciones" component={ProfileScreen} />
        <Drawer.Screen name="Perfil" component={ProfileScreen} />
        <Drawer.Screen name="Mis reservas" component={ProfileScreen} />
        <Drawer.Screen name="Mis publicaciones" component={ProfileScreen} />
      </Drawer.Navigator>
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
