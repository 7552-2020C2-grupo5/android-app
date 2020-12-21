import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { decodeJWTPayload } from '../utils';

const UserContext = React.createContext();

const UserContextProvider = (props) => {
    const [UID, setUID] = React.useState(null);
    const [token, _setToken] = React.useState(null);

    React.useEffect(() => {
        AsyncStorage.getItem('userContext').then(ctx => {
            if (ctx) {
                var jsonCtx = JSON.parse(ctx)
                console.log('fetched ctx: ')
                console.log(jsonCtx)
                setUID(jsonCtx.uid);
                _setToken(jsonCtx.token);
            }
        })
    }, [])

    function setToken(token) {
        /* Parsea el JWT y persiste toda la información */
        var jsonPayload = decodeJWTPayload(token)
        setUID(jsonPayload.sub)
        _setToken(token)
        var userContext = {
            uid: String(jsonPayload.sub),
            token: token
        }
        AsyncStorage.setItem('userContext', JSON.stringify(userContext))
        console.log(userContext)
        console.log('Updated token!')
    }

    return (
        <>
            <UserContext.Provider value={{uid: UID, token: token, setToken: setToken}}>
                {props.children}
            </UserContext.Provider>
        </>
    );
};

export { UserContext, UserContextProvider }
