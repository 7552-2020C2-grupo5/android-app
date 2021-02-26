import * as React from 'react';

import * as Notifications from 'expo-notifications';
import { AsyncStorage } from 'react-native';
import { decodeJWTPayload } from '../utils';
import ApiClient from '../requester/client/ApiClient';
import RemoteRequester from '../requester/requester/RemoteRequester';

const UserContext = React.createContext();

const UserContextProvider = (props) => {
    const [UID, setUID] = React.useState(null);
    const [token, _setToken] = React.useState(null);
    const [wallet_address, setWalletAddress] = React.useState(null);
    const [wallet_mnemonic, setWalletMnemonic] = React.useState(null);
    const [requester, _setRequester] = React.useState(null);
    const [pushToken, setPushToken] = React.useState(null);

    React.useEffect(() => {
        console.log('useEffect context')
        AsyncStorage.getItem('userContext').then(ctx => {
            if (ctx) {
                let jsonCtx = JSON.parse(ctx)
                console.log('Contexto encontrado: %s', jsonCtx)
                setUID(jsonCtx.uid);
                _setToken(jsonCtx.token);
                setWalletMnemonic(jsonCtx.wallet_mnemonic);
                setWalletAddress(jsonCtx.wallet_address);
            }
        })
        _setRequester(new ApiClient(new RemoteRequester(), null, token, () => {
            alert('Sesión expirada')
            cleanCtx()
        }))
    }, [])

    function setToken(token) {
        /* Parsea el JWT y persiste toda la información */
        let jsonPayload = decodeJWTPayload(token)
        setUID(jsonPayload.sub);
        setWalletMnemonic(jsonPayload.wallet_mnemonic);
        setWalletAddress(jsonPayload.wallet_address);
        _setToken(token);
        let userContext = {
            uid: String(jsonPayload.sub),
            wallet_mnemonic: jsonPayload.wallet_mnemonic,
            wallet_address: jsonPayload.wallet_address,
            token: token,
        }
        AsyncStorage.setItem('userContext', JSON.stringify(userContext))
        console.log('New userContext: %s', userContext)
        _setRequester(new ApiClient(new RemoteRequester(), null, token, () => {
            alert('Sesión expirada')
            cleanCtx()
        }))
    }

    function cleanCtx() {
        _setToken(null);
        setUID(null);
        setWalletAddress(null);
        setWalletMnemonic(null);
        AsyncStorage.removeItem('userContext');
    }

    return (
      <>
        <UserContext.Provider value={{
            uid: UID,
            token: token,
            requester: requester,
            setToken: setToken,
            cleanCtx: cleanCtx,
            addr: wallet_address,
            mnemonic: wallet_mnemonic,
            pushToken: pushToken,
            setPushToken: setPushToken
        }}>
          {props.children}
        </UserContext.Provider>
      </>
    );
};

export { UserContext, UserContextProvider }
