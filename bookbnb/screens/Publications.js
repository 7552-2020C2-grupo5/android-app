import * as React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { PublicationCardMinimal, AddNewButton } from '../components/components';
import { Divider } from 'react-native-paper';
import { Requester } from '../requester/requester';
import { SafeAreaStyle } from '../styles/GlobalStyles';
import { UserContext } from '../context/userContext';

//@refresh reset

export default function PublicationsScreen(props) {
    const { uid, token, setToken, requester } = React.useContext(UserContext);
    const [publications, setPublications] = React.useState([])

    const fillPublications = () => {
        var searchParams = props.route.params.searchParams || {}
        if (props.route.params.editable) {
            searchParams = {
                user_id: uid
            }
        }
        requester.searchPublications(searchParams).then(publications => {
            setPublications(publications)
        })
    }

    React.useEffect(() => {
        return props.navigation.addListener('focus', () => {
            fillPublications()
        });
    }, [])

    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <View style={styles.publication}>
                    {publications.map((publication, index) => {
                        return (
                            <PublicationCardMinimal
                                key={index}
                                onPress={() => {
                                    props.navigation.navigate('Publicacion', {publication: publication})
                                }}
                                publication={publication}
                            />
                        );
                    })}
                </View>
            </ScrollView>
            { props.route.params.editable &&
                <AddNewButton onPress={() => props.navigation.navigate('new_publication')}/>
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
