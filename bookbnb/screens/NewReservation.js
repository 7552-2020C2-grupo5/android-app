import * as React from 'react';
import {
  View, Text, TextInput, ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SimpleTextInput } from '../components/components';
import { UserContext } from '../context/userContext';

function _dateStringyfier(date) {
  return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`;
}

function DateInput(props) {
  const [date, setDate] = React.useState(new Date());
  const [pickingDate, setPickingDate] = React.useState(false);

  function onSelectedDate(date) {
    setPickingDate(false);

    if (!date) return;

    setDate(date);
    props.onChange && props.onChange(date);
    console.log('setting date');
    console.log(date);
  }

  if (pickingDate) {
    return (
      <DateTimePicker
        value={date}
        mode="date"
        onChange={(e, date) => onSelectedDate(date)}
      />
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
      <SimpleTextInput editable={false} value={_dateStringyfier(date)} />
      <Icon
        onPress={() => setPickingDate(true)}
        underlayColor="blue"
        size={40}
        name="calendar"
        type="evilicon"
      />
    </View>
  );
}

export function NewReservationScreen({ route, navigation }) {
  const { uid, token, requester, newRequester } = React.useContext(UserContext);
  const [initialDate, setInitialDate] = React.useState(new Date());
  const [finalDate, setFinalDate] = React.useState(new Date());

  function handleDoReservation() {
    newRequester.makeReservation({
      tenant_id: Number(uid),
      publication_id: route.params.publication.id,
      total_price: 100,
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
            <DateInput onChange={setInitialDate} />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <Text style={{ fontWeight: 'bold' }}> Fecha de finalización </Text>
            <DateInput onChange={setFinalDate} />
          </View>
          <Button dark onPress={handleDoReservation} mode="contained"> Reservar </Button>
        </View>
      </View>
    </ScrollView>
  );
}
