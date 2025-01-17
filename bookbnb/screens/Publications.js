import * as React from 'react';
import {
  ScrollView, StyleSheet, View,
} from 'react-native';
import { PublicationCardMinimal, AddNewButton } from '../components/components';
import { LoadableView } from '../components/loading';
import { UserContext } from '../context/userContext';
import { CheckBox } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';
import InformationText from "../components/InformationText";


export default function PublicationsScreen({ route, navigation }) {
  const { uid, requester } = React.useContext(UserContext);
  const [publications, setPublications] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fillPublications = () => {
    let searchParams = route.params.searchParams || {};
    if (route.params.own) {
      searchParams = {
        user_id: uid,
      };
    }

    if (route.params.favorites) {
      searchParams = {
        starring_user_id: uid,
      }
    }

    requester.publications(response => {
      setLoading(false);
      if (response.hasError()) {
        alert(response.description());
        return navigation.goBack(null);
      }
      setPublications(response.content());
    }, searchParams)
  };

  React.useEffect(() => navigation.addListener('focus', () => {
    fillPublications();
  }), []);

  const renderPublications = () => {
    console.log(publications);
    if (publications.length === 0) {
      return (
        <InformationText message={"No hay publicaciones disponibles para mostrar"}/>
      );
    }
    console.log("No entre")
    return (
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
                key={uuidv4()}
                onPress={() => {
                  navigation.navigate('Publicacion', { publication });
                }}
                publication={publication}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <LoadableView loading={loading} message='Buscando publicaciones'>
      {renderPublications()}
      { route.params.own
                && <AddNewButton onPress={() => navigation.navigate('new_publication', { editing: false })} />}
    </LoadableView>
  );
}

const styles = StyleSheet.create({
  publication: {
    padding: 10,
    flex: 1,
  },
});
