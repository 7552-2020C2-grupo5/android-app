import * as React from 'react';
import {
  Button, AsyncStorage, View, ScrollView, StatusBar, Text, Title, StyleSheet,
} from 'react-native';
import { Card, Avatar } from 'react-native-paper';
import { ListItem, Icon } from 'react-native-elements';
import * as firebase from 'firebase';
import { v4 as uuidv4 } from 'uuid';
import { UserContext } from '../context/userContext';
import { LoadableView } from '../components/loading';
import InformationText from "../components/InformationText";

// @reset refresh

export function MyChatsScreen(props) {
  const { uid, token, setToken } = React.useContext(UserContext);
  const [conversations, setConversations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  function _getOppositeUserID(usersIDs) {
    const oppositeUser = usersIDs[0] == uid ? usersIDs[1] : usersIDs[0];
    return oppositeUser;
  }

  async function setupMessageListener() {
    firebase.database().ref('metadata').on('value', (snapshot) => {
      const conversations_ = snapshot.val();
      const myChatsKeys = Object.keys(conversations_).filter((k) => (k.split('-').includes(String(uid))));
      const __conversations = {};
      myChatsKeys.forEach((chatKey) => {
        __conversations[chatKey] = conversations_[chatKey];
      });
      setConversations(__conversations);
      setLoading(false);
    });
  }

  React.useEffect(() => {
    setupMessageListener();
  }, []);

  const DEFAULT_USER_IMG = 'https://i0.wp.com/www.repol.copl.ulaval.ca/wp-content/uploads/2019/01/default-user-icon.jpg';

  const renderConversations = () => {
    const numberOfConversationsAvailable = Object.keys(conversations).length;
    if (numberOfConversationsAvailable === 0) {
      return (
        <InformationText message={"No hay conversaciones disponibles para mostrar"}/>
      );
    }
    return (
      <React.Fragment>
        {
          Object.keys(conversations).map((chat, i) => {
            const dstUserID = _getOppositeUserID(chat.split('-'));
            const userData = conversations[chat].members[dstUserID];
            return (
              <>
                <ListItem
                  onPress={() => {
                    props.navigation.navigate('_chatConversation', {
                      dstUserID,
                    });
                  }}
                  key={uuidv4()}
                >
                  <Avatar.Image key={uuidv4()} source={{ uri: userData.profilePic || DEFAULT_USER_IMG }} size={40} />
                  <Text key={uuidv4()}>{userData.name}</Text>
                </ListItem>
              </>
            );
          })
        }
      </React.Fragment>
    );
  };

  return (
    <LoadableView loading={loading} message="Buscando tus consultas">
      {renderConversations()}
    </LoadableView>
  );
}
