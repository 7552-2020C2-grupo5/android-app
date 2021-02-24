import * as React from 'react';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as RootNavigation from '../screens/RootNavigation';
import { UserContext } from '../context/userContext';
import Toast from 'react-native-toast-message';

async function registerForPushNotificationsAsync() {
  let token;
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;
}

function handleOnTouch(notification_content) {
  let data = notification_content.data

  if (data.type == 'newMessage') {
    /* TODO. ver cómo incrementar mostrar el badge desde los chats */
    RootNavigation.navigate('Mis consultas', { screen: 'reviews', params: { dstUserID: data.origin_user_id } });
  }

  if (data.type == 'publicationReview') {
    RootNavigation.navigate('Buscar', { screen: 'reviews', params: { editing: true, publication_id: data.publication_id} });
  }

  if (data.type == 'hostReview') {
    RootNavigation.navigate('Buscar', { screen: 'reviews', params: { editing: true, user_id: data.user_id } });
  }
}


function handleForegroundNotification(notification) {
  console.log("notification es %s", notification)

  //TODO: handlear caso en que no se está logeado
  let notification_content = notification.request.content
  Toast.show({
    text1: notification_content.title,
    text2: notification_content.body,
    onPress: () => { Toast.hide(); handleOnTouch(notification_content) },
  });
}

function handleBackgroundNotification(notification) {
  console.log('background notification %s', notification)

  let notification_content = notification.notification.request.content
  handleOnTouch(notification_content)
}

export function NotificationsHandler(props) {
  const { token } = React.useContext(UserContext);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    console.log('Mounting notification system!');

    registerForPushNotificationsAsync().then(token => { console.log(token) });

    // foreground
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      if (!token) {
        return Toast.show({
          text1: "Iniciar sesión",
          text2: "Parece que no estás logueado. Hacelo para recibir notificaciones",
          onPress: () => {
            RootNavigation.navigate('Login');
          },
        });
      }
      handleForegroundNotification(notification)
    });

    //background
    responseListener.current = Notifications.addNotificationResponseReceivedListener(notification => {
      if (!token) {
        return Toast.show({
          text1: "Iniciar sesión",
          text2: "Parece que no estás logueado. Hacelo para recibir notificaciones",
          onPress: () => {
            RootNavigation.navigate('Login');
          },
        });
      }
      handleBackgroundNotification(notification)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  });

  return (
    <>
      {props.children}
    </>
  );
}
