import * as React from 'react';
import { Dimensions, AsyncStorage, Paragraph, Title, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Avatar, Button, Chip, Card, Divider, TextInput, List, Surface } from 'react-native-paper';
import { Icon } from 'react-native-elements';
import { Requester } from '../requester/requester';
import { UserContext } from '../context/userContext';
import defaultPublicationImg from '../assets/default_publication_img.jpeg'
import { geoDecode } from '../utils';


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
                    <TextInput mode="outlined"  onChangeText={value => setCurrentComment(value)} />
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
            <TextInput style={{padding: 5}} multiline placeholder="Escribí una consulta..." mode="outlined" value={currentComment} onChangeText={value => setCurrentComment(value)} />
            <Button mode="contained" onPress={handleNewQuestion}> Consultar </Button>
        </View>
    );
}

export default function PublicationScreen(props) {
    const { uid, token, setToken } = React.useContext(UserContext);

    let publication = props.route.params.publication

    function handleGoToProfile() {
        props.navigation.navigate('UserProfile', {
            userID: publication.user_id,
            allowEditing: false,
            allowMessaging: true
        })
    }

    var image_url = Image.resolveAssetSource(defaultPublicationImg).uri
    if (props.route.params.publication.images.length) {
        image_url = props.route.params.publication.images[0].url
    }

    return (
        <View>
            <ScrollView>
                <Text style={{fontSize: 40, padding: 20, textAlign: 'center', fontWeight: 'bold'}}> {publication.title} </Text>
                <View style={{flex: 1, flexDirection: 'row', padding: 10}}>
                    <Image source={{ uri: image_url }} style={styles.image} />
                    <View style={{position: 'absolute', bottom: 20, right: 30}}>
                        <Icon onPress={handleGoToProfile} raised reversed={true} size={30} name='person' type='octicon' color='#f03'/>
                    </View>
                </View>
                <Divider/>
                <Surface style={{elevation: 2, padding: 14}}>
                    <List.Section>
                        <List.Subheader>Decripción</List.Subheader>
                        <Divider style={{backgroundColor: 'black'}}/>
                        <Text style={{justifyContent: 'flex-end', fontSize: 15, padding: 10}}> {publication.description} </Text>
                    </List.Section>
                    <List.Section>
                        <List.Subheader>Información</List.Subheader>
                        <Divider style={{backgroundColor: 'black'}}/>
                        <List.Item title="Cantidad de cuartos" right={() => <Text>{publication.rooms}</Text>}/>
                        <List.Item title="Cantidad de baños" right={() => <Text>{publication.bathrooms}</Text>}/>
                        <List.Item title="Cantidad de camas" right={() => <Text>{publication.beds}</Text>}/>
                        <List.Item title="Precio por noche" right={() => <Text>ARG $ {publication.price_per_night}</Text>}/>
                        <List.Item title="Ubicación" right={() => <Text>{
                            // TODO. falta
                            geoDecode(publication.loc.latitude, publication.loc.longitude).address
                        }</Text>}/>
                    </List.Section>
                </Surface>
                <Surface style={{elevation: 2, marginTop: 10 }}>
                    <Divider/>
                        <List.Subheader>Consultas realizadas al dueño</List.Subheader>
                    <Divider style={{backgroundColor: 'black'}}/>
                    {uid == publication.user_id? (
                        <OwnerCommentsSection publicationID={Number(publication.id)} questions={publication.questions}/>
                    ):(
                        <GuestCommentsSection publicationID={Number(publication.id)} questions={publication.questions}/>
                    )}
                </Surface>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        resizeMode: 'contain',
        aspectRatio: 1
    },
});

export { PublicationScreen }
