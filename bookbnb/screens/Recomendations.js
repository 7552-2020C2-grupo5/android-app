import * as React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { PublicationCardMinimal, AddNewButton } from '../components/components';
import { LoadableView } from '../components/loading';
import { UserContext } from '../context/userContext';
import { CheckBox } from 'react-native-elements';
import { v4 as uuidv4 } from 'uuid';


export function RecomendationsScreen({ route, navigation }) {
  const { uid, requester } = React.useContext(UserContext);
  const [recommendations, setRecommendations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fillRecommendations = () => {
    requester.getRecommendationsByPopular({ max: 3 }, async response => {
      setLoading(false);
      if (response.hasError()) {
        return alert(response.description());
      }
      let _newRecommendations = [];
      const _recommendations = response.content().recommendations;
      for (const recommendation of _recommendations) {
        await requester.getPublication(recommendation.publication_id, response => {
          if (response.hasError())
            return alert(response.description())

          _newRecommendations.push(response.content())
        })
      }
      setRecommendations(_newRecommendations);
    })
  };

  React.useEffect(() => navigation.addListener('focus', () => {
    fillRecommendations();
  }), []);

  return (
    <LoadableView loading={loading} message='Buscando recomendaciones'>
      <ScrollView>
        <View style={styles.publication}>
          {recommendations.map((publication, index) => {
            const actions = [];
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
    </LoadableView>
  );
}

const styles = StyleSheet.create({
  publication: {
    padding: 10,
    flex: 1,
  },
});
