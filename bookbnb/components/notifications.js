import * as React from 'react';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import * as RootNavigation from '../screens/RootNavigation';

function isNewMessageNotification(notification) {
    return true
}

function isFinishedBookingNotification(notification) {
    return true
}


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


export function NotificationsHandler(props) {
    const notificationListener = React.useRef();
    const responseListener = React.useRef();

    React.useEffect(() => {
        console.log('Mounting notification system!')

        registerForPushNotificationsAsync().then(token => console.log(token));

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
           console.log('Notificacion recibida!')
            console.log(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('Response recibida!')
            console.log(response)

            if (isFinishedBookingNotification(response)){
                RootNavigation.navigate('Buscar', {screen: 'reviews', params: {editing: true, user_id: 33}})
            }

            if (isNewMessageNotification(response)) {
                /* TODO. ver cómo incrementar mostrar el badge desde los chats */
                RootNavigation.navigate('Buscar', {screen: 'reviews', params: {editing: true}})
            }
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener)
            Notifications.removeNotificationSubscription(responseListener)
        }
    });

    return (
        <>
            {props.children}
        </>
    );
}
