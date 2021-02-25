import * as React from 'react';
import { DataTable, Avatar } from 'react-native-paper';
import {
  StyleSheet, View, Text, AsyncStorage, ScrollView
} from 'react-native';
import { Icon } from 'react-native-elements';
import { ProfileRowData } from '../components/components';
import { LoadableView } from '../components/loading';
import { UserContext } from '../context/userContext';

// @refresh reset

export function ProfileScreen(props) {
  const { uid, requester, addr } = React.useContext(UserContext);
  const [loading, setLoading] = React.useState(true);
  const [walletBalance, setWalletBalance] = React.useState({});
  const [userData, setUserData] = React.useState({
    id: null,
    firstName: 'nothing',
    lastName: 'nothing',
    email: 'nothing',
    avatar: 'nothing',
    registerDate: '',
  });

  async function fetchData() {
    let { userID } = props.route.params;
    if (typeof userID === 'undefined') {
      userID = uid;
    }
      requester.profileData(userID, response => {
    try {
        if (response.hasError()) {
          alert(response.description())
          return props.navigation.goBack(null);
        }
        let userData = response.content();
        setUserData({
          id: userID,
          firstName: userData.first_name,
          lastName: userData.last_name,
          avatar: userData.profile_picture,
          email: userData.email,
          registerDate: new Date(userData.register_date).toDateString(),
        });
        setLoading(false);
} catch(e) {
      alert(e)
      setLoading(false);
    }
      });

    if (userID === uid) {
      // Solo fetcheamos data de la wallet si es nuestra
      requester.walletBalance(addr, (response) => {
        if (response.hasError())
          return alert('Fallo al fetchear wallet del usuario')

        setWalletBalance(response.content());
      })
    }
  }

  React.useEffect(() => {
    const unsuscribe = props.navigation.addListener('focus', () => {
      fetchData();
    });

    return unsuscribe;
  }, []);

 return (
    <LoadableView loading={loading} message="Accediendo a perfil">
      <ScrollView>
        <View style={styles.container}>
          {userData.avatar ? (
            <Avatar.Image size={140} source={{ uri: userData.avatar }} style={{ margin: 50 }} />
          ) : (
            <Avatar.Text size={140} label={userData.firstName[0] || '' + userData.lastName[0] || ''} style={{ margin: 50 }} />
          )}
          <View style={{ flexDirection: 'row' }}>
            {props.route.params.allowEditing
                      && <Icon onPress={() => props.navigation.navigate('EditProfile', { userData })} name="pencil" type="evilicon" color="black" size={40} />}
            {props.route.params.allowMessaging
                      && <Icon onPress={() => props.navigation.navigate('chatConversation', { dstUserID: props.route.params.userID })} name="envelope" type="evilicon" color="black" size={40} />}
            <Icon
              onPress={() => props.navigation.navigate('reviews', { user_id: userData.id })}
              size={40}
              name="like"
              type="evilicon"
            />
          </View>
          <DataTable>
            <ProfileRowData keyValue="Nombre" value={userData.firstName} />
            <ProfileRowData keyValue="Apellido" value={userData.lastName} />
            <ProfileRowData keyValue="Email" value={userData.email} />
            <ProfileRowData keyValue="Fecha de registro" value={userData.registerDate} />
            {(Number(userData.id) == uid ) &&
            <>
              <ProfileRowData keyValue="Saldo (ETH)" value={Number(walletBalance.ETH).toFixed(2)} />
              <ProfileRowData keyValue="Saldo (USD)" value={Number(walletBalance.USD).toFixed(2)} />
              <ProfileRowData keyValue="Saldo (EUR)" value={Number(walletBalance.EUR).toFixed(2)} />
            </>
            }
          </DataTable>
        </View>
      </ScrollView>
    </LoadableView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: 20,
  },
});
