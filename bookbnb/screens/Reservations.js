import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';
import { UserContext } from '../context/userContext';
import { v4 as uuidv4 } from 'uuid';
import { LoadableView } from '../components/loading';
import InformationText from "../components/InformationText";
import {ToastError} from "../components/ToastError";

function _reservationIsExpired(reservation) {
  const finalDate = new Date(reservation.final_date);
  const actualDate = new Date();
  return (actualDate.getTime() > finalDate.getTime());
}

function PublicationRelatedReservationList({ publication, navigationRef }) {
  /* Reservas asociadas a una publicación, filtramos aquellas
   * reservas que hayan sido efectuadas con ese publication_id
   */
  const { uid, token, requester, mnemonic } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  function _fetchReservationsData() {
    requester.bookings({ publication_id: publication.id }, async response => {
      const _reservations = response.content();
      let _newReservations = [];
      for (const reservation of _reservations) {
        await requester.profileData(reservation.tenant_id, response => {
          let ownerData = response.content();
          reservation.title = publication.title;
          reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
          reservation.expired = _reservationIsExpired(reservation);
          _newReservations.push(reservation);
        });
      }
      setReservations(_newReservations);
      setLoading(false);
    });
  }

  React.useEffect(() => navigationRef.addListener('focus', () => {
    setLoading(true);
    _fetchReservationsData();
  }), []);

  function handleAcceptBooking(booking) {
    requester.acceptBooking({
      tenant_id: booking.tenant_id,
      owner_id: Number(uid),
      booking_id: booking.id,
      publication_owner_mnemonic: mnemonic,
      blockchain_id: publication.blockchain_id,
      initial_date: booking.initial_date,
      final_date: booking.final_date
    }, response => {
      if(response.hasError())
        return ToastError(response.description())
      _fetchReservationsData()
    })
  }

  function handleRejectBooking(booking) {
    requester.rejectBooking({
      tenant_id: booking.tenant_id,
      booking_id: booking.id,
      publication_owner_mnemonic: mnemonic,
      blockchain_id: publication.blockchain_id,
      initial_date: booking.initial_date,
      final_date: booking.final_date
    }, response => {
      if(response.hasError())
        return ToastError(response.description())
      _fetchReservationsData()
    })
  }

  const renderReservations = () => {
    if (reservations.length === 0) {
      return <InformationText message={"No hay reservas disponibles para mostrar"}/>
    }
    return (
      <ScrollView>
        <View style={{ flex: 1, padding: 10}}>
          {reservations.map((reservation, i) => {
            const actions = [];
            if (reservation.booking_status === 'PENDING') {
              actions.push({
                title: 'Aceptar reserva',
                onAction: () => handleAcceptBooking(reservation)
              });
              actions.push({
                title: 'Rechazar reserva',
                onAction: () => handleRejectBooking(reservation)
              });
            }
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
            return (<ReservationCard actions={actions} key={uuidv4()} reservation={reservation} />);
          })}
        </View>
      </ScrollView>
    )
  }

  return (
    <LoadableView loading={loading} message="Buscando reservas">
      {renderReservations()}
   </LoadableView>
  );
}

function OwnReservationsList({ navigationRef }) {
  /* Vista de 'Mis reservaciones', buscamos las reservaciones
   * que hayan sido efectúadas con nuestro uid */
  /* Se asume que el uid es el del ctx */
  const { uid, token, requester } = React.useContext(UserContext);
  const [reservations, setReservations] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  function _fetchReservationsData() {
    requester.bookings({ tenant_id: uid }, async response => {
      requester.profileData(uid, async profileResponse => {
        const _reservations = response.content();
        const ownerData = profileResponse.content();
        let _newReservations = [];
        for (const reservation of _reservations) {
          await requester.getPublication(Number(reservation.publication_id), publicationResponse => {
            const relatedPublication = publicationResponse.content();
            reservation.title = relatedPublication.title;
            reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`;
            reservation.expired = _reservationIsExpired(reservation);
            _newReservations.push(reservation);
          });
        }
        setReservations(_newReservations);
        setLoading(false);
      });
    });
  }

  React.useEffect(() => navigationRef.addListener('focus', () => {
    setLoading(true);
    setReservations([]);
    _fetchReservationsData();
  }), []);

  const renderReservations = () => {
    if (reservations.length === 0) {
      return <InformationText message={"No tenés reservas disponibles para mostrar"}/>
    }
    return (
      <ScrollView>
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
            return (<ReservationCard actions={actions} key={uuidv4()} reservation={reservation} />);
          })}
        </View>
      </ScrollView>
    );
  };

  return (
    <LoadableView loading={loading} message="Buscando tus reservas">
      {renderReservations()}
    </LoadableView>
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
    <View style={{ flex: 1, backgroundColor: "grey"}}>
        {route.params && route.params.publication ? (
          <PublicationRelatedReservationList
            navigationRef={navigation}
            publication={route.params.publication}
          />
        ) : (
          <OwnReservationsList navigationRef={navigation} />
        )}
    </View>
  );
}
