import * as React from 'react'
import { Snackbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { AsyncStorage, StyleSheet } from 'react-native';

function PublicationCardMinimal(props) {
    return (
        <Card {...props} style={styles.publicationCard}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Content>
                <Title> {props.publication.title} </Title>
                <Paragraph>{props.publication.description}</Paragraph>
            </Card.Content>
            <Card.Actions style={styles.actions} >
            </Card.Actions>
        </Card>
    );
}

function SnackBar(props) {
    const [snackbar, setSnackbar] = React.useState(true);

    React.useEffect(() => {
        setTimeout(setSnackbar, props.timeout, false)
    }, [props.navigation])

    return (
        <Snackbar visible={snackbar}> {props.text} </Snackbar>
    );
}

const styles = StyleSheet.create({
    publicationCard: {
        margin: 7,
    },
    actions: {
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row'
    }
});

export { PublicationCardMinimal, SnackBar }
