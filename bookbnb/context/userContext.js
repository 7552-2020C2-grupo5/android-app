import * as React from 'react';
import { AsyncStorage } from 'react-native';
import { decodeJWTPayload } from '../utils';
import { Requester } from '../requester/requester';

const UserContext = React.createContext();

const UserContextProvider = (props) => {
    const [UID, setUID] = React.useState(null);
    const [token, _setToken] = React.useState(null);
    const [requester, _setRequester] = React.useState(null);

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
        _setRequester(new Requester())
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

    function cleanCtx() {
        _setToken(null);
        setUID(null);
        AsyncStorage.removeItem('userContext');
    }

    return (
        <>
            <UserContext.Provider value={{uid: UID, token: token, requester: requester, setToken: setToken, cleanCtx: cleanCtx}}>
                {props.children}
            </UserContext.Provider>
        </>
    );
};

export { UserContext, UserContextProvider }
