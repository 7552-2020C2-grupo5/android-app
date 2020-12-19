import * as React from 'react';
import { AsyncStorage, Paragraph, Title, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, Chip, Card, Divider, TextInput, List } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Requester } from '../requester/requester';


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
        this.requester = new Requester()
        this.state = {
            answer: props.question.reply,
            publicationID: props.publicationID,
            question: props.question,
            selected: false,
            backgroundColor: '#ffa'
        }
    }

    toggleSelect = () => {
        if (this.state.selected) {
            this.setState({
                answer: this.state.answer,
                selected: false,
                backgroundColor: '#ffa'
            })
        } else {
            this.setState({
                answer: this.state.answer,
                backgroundColor: '#aaf',
                selected: true
            })
        }
    }

    setAnswer = (answer) => {
        console.log(`seteando answer en ${answer}, valor actual ${this.state.answer}`)
        this.requester.addAnswer({
            publicationID: this.state.publicationID,
            questionID: this.state.question.id,
            answer: answer,
        })
        if (this.state.answer) {
            return
        }
        this.setState({
            answer: answer,
            backgroundColor: '#ffa',
            selected: false,
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


function OwnerCommentsSection(props){
    /* Vista de comentarios como dueño de la publicación:
     * todas las publicaciones que se hacen responden a alguna pregunta ya hecha
     */
    const [selectedComment, setSelectedComment] = React.useState(null)
    const [currentComment, setCurrentComment] = React.useState(null)

    function handleSelectComment(ref) {
        if(!ref) {
            setSelectedComment(null)
            return
        }
        if(selectedComment) {
            selectedComment.toggleSelect()
        }
        ref.toggleSelect()
        setSelectedComment(ref)
    }

    return (
        <View style={{padding: 9}}>
            {props.questions.map(value => {
                    return <QuestionComment key={value} publicationID={props.publicationID} question={value} onPress={ref => handleSelectComment(ref)} text={value.question}/>
            })}
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

function GuestCommentsSection(props) {
    /* Vista de comentarios desde el lado del NO dueño de la publicacion:
     * todas las publicaciones que se hacen se cargan como preguntas
     */
    const [questions, setQuestions] = React.useState(props.questions)
    const [currentComment, setCurrentComment] = React.useState(null)

    let requester = new Requester();

    async function handleNewQuestion() {
        let currentUserID = await AsyncStorage.getItem('userID');
        let response = await requester.addQuestion({
            publicationID: props.publicationID,
            question: currentComment,
            userID: Number(currentUserID)
        })
        setQuestions(questions.concat([response]))
        setCurrentComment('')
    }

    return (
        <View style={{padding: 9}}>
            {
                questions.map((value, i) => {
                    return <QuestionComment key={i} publicationID={props.publicationID} question={value} text={value.question}/>
                })
            }
            <TextInput mode="outlined" value={currentComment} onChangeText={value => setCurrentComment(value)} />
            <Button onPress={handleNewQuestion}> Enviar </Button>
        </View>
    );
}

export default function PublicationScreen(props) {
    const [userID, setUserID] = React.useState(null);

    let publication = props.route.params.publication

    function handleGoToProfile() {
        props.navigation.navigate('UserProfile', {userID: publication.user_id, allowEditing: false})
    }

    React.useEffect(() => {
        let userID = AsyncStorage.getItem('userID').then(userID =>
            setUserID(userID)
        )
    }, [])

    return (
        <View>
            <ScrollView>
                <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                    <Image source={{ uri: 'https://picsum.photos/700' }} style={styles.image} />
                    <View style={{position: 'absolute', bottom: 20, right: 30}}>
                        <Icon onPress={handleGoToProfile} raised reversed={true} size={30} name='person' type='octicon' color='#f03'/>
                    </View>
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
                {userID == publication.user_id? (
                    <OwnerCommentsSection publicationID={Number(publication.id)} questions={publication.questions}/>
                ):(
                    <GuestCommentsSection publicationID={Number(publication.id)} questions={publication.questions}/>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        width: null,
        resizeMode: 'contain',
        height: 300,
    },
});

export { PublicationScreen }
