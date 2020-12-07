import * as React from 'react';
import { Paragraph, Title, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Chip, Card, Divider, TextInput, List } from 'react-native-paper';

function Comment(props) {
    return (
        <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={{padding: 8, fontSize: 14, flex: 1, fontWeight: 'bold'}}>{props.text}</Text>
        </View>
    );
}

function QuestionComment(props) {
    return (
        <Card style={{backgroundColor: '#ffa', margin: 7, marginLeft: 30}}>
            <Comment text={props.text}/>
        </Card>
    );

}

function AnswerComment(props) {
    return(
        <Card style={{backgroundColor: '#ffd', margin: 7, marginRight: 30}}>
            <Comment text={props.text}/>
        </Card>
    );
}


export default function PublicationScreen(props) {
    var publication = props.route.params.publication
    return (
        <ScrollView>
            <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                <Image source={{ uri: 'https://picsum.photos/700' }} style={styles.image} />
            </View>
            <Divider/>
            <View>
                <Text style={{fontSize: 20, padding: 20, textAlign: 'center', fontWeight: 'bold'}}> {publication.title} </Text>
                <Text style={{fontSize: 15, padding: 20}}> {publication.description} </Text>
            </View>
            <Divider style={{backgroundColor: 'black'}}/>
            <List.Section>
                <List.Subheader>Información</List.Subheader>
                <List.Item title="Cantidad de cuartos" right={() => <Text>{publication.rooms}</Text>}/>
                <List.Item title="Cantidad de camas" right={() => <Text>{publication.beds}</Text>}/>
                <List.Item title="Precio por noche" right={() => <Text>ARG $ {publication.price_per_night}</Text>}/>
            </List.Section>
            <Divider/>
            <View style={{padding: 9}}>
                <QuestionComment text="Hola, tiene pileta?"/>
                <AnswerComment text="Hola, no, no tiene"/>
                <QuestionComment text="Hola, tiene cocina?"/>
                <AnswerComment text="Hola, no, no tiene"/>
            </View>
            <TextInput/>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: 900,
        resizeMode: 'contain',
        height: 300,
    },
});

export { PublicationScreen }
