import * as React from 'react';
import { View, Text } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
import { AppLogo } from '../components/components';
import { UserContext } from '../context/userContext';
import { LoadableView } from '../components/loading';

export default function LogoutScreen({ route, navigation }) {
  const { token, cleanCtx, requester } = React.useContext(UserContext);

  async function doLogout() {
    console.log('logging out...')
    await requester.userLogout(token, async response => {
      if(response.hasError()) {
        props.navigation.goBack(null);
        return alert(response.description())
      }
      await cleanCtx()
      console.log("*** finished logging out ****")
    });
  }

  React.useEffect(() => navigation.addListener('focus', () => {
    doLogout();
  }), []);


  return (
    <LoadableView loading={true} message="Cerrando sesión"/>
  );
}

export { LogoutScreen };
