import * as React from 'react';
import { Image, AsyncStorage, Text, View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { ListItem, Rating, AirbnbRating } from 'react-native-elements';
import { UserContext } from '../context/userContext';

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

    // navigation.params.publication_id
    React.useState(() => {
        const unsuscribe = navigation.addListener('focus', () => {
            fetchReviewsInfo()
        })
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
        </View>
    );
}

export { ReviewScreen }
