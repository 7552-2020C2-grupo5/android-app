import * as React from 'react';
import {
  View, Text, TextInput, ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { SimpleTextInput, DateInput } from '../components/components';
import { UserContext } from '../context/userContext';
import { dateStringyfier as _dateStringyfier } from "../utils";
import { LoadableView } from "../components/loading";
import { ToastError } from "../components/ToastError";

export function NewReservationScreen({ route, navigation }) {
  const { uid, token, requester, mnemonic, addr } = React.useContext(UserContext);
  const [initialDate, setInitialDate] = React.useState(new Date());
  const [finalDate, setFinalDate] = React.useState(new Date());
  const [availableDates, setAvailableDates] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    requester.getPublication(route.params.publication.id, response => {
      if (response.hasError()) {
        ToastError('No se pudo obtener disponibilidad para la publicación')
        return setAvailableDates([])
      }
      let availableDates = response.content().bookings_dates.map(range =>
        [new Date(range.initial_date), new Date(range.final_date)]
      )
      setAvailableDates(availableDates);
      console.log(availableDates)
    })
  }, [])

  async function checkForBookingStatus(bid, onStatusConfirmed) {
    requester.booking(bid, response => {
      if (response.content().blockchain_status == 'UNSET') {
        return setTimeout(() => checkForBookingStatus(bid, onStatusConfirmed), 3000);
      }
      onStatusConfirmed(response.content());
    });
  }

  function buildBookingDetails() {
    if (initialDate >= finalDate)
      throw new Error("La fecha final debe ser después que la inicial")

    if (!initialDate || !finalDate)
      throw new Error("Falta alguna de las fechas")

    return {
      tenant_id: Number(uid),
      tenant_mnemonic: mnemonic,
      blockchain_id: route.params.publication.blockchain_id,
      publication_id: route.params.publication.id,
      price_per_night: Number(route.params.publication.price_per_night),
      initial_date: _dateStringyfier(initialDate),
      final_date: _dateStringyfier(finalDate),
    }
  }

  function handleDoReservation() {
    try {
      setLoading(true);

      let bookingDetails = buildBookingDetails()

      requester.intentBooking(bookingDetails, response => {
        if (response.hasError()) {
          setLoading(false);
          return ToastError(response.description())
        }
        checkForBookingStatus(response.content().id, () => {
          setLoading(false);
          navigation.navigate('Mis Reservas');
        })
      });
    } catch(e) {
      setLoading(false);
      console.log('ERROR: %s', e)
      ToastError(String(e))
    }
  }

  return (
    <ScrollView>
      <LoadableView message={"Intentando reservar"} loading={loading}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <View style={{ margin: 10 }}>
            <Text style={{ fontSize: 50, fontWeight: 'bold', textAlign: 'left' }}>Reservá</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}> Fecha de inicio </Text>
              <DateInput initialDate={new Date()} onChange={setInitialDate} />
            </View>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{ fontWeight: 'bold' }}> Fecha de finalización </Text>
              <DateInput initialDate={new Date()} onChange={setFinalDate} />
            </View>
            <View style={{margin: 10}}>
              { availableDates.map(date =>
                <Text style={{margin: 5, flex: 1, justifyContent: 'center'}}>Rango ocupado: {_dateStringyfier(date[0])} - {_dateStringyfier(date[1])}</Text>
              )}
            </View>
            <Button dark onPress={handleDoReservation} mode="contained"> Reservar </Button>
          </View>
        </View>
      </LoadableView>
    </ScrollView>
  );
}
