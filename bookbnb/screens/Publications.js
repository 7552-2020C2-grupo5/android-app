import * as React from 'react';
import { ScrollView, StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { PublicationCardMinimal } from '../components/components';
import { Divider } from 'react-native-paper';
import { Requester } from '../requester/requester';

export default function PublicationsScreen(props) {
    const [publications, setPublications] = React.useState([])

    let requester = new Requester()

    React.useEffect(() => {
        requester.publications().then(values => {
            setPublications(values)
        })
    }, [])

    let actualPublications = []
    for(let i = 0; i < publications.length; i++) {
        console.log(publications[i].title)
        actualPublications.push(<PublicationCardMinimal onPress={() => { props.navigation.navigate('Publicacion', {publication: publications[i]}) }} publication={publications[i]} key={i}/>)
    }

    return (
        <ScrollView>
            <View style={styles.publication}>
                {actualPublications}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    publication:  {
        padding: 10,
        flex: 1,
    },
});

export { PublicationsScreen }
