import * as React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { Publication } from '../components/components'
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
        actualPublications.push(<Publication title={publications[i].title} description={publications[i].description} key={i}/>)
    }

    return (
        <ScrollView>
            <Divider/>
            <View style={styles.publication}>
                {actualPublications}
            </View>
            <Divider/>
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
