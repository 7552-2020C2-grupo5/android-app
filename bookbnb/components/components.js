import * as React from 'react'
import { Snackbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { AsyncStorage, StyleSheet, Text, View, TouchableHighlight } from 'react-native';

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

function AddNewButton(props) {
    const styles = StyleSheet.create({
        addNew: {
            position: 'absolute',
            bottom: 20,
            right: 20,
        },
    });
    return (
        <View style={styles.addNew}>
            <Icon
                {...props}
                underlayColor='black'
                Component={TouchableHighlight}
                raised={true}
                size={30}
                name='add'
                type='material'
                color='#5273a4'
                reverse={true}
            />
        </View>
    );
}


function AppLogo(props) {
    return (
        <Text style={styles.appLogo}> BookBnB </Text>
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
    appLogo: {
        fontSize: 50,
        margin: 30,
        fontWeight: 'bold',
    },
    publicationCard: {
        margin: 7,
    },
    actions: {
        justifyContent: 'flex-end',
        flex: 1,
        flexDirection: 'row'
    }
});

export { PublicationCardMinimal, SnackBar, AppLogo, AddNewButton }
