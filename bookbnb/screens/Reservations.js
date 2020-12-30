import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';
import { UserContext } from '../context/userContext';


function _reservationIsExpired(reservation) {
    let finalDate = new Date(reservation.final_date)
    let actualDate = new Date()
    return (actualDate.getTime() > finalDate.getTime())
}

function PublicationRelatedReservationList({publication}) {
    /* Reservas asociadas a una publicación */
    const { uid, token, requester } = React.useContext(UserContext);
    const [reservations, setReservations] = React.useState([]);

    function _fetchReservationsData() {
        let publication_id = publication.id;
        requester.reservations({publication_id: publication_id}).then(async reservations => {
            let ownerData = await requester.profileData({id: uid})
            for (const reservation of reservations) {
                try {
                    let ownerData = await requester.profileData({id: reservation.tenant_id})
                    reservation.title = publication.title
                    reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`
                    reservation.expired = _reservationIsExpired(reservation)
                } catch(e) { }
            }
            setReservations(reservations)
        })
    }

    React.useEffect(() => {
        _fetchReservationsData()
    }, [])

    return (
        <View style={{flex: 1, padding: 10}}>
            {reservations.map((reservation, i) => {
                return (<ReservationCard key={i} reservation={reservation}/>)
            })}
        </View>
    );
}

function OwnReservationsList() {
    /* Se asume que el uid es el del ctx */
    const { uid, token, requester } = React.useContext(UserContext);
    const [reservations, setReservations] = React.useState([]);

    function _fetchReservationsData() {
        requester.reservations({tenant_id: uid}).then(async reservations => {
            for (const reservation of reservations) {
                try {
                    var relatedPublication = await requester.getPublication(Number(reservation.publication_id))
                    let ownerData = await requester.profileData({id: uid})
                    reservation.title = relatedPublication.title
                    reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`
                    reservation.expired = _reservationIsExpired(reservation)
                } catch(e) { }
            }
            setReservations(reservations)
        })
    }

    React.useEffect(() => {
        _fetchReservationsData()
    }, [])

    return (
        <View style={{flex: 1, padding: 10}}>
            {reservations.map((reservation, i) => {
                return (<ReservationCard key={i} reservation={reservation}/>)
            })}
        </View>
    );
}


export function ReservationsScreen({navigation, route}) {
    const [, setTick] = React.useState(0);

    React.useEffect(() => {
        return navigation.addListener('focus', () => {
            setTick(tick => tick + 1)
        });
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: 'grey'}}>
            <ScrollView>
                {route.params && route.params.publication? (
                    <PublicationRelatedReservationList publication={route.params.publication}/>
                ): (
                    <OwnReservationsList/>
                )}
            </ScrollView>
        </View>
    );
}
