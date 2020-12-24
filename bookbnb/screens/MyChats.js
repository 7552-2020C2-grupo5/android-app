import * as React from 'react';
import { Button, AsyncStorage, View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { ListItem, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { UserContext } from '../context/userContext';
import { v4 as uuidv4 } from 'uuid';

//@reset refresh


export default function MyChatsScreen(props) {
    const { uid, token, setToken } = React.useContext(UserContext);
    const [conversations, setConversations] = React.useState([]);

    function _getOppositeUserID(usersIDs) {
        var oppositeUser = usersIDs[0] == uid? usersIDs[1] : usersIDs[0]
        return oppositeUser
    }

    async function setupMessageListener() {
        firebase.database().ref('metadata').on('value', (snapshot) => {
            const conversations_ = snapshot.val();
            let myChatsKeys = Object.keys(conversations_).filter(k => {
                return (k.split('-').includes(String(uid)))
            })
            var __conversations = {}
            myChatsKeys.forEach(chatKey => {
                __conversations[chatKey] = conversations_[chatKey]
            })
            setConversations(__conversations)
        });
    }

    React.useEffect(() => {
        setupMessageListener()
    }, [])

    let DEFAULT_USER_IMG = "https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg"

    return (
        <View>
            {
                Object.keys(conversations).map((chat, i) => {
                    let dstUserID = _getOppositeUserID(chat.split('-'));
                    let userData = conversations[chat]['members'][dstUserID];
                    return (
                        <>
                            <ListItem onPress={() => {
                                props.navigation.navigate('_chatConversation', {
                                    dstUserID: dstUserID
                                })
                            }} key={uuidv4()}>
                                <Avatar.Image key={uuidv4()} source={{ uri: userData.profilePic || DEFAULT_USER_IMG }} size={40}/>
                                <Text key={uuidv4()}>{userData['name']}</Text>
                            </ListItem>
                        </>
                    );
                })
            }
        </View>
    );
}

export { MyChatsScreen }
