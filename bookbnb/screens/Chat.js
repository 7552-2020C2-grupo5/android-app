import * as React from 'react';
import {
  AsyncStorage, View, ScrollView, StatusBar, Text, Title, StyleSheet,
} from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { SimpleTextInput } from '../components/components';
import { UserContext } from '../context/userContext';

// @reset refresh

function Comment(props) {
  return (
    <View>
      <Text style={{
        padding: 8, fontSize: 14, flex: 1, fontWeight: 'bold',
      }}
      >
        {props.text}
      </Text>
    </View>
  );
}

function AnswerComment(props) {
  const style = {
    backgroundColor: props.own ? '#ffd' : '#fda',
    margin: 10,
    marginLeft: props.own ? 50 : 0,
    marginRight: props.own ? 0 : 50,
  };

  return (
    <Card style={style} {...props}>
      <Comment text={props.text} />
    </Card>
  );
}

export default function ChatScreen(props) {
  const { uid, requester } = React.useContext(UserContext);
  const [currentMsg, setCurrentMsg] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [dstUserID, setDstUserID] = React.useState(props.route.params.dstUserID);
  const scrollView = React.useRef();

  React.useEffect(() => {
    const refs = setupMessageListener();
    const msgKey = buildMessagesKey([uid, dstUserID]);
    return () => {
      console.log('unmounting...');
      firebase.database().ref(`metadata/${msgKey}`).off('value', refs[0]);
      firebase.database().ref(`messages/${msgKey}`).off('value', refs[1]);
    };

    //        return () => firebase.database().ref().off('value')
  }, []);

  function buildMessagesKey(userIDs) {
    return userIDs.sort().join('-');
  }

  function handleOnSend() {
    const msgRoute = `messages/${buildMessagesKey([uid, dstUserID])}/${Date.now()}`;
    const msg = {
      from: uid,
      msg: currentMsg,
    };
    firebase.database().ref(msgRoute).set(msg);
    setCurrentMsg('');
  }

  async function _buildChatMetadata(usersIDs) {
    const metadata = {
      members: {},
    };
    for (const userID of usersIDs) {
      let userData = null;
      await requester.profileData(userID, response => {
        userData = response.content();
      });
      metadata.members[String(userID)] = {
        name: `${userData.first_name} ${userData.last_name}`,
        profilePic: userData.profile_picture,
      };
    }
    metadata.lastMsg = '';
    return metadata;
  }

  function setupMessageListener() {
    const msgKey = buildMessagesKey([uid, dstUserID]);
    const ref1 = firebase.database().ref(`metadata/${msgKey}`).on('value', (snapshot) => {
      if (!snapshot.val()) {
        _buildChatMetadata([uid, dstUserID]).then((value) => firebase.database().ref(`metadata/${msgKey}`).set(value));
      }
    });
    const ref2 = firebase.database().ref(`messages/${msgKey}`).on('value', (snapshot) => {
      const messages_ = snapshot.val();
      if (messages_) {
        setMessages(Object.values(messages_));
      }
    });
    /* Para el cleanup de los hooks de firebase */
    return [ref1, ref2];
  }

  return (
    <View style={{
      margin: 10, flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'stretch',
    }}
    >
      <ScrollView
        ref={scrollView}
        onContentSizeChange={() => { scrollView.current.scrollToEnd({ animated: true }); }}
        style={{ flex: 1, margin: 10 }}
      >
        {
                    messages.map((message) => (
                      <AnswerComment key={uuidv4()} own={message.from == uid} text={message.msg} />
                    ))
                }
      </ScrollView>
      <Divider />
      <View style={{ flex: 0.3, alignItems: 'stretch' }}>
        <SimpleTextInput placeholder="Escribe una consulta..." value={currentMsg} onChangeText={(value) => { setCurrentMsg(value); }} />
        <Button mode="contained" onPress={handleOnSend}>Enviar</Button>
      </View>
    </View>
  );
}

export { ChatScreen };
