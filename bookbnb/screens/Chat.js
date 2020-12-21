import * as React from 'react';
import { AsyncStorage, View, ScrollView, StatusBar, Text, Title, StyleSheet } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import * as firebase from 'firebase';
import { SimpleTextInput } from '../components/components';

//@reset refresh

function Comment(props) {
    return (
        <View>
            <Text style={{padding: 8, fontSize: 14, flex: 1, fontWeight: 'bold'}}>{props.text}</Text>
        </View>
    );
}

function AnswerComment(props) {
    const style = {
        backgroundColor: props.own? '#ffd': '#fda',
        margin: 10,
        marginLeft: props.own? 50:0,
        marginRight: props.own? 0: 50,
    }

    return(
        <Card style={style} {...props}>
            <Comment text={props.text}/>
        </Card>
    );
}


export default function ChatScreen(props) {
    const [currentMsg, setCurrentMsg] = React.useState('');
    const [messages, setMessages] = React.useState([]);
    const [myUID, setMyUID] = React.useState('');
    const [dstUserID, setDstUserID] = React.useState(props.route.params.dstUserID);

    React.useEffect(() => {
        setupMessageListener()
    }, [])

    function buildMessagesKey(userIDs) {
        return userIDs.sort().join('-')
    }

    function handleOnSend() {
        var msgRoute = `messages/${buildMessagesKey([myUID, dstUserID])}/${Date.now()}`
        var msg = {
            from: myUID,
            msg: currentMsg,
        }
        firebase.database().ref(msgRoute).set(msg)
    }

    async function setupMessageListener() {
        var uid = await AsyncStorage.getItem('userID');
        setMyUID(uid)
        var msgKey = buildMessagesKey([uid, dstUserID])
        await firebase.database().ref('members/' + msgKey).on('value', (snapshot) => {
            if (!snapshot.val()) {
                console.log(`creando conversacion para ${msgKey}`)
                firebase.database().ref('members/' + msgKey).set(msgKey.split('-'))
            }
        });
        await firebase.database().ref('messages/' + msgKey).on('value', (snapshot) => {
            const messages_ = snapshot.val();
            console.log(messages_)
            if (messages_) {
                setMessages(Object.values(messages_));
            }
        });
    }

    return (
        <View style={{margin: 10, flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'stretch'}}>
            <ScrollView style={{flex: 1, margin: 10}}>
                {
                    messages.map((message) => {
                        return (
                            <AnswerComment own={message.from == myUID} text={message.msg}/>
                        );
                    })
                }
            </ScrollView>
            <Divider/>
            <View style={{alignItems: 'center'}}>
                <SimpleTextInput onChangeText={value => { setCurrentMsg(value) }}/>
                <Button mode="contained" onPress={handleOnSend}>Enviar</Button>
            </View>
        </View>
    );
}

export { ChatScreen }
