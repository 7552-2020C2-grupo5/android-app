import * as React from 'react';
import { Image, AsyncStorage, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ListItem, Rating, AirbnbRating, Divider } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { UserContext } from '../context/userContext';
import { SimpleTextInput } from '../components/components';

function Review(props) {
    return(
        <ListItem bottomDivider>
            <ListItem.Content >
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                    <ListItem.Title>{props.review.reviewerName}</ListItem.Title>
                    <AirbnbRating
                        count={4}
                        defaultRating={props.review.score}
                        size={15}
                        showRating={false}
                        isDisabled={true}
                    />
                </View>
                <ListItem.Subtitle>{props.review.comment}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
}


function ReviewsBox({publicationID, userID, navigation}) {
    const { uid, token, setToken, requester } = React.useContext(UserContext);
    const [reviews, setReviews] = React.useState([]);
    const [meanScore, setMeanScore] = React.useState(0);

    async function fetchReviewersDataFor(reviews) {
        let newReviews = []
        let acumScore = 0
        for(const review of reviews) {
            let reviewerData = await requester.profileData({id: review.reviewer_id})
            newReviews.push({
                score: review.score,
                comment: review.comment,
                reviewerName: `${reviewerData.first_name} ${reviewerData.last_name}`
            })
            acumScore += Number(review.score)
        }
        setMeanScore(Math.round(acumScore / newReviews.length))
        setReviews(newReviews)
    }

    async function fetchReviews() {
        if (publicationID) {
            requester.publicationReviews({id: publicationID}).then(fetchReviewersDataFor)
        }
        if (userID) {
            requester.userReviews({id: Number(userID)}).then(fetchReviewersDataFor)
        }
    }

    React.useEffect(() => { fetchReviews() })

    return(
        <View>
            {reviews.map((review, i) => {
                return (
                    <Review key={i} review={review}/>
                );
            })}
            <AirbnbRating
                isDisabled={true}
                count={4}
                reviews={["Muy malo", "Malo", "Bueno", "Muy bueno"]}
                defaultRating={meanScore}
                size={30}
            />
        </View>
    );
}


function NewReviewBox({onFinishReview}) {
    const [currentReview, setCurrentReview] = React.useState('');
    const [currentScore, setCurrentScore] = React.useState(0);

    function handleFinishReview() {
        onFinishReview({score: currentScore, review: currentReview})
    }

    return (
        <View>
            <AirbnbRating
                count={4}
                onFinishRating={setCurrentScore}
                reviews={["Muy malo", "Malo", "Bueno", "Muy bueno"]}
                defaultRating={currentScore}
                size={30}
            />
            <SimpleTextInput
                placeholder="Escribí una review..."
                value={currentReview}
                onChangeText={setCurrentReview}
            />
            <Button mode="contained" onPress={handleFinishReview}>Enviar</Button>
        </View>
    );
}


export function ReviewScreen({route, navigation}) {
    const [editing, setEditing] = React.useState(editing);
    const { uid, token, setToken, requester } = React.useContext(UserContext);

    function handleFinishReview({score, review}) {
        var base_review = {
            score: score,
            comment: review,
            reviewer_id: Number(uid),
            booking_id: route.params.reservation_id,
        }
        if (route.params.publication_id) {
            var publication_id = route.params.publication_id
            requester.addPublicationReview({...base_review, publication_id: publication_id}).then(value => {
                setEditing(false)
            })
        }
        if (route.params.user_id) {
            var user_id = route.params.user_id
            requester.addUserReview({...base_review, reviewee_id: Number(user_id)}).then(value => {
                setEditing(false)
            })
        }
    }

    React.useEffect(() => {
        route.params.editing && setEditing(true)
    }, [])

    return (
        <View>
            <ScrollView>
                <ReviewsBox
                    publicationID={route.params.publication_id}
                    userID={route.params.user_id}
                    navigation={navigation}
                />
                <Divider/>
                {editing && <NewReviewBox onFinishReview={handleFinishReview}/>}
            </ScrollView>
        </View>
    );
}
