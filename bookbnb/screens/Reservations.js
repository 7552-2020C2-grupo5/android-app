import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';
import { UserContext } from '../context/userContext';

function _reservationIsExpired(reservation) {
  const finalDate = new Date(reservation.final_date);
  const actualDate = new Date();
  return (actualDate.getTime() > finalDate.getTime());
}

function PublicationRelatedReservationList({ publication, navigationRef }) {
  /* Reservas asociadas a una publicación */
  const { uid, token, requester } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);

  function _fetchReservationsData() {
    const publication_id = publication.id;
    requester.reservations({ publication_id }).then(async (reservations) => {
      const ownerData = await requester.profileData({ id: uid });
      for (const reservation of reservations) {
        try {
          const ownerData = await requester.profileData({ id: reservation.tenant_id });
          reservation.title = publication.title;
          reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
          reservation.expired = _reservationIsExpired(reservation);
        } catch (e) { }
      }
      setReservations(reservations);
    });
  }

  React.useEffect(() => navigationRef.addListener('focus', () => {
    _fetchReservationsData();
  }), []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {reservations.map((reservation, i) => {
        const actions = [];
        if (reservation.expired) {
          actions.push({
            title: 'Calificar huésped',
            onAction: () => {
              navigationRef.navigate('reviews', {
                user_id: reservation.tenant_id,
                reservation_id: reservation.id,
                editing: true,
              });
            },
          });
        }
        return (<ReservationCard actions={actions} key={i} reservation={reservation} />);
      })}
    </View>
  );
}

function OwnReservationsList({ navigationRef }) {
  /* Se asume que el uid es el del ctx */
  const { uid, token, requester } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);

  function _fetchReservationsData() {
    requester.reservations({ tenant_id: uid }).then(async (reservations) => {
      for (const reservation of reservations) {
        try {
          const relatedPublication = await requester.getPublication(Number(reservation.publication_id));
          const ownerData = await requester.profileData({ id: uid });
          reservation.title = relatedPublication.title;
          reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
          reservation.expired = _reservationIsExpired(reservation);
        } catch (e) { }
      }
      setReservations(reservations);
    });
  }

  React.useEffect(() => navigationRef.addListener('focus', () => {
    _fetchReservationsData();
  }), []);

  return (
    <View style={{ flex: 1, padding: 10 }}>
      {reservations.map((reservation, i) => {
        const actions = [];
        if (reservation.expired) {
          actions.push({
            title: 'Calificar lugar',
            onAction: () => {
              navigationRef.navigate('reviews', {
                editing: true,
                reservation_id: reservation.id,
                publication_id: reservation.publication_id,
              });
            },
          });
        }
        return (<ReservationCard actions={actions} key={i} reservation={reservation} />);
      })}
    </View>
  );
}

export function ReservationsScreen({ navigation, route }) {
  const [, setTick] = React.useState(0);

  React.useEffect(() => navigation.addListener('focus', () => {
    setTick((tick) => tick + 1);
  }), []);

  return (
    <View style={{ flex: 1, backgroundColor: 'grey' }}>
      <ScrollView>
        {route.params && route.params.publication ? (
          <PublicationRelatedReservationList
            navigationRef={navigation}
            publication={route.params.publication}
          />
        ) : (
          <OwnReservationsList navigationRef={navigation} />
        )}
      </ScrollView>
    </View>
  );
}
