import * as React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { AppLogo } from '../components/components';
import { UserContext } from '../context/userContext';
import { LoadableView } from '../components/loading';

export default function LogoutScreen(props) {
  const { token, cleanCtx, requester } = React.useContext(UserContext);

  React.useState(() => {
    console.log('logging out...')
    requester.userLogout(token, response => {
      if(response.hasError()) {
        props.navigation.goBack(null);
        return alert(response.description())
      }
      cleanCtx()
    });
  })

  return (
    <LoadableView loading={true} message="Cerrando sesión"/>
  );
}

export { LogoutScreen };
