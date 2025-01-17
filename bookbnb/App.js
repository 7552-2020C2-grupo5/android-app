import * as React from 'react';
import * as firebase from 'firebase';
/* TODO. esto se debería pasar a módulos aparte, módulo de publication ,etc */
import { SafeAreaView, AppRegistry } from 'react-native';
import { name as appName } from './app.json';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { ProfileScreen } from './screens/Profile';
import { LoginScreen } from './screens/Login';
import PublicationsScreen from './screens/Publications';
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
import { SafeAreaStyle } from './styles/GlobalStyles';
import { UserContextProvider, UserContext } from './context/userContext';
import * as RootNavigation from './screens/RootNavigation';
import { NotificationsHandler } from './components/notifications';
import Toast from 'react-native-toast-message';

// @refresh reset

const firebaseConfig = {
  apiKey: 'AIzaSyCEZML3QG8KaNvYS2LgTzp_ElHXGICHYGU',
  authDomain: 'bookbnb-3c67c.firebaseapp.com',
  storageBucket: 'bookbnb-3c67c.appspot.com',
  databaseURL: 'https://bookbnb-3c67c.firebaseio.com/',
};

if (!firebase.apps.length) {
  console.log('Inicializando app de firebase');
  firebase.initializeApp(firebaseConfig);
}

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function Recommendations({ route, navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Recomendaciones"
      headerMode="none"
    >
     <Stack.Screen
        name="Recomendaciones"
        component={RecomendationsScreen}
      />
      <Stack.Screen
        name="Publicacion"
        component={PublicationScreen}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="_chatConversation"
        component={ChatScreen}
      />
      <Stack.Screen
        name="reviews"
        component={ReviewScreen}
      />
      <Stack.Screen
        name="relatedBookings"
        component={ReservationsScreen}
      />
      <Stack.Screen
        name="newReservation"
        component={NewReservationScreen}
      />
    </Stack.Navigator>
  );
}


function Publications({ route, navigation }) {
  return (
    <Stack.Navigator
      initialRouteName="Publicaciones"
      headerMode="none"
    >
     <Stack.Screen
        name="Publicaciones"
        component={PublicationsScreen}
        initialParams={{ own: route.params.own, favorites: route.params.favorites }}
      />
      <Stack.Screen
        name="new_publication"
        component={NewPublicationScreen}
      />
      <Stack.Screen
        name="Publicacion"
        component={PublicationScreen}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="_chatConversation"
        component={ChatScreen}
      />
      <Stack.Screen
        name="reviews"
        component={ReviewScreen}
      />
      <Stack.Screen
        name="relatedBookings"
        component={ReservationsScreen}
      />
    </Stack.Navigator>
  );
}

function Profile() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ allowEditing: true }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
      />
      <Stack.Screen
        name="reviews"
        component={ReviewScreen}
      />
    </Stack.Navigator>
  );
}

function Search() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="SearchQuery"
        component={SearchScreen}
      />
      <Stack.Screen
        name="SearchResults"
        component={PublicationsScreen}
        initialParams={{ own: false }}
      />
     <Stack.Screen
        name="relatedBookings"
        component={ReservationsScreen}
      />
      <Stack.Screen
        name="UserProfile"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="_chatConversation"
        component={ChatScreen}
      />
      <Stack.Screen
        name="Publicacion"
        component={PublicationScreen}
      />
      <Stack.Screen
        name="newReservation"
        component={NewReservationScreen}
      />
      <Stack.Screen
        name="reviews"
        component={ReviewScreen}
      />
    </Stack.Navigator>
  );
}

function Chat() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="chats"
        component={MyChatsScreen}
      />
      <Stack.Screen
        name="_chatConversation"
        component={ChatScreen}
      />
    </Stack.Navigator>
  );
}

function Reservations() {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name="myReservations"
        component={ReservationsScreen}
      />
      <Stack.Screen
        name="reviews"
        component={ReviewScreen}
      />
    </Stack.Navigator>
  );
}

const Screens = () => {
  const { token } = React.useContext(UserContext);

  return (
    <NavigationContainer ref={RootNavigation.navigationRef}>
      { token == null ? (
        <Stack.Navigator headerMode="none">
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationScreen}
          />
        </Stack.Navigator>
      ) : (
        <Drawer.Navigator>
          <Drawer.Screen
            name="Mis Recomendaciones"
            component={Recommendations}
          />
          <Drawer.Screen
            name="Buscar"
            component={Search}
          />
          <Drawer.Screen
            name="Perfil"
            component={Profile}
          />
          <Drawer.Screen
            name="Mis Reservas"
            component={Reservations}
          />
          <Drawer.Screen
            name="Mis Publicaciones"
            initialParams={{ own: true, favorites: false }}
            component={Publications}
          />
          <Drawer.Screen
            name="Publicaciones favoritas"
            initialParams={{ own: false, favorites: true }}
            component={Publications}
          />
          <Drawer.Screen
            name="Mis consultas"
            component={Chat}
          />
          <Drawer.Screen
            name="Salir"
            component={LogoutScreen}
          />
        </Drawer.Navigator>
      )}
    </NavigationContainer>
  );
};

export default function App(props) {
  // TODO
  const theme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: "#1f1238",
      accent: "#3d57ff",
    },
  };
  return (
    <>
      <SafeAreaView style={SafeAreaStyle.droidSafeArea}>
        <UserContextProvider>
          <PaperProvider theme={theme}>
            <NotificationsHandler>
              <Screens />
            </NotificationsHandler>
          </PaperProvider>
        </UserContextProvider>
      </SafeAreaView>
    <Toast ref={(ref) => Toast.setRef(ref)}/>
    </>
  );
}

AppRegistry.registerComponent(appName, () => App);
