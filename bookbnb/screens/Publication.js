import * as React from 'react';
import { Paragraph, Title, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button, Chip, Card, Divider, TextInput, List } from 'react-native-paper';

//@refresh reset


function Comment(props) {
    return (
        <View style={{flexDirection: 'row', flex: 1}}>
            <Text style={{padding: 8, fontSize: 14, flex: 1, fontWeight: 'bold'}}>{props.text}</Text>
        </View>
    );
}

class QuestionComment extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            answer: null,
            selected: false,
            backgroundColor: '#ffa'
        }
    }

    toggleSelect = () => {
        if(this.state.selected){
            this.setState({
                answer: this.state.answer,
                selected: false,
                backgroundColor: '#ffa'
            })
        } else {
            this.setState({
                answer: this.state.answer,
                backgroundColor: '#aaf',
                selected: true,
            })
        }
    }

    setAnswer = (answer) => {
        if (this.state.answer) {
            return
        }
        this.setState({
            answer: answer,
            backgroundColor: this.state.backgroundColor
        })
        this.props.onPress(null)
    }

    handleOnPress = () => {
        if (this.props.onPress){
            // pasamos la ref al padre
            if(this.state.selected){
                this.props.onPress(null)
            } else {
                this.props.onPress(this)
            }
            this.toggleSelect()
        }
    }

    render() {
        return (
            <>
                <Card style={{backgroundColor: this.state.backgroundColor, margin: 7, marginLeft: 30}} onPress={this.handleOnPress}>
                    <Comment text={this.props.text}/>
                </Card>
                {this.state.answer &&
                    <>
                        <AnswerComment text={this.state.answer}/>
                    </>
                }
            </>
        );
    }
}

function AnswerComment(props) {
    return(
        <Card style={{backgroundColor: '#ffd', margin: 7, marginRight: 30}} {...props}>
            <Comment text={props.text}/>
        </Card>
    );
}


function CommentsSection(props){
    const [selectedComment, setSelectedComment] = React.useState(null)
    const [currentComment, setCurrentComment] = React.useState(null)
    const ref = React.useRef(null);

    console.log(selectedComment)

    return (
        <View style={{padding: 9}}>
            <QuestionComment text="Hola, tiene pileta?" onPress={id => setSelectedComment(id)}/>
            <QuestionComment text="Hola, tiene pileta?" onPress={id => setSelectedComment(id)}/>
            <QuestionComment text="Hola, tiene pileta?" onPress={id => setSelectedComment(id)}/>
            { selectedComment?
                <>
                    <TextInput mode="outlined" onChangeText={value => setCurrentComment(value)} />
                    <Button onPress={() => selectedComment.setAnswer(currentComment)}> Enviar </Button>
                </>
                : null
            }
        </View>
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
            <CommentsSection/>
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
