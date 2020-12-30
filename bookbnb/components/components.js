import * as React from 'react'
import {
    Snackbar,
    Avatar,
    Button,
    Card,
    Title,
    Paragraph,
    DataTable,
    TextInput,
} from 'react-native-paper';

import { Icon, CheckBox } from 'react-native-elements';

import {
    AsyncStorage,
    StyleSheet,
    Text,
    View,
    TouchableHighlight,
    Dimensions,
    Image,
} from 'react-native';

import defaultPublicationImg from '../assets/default_publication_img.jpeg'

const windowWidth = Dimensions.get('window').width;


function ProfileRowData(props) {
    return (
        <DataTable.Row style={{justifyContent: 'flex-start'}}>
            <DataTable.Cell>
                <Text style={{fontWeight: 'bold'}}>{props.keyValue}</Text>
            </DataTable.Cell>
            <DataTable.Cell style={{justifyContent: 'flex-end'}}>
                <Text> {props.value} </Text>
            </DataTable.Cell>
        </DataTable.Row>
    );
}

function ReservationCard(props) {
    /* TODO. agregar estado de la reserva activa / vencida */

    return (
        <Card {...props} style={styles.reservationCard}>
            <Card.Content>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
                    <Title> {props.reservation.title} </Title>
                    <CheckBox title='Vencida' checked={props.reservation.expired} />
                </View>
                <ProfileRowData keyValue='Fecha de inicio' value={props.reservation.initial_date}/>
                <ProfileRowData keyValue='Fecha de finalización' value={props.reservation.final_date}/>
                <ProfileRowData keyValue='Owner' value={props.reservation.owner}/>
            {props.actions && props.actions.map((action, i) => {
                return (
                    <Card.Actions style={styles.actions}>
                        <Button onPress={() => {action.onAction()}}>{action.title}</Button>
                    </Card.Actions>
                );
            })}
            </Card.Content>
        </Card>
    );
}


function PublicationCardMinimal(props) {
    var image_url = Image.resolveAssetSource(defaultPublicationImg).uri
    if (props.publication.images.length) {
        image_url = props.publication.images[0].url
    }
    return (
        <Card {...props} style={styles.publicationCard}>
            {props.actions.map((action, i) => {
                return (
                    <Card.Actions style={styles.actions}>
                        <Button onPress={() => {action.onAction()}}>{action.title}</Button>
                    </Card.Actions>
                );
            })}
            <Card.Cover source={{ uri: image_url }} />
            <Card.Content>
                <Title> {props.publication.title} </Title>
                <Paragraph>{props.publication.description}</Paragraph>
            </Card.Content>
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

function SimpleTextInput(props) {
   const styles = StyleSheet.create({
        input: {
            minHeight: 70,
            minWidth: 50,
            margin: 5,
            flex: 1,
            paddingBottom: 20,
        },
    })
    if(!props.multiline){
        return (
            <TextInput dense={true} label='' {...props} mode='outlined' style={styles.input}/>
        );
    }
    return (
        <TextInput multiline label='' {...props} mode='outlined' style={styles.input}/>
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
    },
    reservationCard: {
        margin: 7,
    }
});

export { SimpleTextInput, PublicationCardMinimal, SnackBar, AppLogo, AddNewButton, ReservationCard, ProfileRowData }
