import * as React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { PublicationCardMinimal, AddNewButton } from '../components/components';
import { Divider } from 'react-native-paper';
import { Requester } from '../requester/requester';
import { SafeAreaStyle } from '../styles/GlobalStyles';
import { UserContext } from '../context/userContext';

//@refresh reset

export default function PublicationsScreen({route, navigation}) {
    const { uid, token, setToken, requester } = React.useContext(UserContext);
    const [publications, setPublications] = React.useState([])

    const fillPublications = () => {
        var searchParams = route.params.searchParams || {}
        if (route.params.own) {
            searchParams = {
                user_id: uid
            }
        }
        requester.searchPublications(searchParams).then(publications => {
           setPublications(publications)
        })
    }

    React.useEffect(() => {
        return navigation.addListener('focus', () => {
            fillPublications()
        });
    }, [])

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={styles.publication}>
                    {publications.map((publication, index) => {
                        let actions = []
                        if (route.params.own && String(publication.user_id) == uid) {
                            actions.push({
                                title: 'Editar',
                                onAction: () => {
                                    navigation.navigate('new_publication', {
                                        publication: publication, editing: true
                                    })
                                }
                            })
                        }
                        if (String(publication.user_id) != uid) {
                            actions.push({
                                title: 'Reservar',
                                onAction: () => {
                                    navigation.navigate('newReservation', {publication: publication})
                                }
                            })
                        }
                        return (
                            <PublicationCardMinimal
                                actions={actions}
                                key={index}
                                onPress={() => {
                                    navigation.navigate('Publicacion', {publication: publication})
                                }}
                                publication={publication}
                            />
                        );
                    })}
                </View>
            </ScrollView>
            { route.params.own &&
                <AddNewButton onPress={() => navigation.navigate('new_publication', {editing: false})}/>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    publication:  {
        padding: 10,
        flex: 1,
    },
});

export { PublicationsScreen }
