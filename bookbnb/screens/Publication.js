import * as React from 'react';
import { AsyncStorage, Image, ScrollView, StyleSheet, View, Text } from 'react-native';
import { Button, Card, Divider, TextInput, List, Surface } from 'react-native-paper';
import { Icon, CheckBox } from 'react-native-elements';
import { FloatingSection, FloatingButton } from '../components/components';
import { UserContext } from '../context/userContext';
import defaultPublicationImg from '../assets/default_publication_img.jpeg';
import { geoDecode } from '../utils';

function Comment(props) {
  return (
    <View style={{ flexDirection: 'row', flex: 1 }}>
      <Text style={{
        padding: 8, fontSize: 14, flex: 1, fontWeight: 'bold',
      }}
      >
        {props.text}
      </Text>
    </View>
  );
}

class QuestionComment extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      answer: props.question.reply,
      publicationID: props.publicationID,
      question: props.question,
      selected: false,
      backgroundColor: '#ffa',
    };
  }

  toggleSelect = () => {
    if (this.state.selected) {
      this.setState({
        answer: this.state.answer,
        selected: false,
        backgroundColor: '#ffa',
      });
    } else {
      this.setState({
        answer: this.state.answer,
        backgroundColor: '#aaf',
        selected: true,
      });
    }
  }

  setAnswer = (answer) => {
    this.context.newRequester.addAnswer(
      this.state.publicationID,
      this.state.question.id,
      { answer: answer },
      () => {}
    );
    if (this.state.answer) {
      return;
    }
    this.setState({
      answer,
      backgroundColor: '#ffa',
      selected: false,
    });
    this.props.onPress(null);
  }

  handleOnPress = () => {
    if (this.props.onPress) {
      // pasamos la ref al padre
      if (this.state.selected) {
        this.props.onPress(null);
      } else {
        this.props.onPress(this);
      }
    }
  }

  render() {
    return (
      <>
        <Card
          style={{ backgroundColor: this.state.backgroundColor, margin: 7, marginLeft: 30 }}
          onPress={this.handleOnPress}
        >
          <Comment text={this.props.text} />
        </Card>
        {this.state.answer && (
          <>
            <AnswerComment text={this.state.answer} />
          </>
        )}
      </>
    );
  }
}

function AnswerComment(props) {
  return (
    <Card style={{ backgroundColor: '#ffd', margin: 7, marginRight: 30 }} {...props}>
      <Comment text={props.text} />
    </Card>
  );
}

function OwnerCommentsSection(props) {
  const [selectedComment, setSelectedComment] = React.useState(null);
  const [currentComment, setCurrentComment] = React.useState(null);

  function handleSelectComment(ref) {
    if (!ref) {
      return setSelectedComment(null);
    }
    if (selectedComment) {
      selectedComment.toggleSelect();
    }
    ref.toggleSelect();
    setSelectedComment(ref);
  }

  return (
    <View style={{ padding: 9 }}>
      {props.questions.map((value) =>
        <QuestionComment
          key={value}
          publicationID={props.publicationID}
          question={value}
          onPress={handleSelectComment}
          text={value.question}
        />
      )}
      { selectedComment? (
          <>
            <TextInput mode="outlined" onChangeText={(value) => setCurrentComment(value)} />
            <Button onPress={() => selectedComment.setAnswer(currentComment)}> Enviar </Button>
          </>
        )
        : null}
    </View>
  );
}

function GuestCommentsSection(props) {
  /* Vista de comentarios desde el lado del NO dueño de la publicacion:
   * todas las publicaciones que se hacen se cargan como preguntas
   */

  const { uid, newRequester } = React.useContext(UserContext);

  const [questions, setQuestions] = React.useState(props.questions);
  const [currentComment, setCurrentComment] = React.useState(null);

  function handleNewQuestion() {
    let questionDetails = { question: currentComment, user_id: Number(uid) };
    newRequester.addQuestion(
      props.publicationID,
      questionDetails,
      response => {
        setQuestions(currentQuestions => currentQuestions.push(response.content()));
        setCurrentComment('');
      }
    );
  }

  return (
    <View style={{ padding: 9 }}>
      {questions.map((value, i) =>
          <QuestionComment
            key={i}
            publicationID={props.publicationID}
            question={value}
            text={value.question}
          />
      )}
      <TextInput style={{ padding: 5 }} multiline placeholder="Escribí una consulta..." mode="outlined" value={currentComment} onChangeText={(value) => setCurrentComment(value)} />
      <Button mode="contained" onPress={handleNewQuestion}> Consultar </Button>
    </View>
  );
}

export function PublicationScreen(props) {
  const { uid, requester, newRequester } = React.useContext(UserContext);
  const [publication, setPublication] = React.useState(props.route.params.publication);
  const [stared, setStared] = React.useState(false);

  React.useEffect(() => {
    geoDecode(publication.loc.latitude, publication.loc.longitude).then((address) => {
      setPublication((currentPublication) => ({ ...currentPublication, address }));
    });
  }, []);

  React.useEffect(() => {
    requester.getStarPublication(uid, publication.id).then((starsByUserOnPublication) => {
      const _stared = (starsByUserOnPublication.length > 0);
      setStared(_stared)
    });
  }, [])

  function handleGoToProfile() {
    props.navigation.navigate('UserProfile', {
      userID: publication.user_id,
      allowEditing: false,
      allowMessaging: true,
    });
  }

  function handleStar() {
    requester.starPublication(uid, publication.id).then(() => {
      setStared(true);
    });
  }

  function handleUnstar() {
    requester.unstarPublication(uid, publication.id).then(() => {
      setStared(false);
    });
  }

  let image_url = Image.resolveAssetSource(defaultPublicationImg).uri;
  if (props.route.params.publication.images.length) {
    image_url = props.route.params.publication.images[0].url;
  }

  if (Object.keys(publication).length === 0) return (<Text> Loading </Text>);

  return (
    <View>
      <ScrollView>
        <Text style={{ fontSize: 40, padding: 20, textAlign: 'center', fontWeight: 'bold' }} >
          {publication.title}
        </Text>
        <View style={{ flex: 1, flexDirection: 'row', padding: 10 }}>
          <Image source={{ uri: image_url }} style={styles.image} />
          <View style={{ flexDirection: 'row', position: 'absolute', bottom: 20, right: 30 }}>
            <Icon onPress={handleGoToProfile} raised reversed size={30} name="person" type="octicon" color="#f03" />
            {stared && (
              <Icon onPress={handleUnstar} raised size={30} name="favorite" type="material" color="#f03" />
            ) || (
              <Icon onPress={handleStar} raised size={30} name="favorite-border" type="material" color="#f03" />
            )}
          </View>
        </View>
        <FloatingSection titleLabel="Descripción">
          <Text style={{ justifyContent: 'flex-end', fontSize: 15, padding: 10 }}>
            {publication.description}
          </Text>
        </FloatingSection>
        <FloatingSection titleLabel="Información">
          <List.Item title="Cantidad de cuartos" right={() => <Text>{publication.rooms}</Text>} />
          <List.Item title="Cantidad de baños" right={() => <Text>{publication.bathrooms}</Text>} />
          <List.Item title="Cantidad de camas" right={() => <Text>{publication.beds}</Text>} />
          <List.Item title="Precio por noche" right={() => ( <Text> ARG ${publication.price_per_night} </Text>)} />
        </FloatingSection>
          {publication.address && (
            <FloatingSection titleLabel="Ubicación">
              <List.Item title="País" right={() => <Text>{publication.address.country}</Text>} />
              <List.Item title="Provincia" right={() => <Text>{publication.address.state}</Text>} />
              <List.Item title="Dirección" right={() => <Text>{publication.address.address}</Text>} />
            </FloatingSection>
          )}
        <FloatingButton
          buttonLabel="Calificaciones del lugar"
          onPress={() => props.navigation.navigate('reviews', { publication_id: publication.id })}
          iconName="like"
          iconType="evilicon"
        />
        {(Number(uid) === Number(publication.user_id)) && (
        <FloatingButton
          buttonLabel="Reservas asociadas"
          onPress={() => props.navigation.navigate('relatedBookings', { publication })}
          iconName="calendar"
          iconType="evilicon"
        />
       )}
        <FloatingSection titleLabel="Consultas realizadas al dueño">
          {Number(uid) === Number(publication.user_id) ? (
            <OwnerCommentsSection
              publicationID={Number(publication.id)}
              questions={publication.questions}
            />
          ) : (
            <GuestCommentsSection
              publicationID={Number(publication.id)}
              questions={publication.questions}
            />
          )}
        </FloatingSection>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: 'contain',
    aspectRatio: 1,
  },
});
