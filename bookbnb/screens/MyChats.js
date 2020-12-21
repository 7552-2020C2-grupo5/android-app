import * as React from 'react';
import { Button, AsyncStorage, View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { ListItem } from 'react-native-elements';
import * as firebase from 'firebase';

//@reset refresh


export default function MyChatsScreen(props) {
    const [conversations, setConversations] = React.useState([]);
    const [myUID, setMyUID] = React.useState('');

    async function setupMessageListener() {
        myUID = await AsyncStorage.getItem('userID');
        setMyUID(myUID);
        firebase.database().ref('members').on('value', (snapshot) => {
            const conversations_ = snapshot.val();
            var myChatsKeys = Object.keys(conversations_).filter(k => {
                return (conversations_[k].includes(myUID))
            })

            console.log(`myChatKeys = ${myChatsKeys}`)

            var newConversations = {}
            myChatsKeys.forEach((chatKey) => {
                firebase.database().ref(`messages/${chatKey}`).on('value', (snapshot) => {
                    newConversations[chatKey] = snapshot;
                })
            })
            setConversations(newConversations);
        });
    }

    React.useEffect(() => {
        setupMessageListener()
    }, [])

    return (
        <View>
            {
                Object.keys(conversations).map((chat, i) => {
                    return (
                        <ListItem onPress={() => {
                            props.navigation.navigate('chatConversation', {
                                usersIDs: chat.split('-')
                            })
                        }} key={i}><Text>{chat}</Text></ListItem>
                    );
                })
            }
        </View>
    );
}

export { MyChatsScreen }
