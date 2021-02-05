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
  /* Reservas asociadas a una publicación, filtramos aquellas
   * reservas que hayan sido efectuadas con ese publication_id
   */
  const { uid, token, requester } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);

  function _fetchReservationsData() {
    requester.bookings({ publication_id: publication.id }, response => {
      const _reservations = response.content();
      setReservations([]);
      for (const reservation of _reservations) {
        requester.profileData(reservation.tenant_id, response => {
          let ownerData = response.content();
          reservation.title = publication.title;
          reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
          reservation.expired = _reservationIsExpired(reservation);
          setReservations(reservations.concat([reservation]));
        });
      }
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
  /* Vista de 'Mis reservaciones', buscamos las reservaciones
   * que hayan sido efectúadas con nuestro uid */
  /* Se asume que el uid es el del ctx */
  const { uid, token, requester } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);

  //TODO: corregir caso en que se fetchean las reservas pero no aparecen en la
  //      pantalla hasta que se monta nuevamente
  function _fetchReservationsData() {
    requester.bookings({ tenant_id: uid }, response => {
      requester.profileData(uid, profileResponse => {
        const _reservations = response.content();
        const ownerData = profileResponse.content();
        setReservations([]);
        for (const reservation of _reservations) {
          requester.getPublication(Number(reservation.publication_id), publicationResponse => {
            const relatedPublication = publicationResponse.content();
            reservation.title = relatedPublication.title;
            reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
            reservation.expired = _reservationIsExpired(reservation);
            setReservations(reservations.concat([reservation]));
          });
        }
      });
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
  /* Vista pricipal de reservaciones, muestra cada reservación
   * con una tarjetita y sus datos */

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
