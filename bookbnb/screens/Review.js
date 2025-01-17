import * as React from 'react';
import {
  Image, AsyncStorage, Text, View, StyleSheet, Dimensions, ScrollView,
} from 'react-native';
import {
  ListItem, Rating, AirbnbRating, Divider,
} from 'react-native-elements';
import { Button } from 'react-native-paper';
import { UserContext } from '../context/userContext';
import { SimpleTextInput } from '../components/components';
import { LoadableView } from '../components/loading';
import { ToastError } from '../components/ToastError';
import InformationText from "../components/InformationText";

function Review(props) {
  return (
    <ListItem bottomDivider>
      <ListItem.Content>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <ListItem.Title>{props.review.reviewerName}</ListItem.Title>
          <AirbnbRating
            count={4}
            defaultRating={props.review.score}
            size={15}
            showRating={false}
            isDisabled
          />
        </View>
        <ListItem.Subtitle>{props.review.comment}</ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
}


function UserRating({meanScore, hasReviews}) {
  const renderNoReviews = () => {
    if (hasReviews) {
      return <React.Fragment/>
    }
    return <Text style={{marginTop: 5, fontSize: 20, color:"grey"}}>Aún no hay calificaciones disponibles</Text>
  };

  return (
    <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <AirbnbRating
          isDisabled
          count={4}
          reviews={['Muy malo', 'Malo', 'Bueno', 'Muy bueno']}
          defaultRating={meanScore}
          size={30}
        />
      {renderNoReviews()}
    </View>
  );
}


function ReviewsBox({ publicationID, userID, navigation, editing, handleFinishReview}) {
  const { uid, token, setToken, requester } = React.useContext(UserContext);
  const [reviews, setReviews] = React.useState([]);
  const [meanScore, setMeanScore] = React.useState(0);
  const [loading, setLoading] = React.useState(true);

  async function fetchReviewersDataFor(reviews) {
    const newReviews = [];
    let acumScore = 0;
    for (const review of reviews) {
      let reviewerData = null;
      await requester.profileData(review.reviewer_id, response => {
        reviewerData = response.content();
      });
      newReviews.push({
        score: review.score,
        comment: review.comment,
        reviewerName: `${reviewerData.first_name} ${reviewerData.last_name}`,
      });
      acumScore += Number(review.score);
    }
    setMeanScore(Math.round(acumScore / newReviews.length));
    setReviews(newReviews);
    setLoading(false);
  }

  function fetchReviews() {
    if (publicationID) {
      requester.publicationReviews({
        publication_id: publicationID
      }, response => {
        fetchReviewersDataFor(response.content())
      });
    }
    if (userID) {
      requester.userReviews({
        reviewee_id: Number(userID)
      }, response => {
        fetchReviewersDataFor(response.content())
      });
    }
  }

  React.useEffect(() => { fetchReviews(); }, []);

  const renderReviews = () => {
    if (reviews.length === 0 && !editing) {
      return (
        <InformationText message={"No hay calificaciones disponibles para mostrar"}/>
      );
    }
    return (
      <ScrollView>
        {reviews.map((review, i) => (
          <Review key={i} review={review} />
        ))}
        <UserRating meanScore={meanScore} hasReviews={reviews.length > 0}/>
        {
          editing &&
          <React.Fragment>
            <Divider style={{margin: 30}}/>
            <NewReviewBox onFinishReview={handleFinishReview} />
          </React.Fragment>
        }
      </ScrollView>
    );
  }

  return (
    <LoadableView loading={loading} message="Buscando calificaciones">
      {renderReviews()}
    </LoadableView>
  );
}


function NewReviewBox({ onFinishReview }) {
  const [currentReview, setCurrentReview] = React.useState('');
  const [currentScore, setCurrentScore] = React.useState(1);

  function handleFinishReview() {
    if (!currentScore)
      return ToastError("No se puede hacer una review sin puntaje")

    onFinishReview({ score: currentScore, review: currentReview });
  }

  return (
    <View>
      <View style={{flex: 1, flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 20, color:"grey", fontWeight: 'bold'}}>Ingrese una calificación</Text>
      </View>
      <AirbnbRating
        count={4}
        onFinishRating={setCurrentScore}
        reviews={['Muy malo', 'Malo', 'Bueno', 'Muy bueno']}
        defaultRating={currentScore}
        size={30}
      />
      <SimpleTextInput
        placeholder="Escribí una review..."
        value={currentReview}
        onChangeText={setCurrentReview}
      />
      <Button mode="contained" disabled={!currentReview} onPress={handleFinishReview}>Enviar</Button>
    </View>
  );
}

export function ReviewScreen({ route, navigation }) {
  const [editing, setEditing] = React.useState(editing);
  const { uid, token, setToken, requester } = React.useContext(UserContext);
  const [tick, setTick] = React.useState(0);

  function handleFinishReview({ score, review }) {
    const base_review = {
      score,
      comment: review,
      reviewer_id: Number(uid),
      booking_id: route.params.reservation_id,
    };
    if (route.params.publication_id) {
      const { publication_id } = route.params;
      requester.addPublicationReview({ ...base_review, publication_id: publication_id }, response => {
        if (response.hasError()) {
          return alert(response.description())
        }
        setEditing(false);
        setTick(tick => tick + 1)
      });
    }
    if (route.params.user_id) {
      const { user_id } = route.params;
      requester.addUserReview({ ...base_review, reviewee_id: Number(user_id) }, response => {
        if (response.hasError()) {
          return alert(response.description())
        }
        setEditing(false);
        setTick(tick => tick + 1)
      });
    }
  }

  React.useEffect(() => {
    route.params.editing && setEditing(true);
  }, []);

  return (
    <View style={{flex: 1}}>
        <ReviewsBox
          key={tick}
          publicationID={route.params.publication_id}
          userID={route.params.user_id}
          navigation={navigation}
          editing={editing}
          handleFinishReview={handleFinishReview}
        />
    </View>
  );
}
