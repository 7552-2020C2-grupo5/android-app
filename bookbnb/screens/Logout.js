import * as React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { AppLogo } from '../components/components';
import { UserContext } from '../context/userContext';

export default function LogoutScreen(props) {
  const { token, requester, cleanCtx, newRequester } = React.useContext(UserContext);

  newRequester.userLogout(token, response => cleanCtx());

  return (
    <View>
      <ActivityIndicator size="large" animating color={Colors.red800} />
    </View>
  );
}

export { LogoutScreen };
