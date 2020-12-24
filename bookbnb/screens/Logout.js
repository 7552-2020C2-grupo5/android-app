import * as React from 'react';
import { View, Text, } from 'react-native';
import { AppLogo } from '../components/components';
import { UserContext } from '../context/userContext';
import { ActivityIndicator, Colors } from 'react-native-paper';

export default function LogoutScreen(props) {
    const { token, requester, cleanCtx } = React.useContext(UserContext);

    const logout = async () => {
        try {
            await requester.logout(token);
        } catch(e) {
        }
        cleanCtx();
    }
    logout();
    return (
        <View>
            <ActivityIndicator size='large' animating={true} color={Colors.red800}/>
        </View>
    );
}

export { LogoutScreen }
