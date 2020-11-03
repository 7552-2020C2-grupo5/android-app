import * as React from 'react'
import { Snackbar, Avatar, Button, Card, Title, Paragraph } from 'react-native-paper';
import { AsyncStorage } from 'react-native';

function Publication(props) {
    return (
        <Card {...props}>
            <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            <Card.Content>
                <Title> {props.title} </Title>
                <Paragraph>{props.description}</Paragraph>
            </Card.Content>
            <Card.Actions>
              <Button>Cancel</Button>
              <Button>Ok</Button>
            </Card.Actions>
        </Card>
    );
}

//@refresh reset

function SnackBar(props) {
    const [snackbar, setSnackbar] = React.useState(true);

    React.useEffect(() => {
        setTimeout(setSnackbar, props.timeout, false)
    }, [props.navigation])

    return (
        <Snackbar visible={snackbar}> {props.text} </Snackbar>
    );
}

export { Publication, SnackBar }
