import * as React from 'react';
import { Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Divider, TextInput, Button } from 'react-native-paper';
import { Input } from 'react-native-elements';

function SimpleTextInput(props) {
    const [text, setText] = React.useState('');

    const styles = StyleSheet.create({
        input: {
            width: 330,
            height: 40,
            paddingBottom: 20,
        },
        multiline: {
            flex: 1,
            width: 330,
            height: 150,
            paddingBottom: 20,
        }
    })
    if(!props.multiline){
        return (
            <TextInput dense={true} label='' {...props} mode='outlined' style={styles.input}/>
        );
    }
    return (
        <TextInput textAlignVertical={"top"} numberOfLines={8} multiline={true} label='' {...props} mode='outlined' style={styles.multiline}/>
    );
}

function NewPublicationScreen(props) {
    return (
        <ScrollView>
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <View style={{padding: 30}}>
                    <Text style={{fontWeight: 'bold'}}> Título de la publicación </Text>
                    <SimpleTextInput/>
                    <Text style={{fontWeight: 'bold'}}> Cantidad de cuartos </Text>
                    <SimpleTextInput/>
                    <Text style={{fontWeight: 'bold'}}> Cantidad de camas </Text>
                    <SimpleTextInput/>
                    <Text style={{fontWeight: 'bold'}}> Cantidad de baños </Text>
                    <SimpleTextInput/>
                    <Text style={{fontWeight: 'bold'}}> Precio por noche </Text>
                    <SimpleTextInput/>
                    <Text style={{fontWeight: 'bold'}}> Descripción </Text>
                    <SimpleTextInput multiline={true}/>
                    <Button dark={true} mode="contained"> Publicar </Button>
                </View>
            </View>
        </ScrollView>
    );
}

export { NewPublicationScreen }

