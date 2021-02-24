import * as React from 'react';
import {
  View, Text, TextInput, ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { SimpleTextInput, DateInput } from '../components/components';
import { UserContext } from '../context/userContext';
import { dateStringyfier as _dateStringyfier } from "../utils";

export function NewReservationScreen({ route, navigation }) {
  const { uid, token, requester, mnemonic, addr } = React.useContext(UserContext);
  const [initialDate, setInitialDate] = React.useState(new Date());
  const [finalDate, setFinalDate] = React.useState(new Date());

  function handleDoReservation() {
          console.log(route.params.publication)
    requester.intentBooking({
      tenant_id: Number(uid),
      tenant_mnemonic: mnemonic,
      blockchain_id: route.params.publication.blockchain_id,
      publication_id: route.params.publication.id,
      price_per_night: Number(route.params.publication.price_per_night),
      initial_date: _dateStringyfier(initialDate),
      final_date: _dateStringyfier(finalDate),
    }, () => { navigation.navigate('Mis Reservas'); });
  }

  return (
    <ScrollView>
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
          <Button dark onPress={handleDoReservation} mode="contained"> Reservar </Button>
        </View>
      </View>
    </ScrollView>
  );
}
