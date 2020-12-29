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
                    />
                </View>
                <ListItem.Subtitle>{props.review.comment}</ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    );
}


function ReviewScreen({route, navigation}) {
    const { uid, token, setToken, requester } = React.useContext(UserContext);
    const [reviews, setReviews] = React.useState([]);
    const [score, setScore] = React.useState(0);
    const [meanScore, setMeanScore] = React.useState(0);
    const [editing, setEditing] = React.useState(false);
    const [currentReview, setCurrentReview] = React.useState('');
    const [currentScore, setCurrentScore] = React.useState(0);

    async function _resolveReviewersData(reviews) {
        let _reviews = []
        let acumScore = 0
        for(const review of reviews) {
            let reviewerData = await requester.profileData({id: review.reviewer_id})
            _reviews.push({
                score: review.score,
                comment: review.comment,
                reviewerName: `${reviewerData.first_name} ${reviewerData.last_name}`
            })
            acumScore += Number(review.score)
        }
        setMeanScore(acumScore / reviews.length)
        setReviews(_reviews)
    }

    async function fetchReviewsInfo() {
        if (route.params.publication_id) {
            var publication_id = route.params.publication_id
            requester.publicationReviews({id: publication_id}).then(
                async reviews => _resolveReviewersData(reviews)
            )
        }
        if (route.params.user_id) {
            var user_id = route.params.user_id
            requester.userReviews({id: user_id}).then(
                async reviews => _resolveReviewersData(reviews)
            )
        }
    }

    function handleFinishReview() {
        var base_review = {
            score: currentScore,
            comment: currentReview,
            reviewer_id: uid,
        }
        if (route.params.publication_id) {
            var publication_id = route.params.publication_id
            requester.addPublicationReview({...base_review, publication_id: publication_id}).then(value => {
                setEditing(false)
            })
        }
        if (route.params.user_id) {
            var user_id = route.params.user_id
            requester.addUserReview({...base_review, reviewee_id: user_id}).then(value => {
                setEditing(false)
            })
        }
    }

    // navigation.params.publication_id
    React.useState(() => {
        const unsuscribe = navigation.addListener('focus', () => {
            fetchReviewsInfo()
        })
        route.params.editing && setEditing(true)
        return unsuscribe;
    }, [])

    return (
        <View>
            {reviews.map((review, i) => {
                return (
                    <Review key={i} review={review}/>
                );
            })}
            <AirbnbRating
                count={4}
                reviews={["Muy malo", "Malo", "Bueno", "Muy bueno"]}
                defaultRating={meanScore}
                size={30}
            />
            <Divider/>
            {editing &&
                <View>
                    <AirbnbRating
                        count={4}
                        onFinishRating={setCurrentScore}
                        reviews={["Muy malo", "Malo", "Bueno", "Muy bueno"]}
                        defaultRating={currentScore}
                        size={30}
                    />
                    <SimpleTextInput
                        placeholder="Escribe una review..."
                        value={currentReview}
                        onChangeText={setCurrentReview}
                    />
                    <Button mode="contained" onPress={handleFinishReview}>Enviar</Button>
                </View>
            }
        </View>
    );
}

export { ReviewScreen }
