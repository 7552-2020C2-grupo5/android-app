import * as React from 'react';
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import { PublicationCardMinimal, AddNewButton } from '../components/components';
import { UserContext } from '../context/userContext';
import { CheckBox } from 'react-native-elements';

export default function PublicationsScreen({ route, navigation }) {
  const { uid, requester, newRequester } = React.useContext(UserContext);
  const [publications, setPublications] = React.useState([]);

  const fillPublications = () => {
    let searchParams = route.params.searchParams || {};
    if (route.params.own) {
      searchParams = {
        user_id: uid,
      };
    }

    newRequester.publications(publications => {
      setPublications(publications.content());
    }, searchParams)

    //requester.searchPublications(searchParams).then((foundedPublications) => {
    //  setPublications(foundedPublications);
    //});
  };

  React.useEffect(() => navigation.addListener('focus', () => {
    fillPublications();
  }), []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <View style={styles.publication}>
          {publications.map((publication, index) => {
            const actions = [];
            if (route.params.own && String(publication.user_id) == uid) {
              actions.push({
                title: 'Editar',
                onAction: () => {
                  navigation.navigate('new_publication', {
                    publication, editing: true,
                  });
                },
              });
            }
            if (String(publication.user_id) !== String(uid)) {
              actions.push({
                title: 'Reservar',
                onAction: () => {
                  navigation.navigate('newReservation', { publication });
                },
              });
            }
            return (
              <PublicationCardMinimal
                actions={actions}
                key={index}
                onPress={() => {
                  navigation.navigate('Publicacion', { publication });
                }}
                publication={publication}
              />
            );
          })}
        </View>
      </ScrollView>
      { route.params.own
                && <AddNewButton onPress={() => navigation.navigate('new_publication', { editing: false })} />}
    </View>
  );
}

const styles = StyleSheet.create({
  publication: {
    padding: 10,
    flex: 1,
  },
});
