import * as React from 'react';
import * as firebase from 'firebase';
/* TODO. esto se debería pasar a módulos aparte, módulo de publication ,etc */
import { ProfileScreen } from './screens/Profile';
import { LoginScreen } from './screens/Login';
import { PublicationsScreen } from './screens/Publications';
import { PublicationScreen } from './screens/Publication';
import { ReservationsScreen } from './screens/Reservations';
import { RecomendationsScreen } from './screens/Recomendations';
import { NewPublicationScreen } from './screens/NewPublication';
import { NewReservationScreen } from './screens/NewReservation';
import { RegistrationScreen } from './screens/Register';
import { EditProfileScreen } from './screens/EditProfile';
import { LogoutScreen } from './screens/Logout';
import { MyChatsScreen } from './screens/MyChats';
import { ChatScreen } from './screens/Chat';
import { SearchScreen } from './screens/Search';
import { ReviewScreen } from './screens/Review';
import { View, StatusBar, Text, StyleSheet, SafeAreaView, AsyncStorage } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaStyle } from './styles/GlobalStyles';
import { UserContextProvider, UserContext } from './context/userContext';
import * as RootNavigation from './screens/RootNavigation';
import { NotificationsHandler } from './components/notifications';

//@refresh reset

var firebaseConfig = {
  apiKey: "AIzaSyCEZML3QG8KaNvYS2LgTzp_ElHXGICHYGU",
  authDomain: "bookbnb-3c67c.firebaseapp.com",
  storageBucket: 'bookbnb-3c67c.appspot.com',
  databaseURL: 'https://bookbnb-3c67c.firebaseio.com/',
};

if (!firebase.apps.length) {
  console.log('Inicializando app de firebase')
  firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


function Publications() {
  return (
    <Stack.Navigator initialRouteName="Publicaciones">
      <Stack.Screen name="Publicaciones" component={PublicationsScreen} initialParams={{own: true}} options={{headerShown: false}}/>
      <Stack.Screen name="new_publication" component={NewPublicationScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Publicacion" component={PublicationScreen} options={{headerShown: false}}/>
      <Stack.Screen name="UserProfile" component={ProfileScreen} options={{headerShown: false}}/>
      <Stack.Screen name="chatConversation" component={ChatScreen} options={{headerShown: false}}/>
      <Stack.Screen name="reviews" component={ReviewScreen} options={{headerShown: false}}/>
      <Stack.Screen name="relatedBookings" component={ReservationsScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator initialRouteName="Profile">
      <Stack.Screen name="Profile" component={ProfileScreen} initialParams={{allowEditing: true}}  options={{headerShown: false}}/>
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{headerShown: false}}/>
      <Stack.Screen name="reviews" component={ReviewScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

function Search() {
  return (
    <Stack.Navigator initialRouteName="SearchQuery">
      <Stack.Screen name="SearchQuery" component={SearchScreen} options={{headerShown: false}}/>
      <Stack.Screen name="SearchResults" component={PublicationsScreen} initialParams={{own: false}} options={{headerShown: false}}/>
      <Stack.Screen name="UserProfile" component={ProfileScreen} options={{headerShown: false}}/>
      <Stack.Screen name="Publicacion" component={PublicationScreen} options={{headerShown: false}}/>
      <Stack.Screen name="newReservation" component={NewReservationScreen} options={{headerShown: false}}/>
      <Stack.Screen name="reviews" component={ReviewScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

function Chat() {
  return (
    <Stack.Navigator initialRouteName="chats">
      <Stack.Screen name="chats" component={MyChatsScreen} options={{headerShown: false}}/>
      <Stack.Screen name="_chatConversation" component={ChatScreen} options={{headerShown: false}}/>
    </Stack.Navigator>
  );
}

const Screens = () => {
    const { token } = React.useContext(UserContext);

    return (
        <NavigationContainer ref={RootNavigation.navigationRef}>
          { token == null? (
            <Stack.Navigator>
              <Stack.Screen name="Login" component={LoginScreen} options={{headerShown: false}}/>
              <Stack.Screen name="Register" component={RegistrationScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
          ) : (
            <Drawer.Navigator>
              <Drawer.Screen name="Mis Recomendaciones" options={{headerShown: false}} component={RecomendationsScreen} />
              <Drawer.Screen name="Buscar" options={{headerShown: false}} component={Search} />
              <Drawer.Screen name="Perfil" options={{headerShown: false}} component={Profile} />
              <Drawer.Screen name="Mis Reservas" options={{headerShown: false}} component={ReservationsScreen} />
              <Drawer.Screen name="Mis Publicaciones" options={{headerShown: false}} component={Publications} />
              <Drawer.Screen name="Mis consultas" options={{headerShown: false}} component={Chat} />
              <Drawer.Screen name="Salir" options={{headerShown: false}} component={LogoutScreen} />
            </Drawer.Navigator>
          )}
        </NavigationContainer>
    );
}


export default function App() {
    return (
        <SafeAreaView style={SafeAreaStyle.droidSafeArea}>
            <UserContextProvider>
                <NotificationsHandler>
                    <Screens/>
                </NotificationsHandler>
            </UserContextProvider>
        </SafeAreaView>
    );
}
