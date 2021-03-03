import * as React from 'react';
import {
  Snackbar, Avatar, Button, Card, Title, Paragraph, DataTable, TextInput, Surface, List, Divider
} from 'react-native-paper';
import { Icon, CheckBox } from 'react-native-elements';
import {
  AsyncStorage, StyleSheet, Text, View, TouchableHighlight, Dimensions, Image,
} from 'react-native';
import NumericInput from 'react-native-numeric-input';
import defaultPublicationImg from '../assets/default_publication_img.jpeg';
import { v4 as uuidv4 } from 'uuid';
import { dateStringyfier as _dateStringyfier } from "../utils";
import DateTimePicker from '@react-native-community/datetimepicker';

const windowWidth = Dimensions.get('window').width;

export function DateInput(props) {
  const [date, setDate] = React.useState(props.initialDate);
  const [pickingDate, setPickingDate] = React.useState(false);

  function onSelectedDate(date, e) {
    if (e.type === 'neutralButtonPressed') {
      setDate(null);
      setPickingDate(false);
      props.onChange && props.onChange(null);
      return
    }

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
        value={date || new Date()}
        disabledDates={props.disabledDates}
        allowDisabled={true}
        mode="date"
        neutralButtonLabel="Limpiar"
        onChange={(e, date) => onSelectedDate(date, e)}
      />
    );
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
      <SimpleTextInput editable={false} value={date && _dateStringyfier(date)} />
      <Icon
        onPress={() => setPickingDate(true)}
        underlayColor="blue"
        size={props.iconSize || 40}
        name="calendar"
        type="evilicon"
      />
    </View>
  );
}

export function ProfileRowData(props) {
  return (
    <DataTable.Row style={{ justifyContent: 'flex-start' }}>
      <DataTable.Cell>
        <Text style={{ fontWeight: 'bold' }}>{props.keyValue}</Text>
      </DataTable.Cell>
      <DataTable.Cell style={{ justifyContent: 'flex-end' }}>
        <Text> {props.value} </Text>
      </DataTable.Cell>
    </DataTable.Row>
  );
}

export function ReservationCard(props) {
  let bookingStatus = null;

  if (props.reservation.booking_status == 'ACCEPTED') {
    bookingStatus = 'Aceptada';
  } else if (props.reservation.booking_status == 'PENDING') {
    bookingStatus = 'Pendiente';
  } else {
    bookingStatus = 'Inválida';
  }

  return (
    <Card {...props} style={styles.reservationCard}>
      <Card.Content>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Title key={props.key}> {props.reservation.title} </Title>
        </View>
        <ProfileRowData keyValue="Fecha de inicio" value={props.reservation.initial_date} />
        <ProfileRowData keyValue="Fecha de finalización" value={props.reservation.final_date} />
        <ProfileRowData keyValue="Owner" value={props.reservation.owner} />
        <ProfileRowData keyValue="Estado" value={bookingStatus} />
        <CheckBox key={props.key} title="Vencida" checked={props.reservation.expired} />
        {props.actions && props.actions.map((action, i) => (
          <Card.Actions style={styles.actions}>
            <Button key={props.key} onPress={() => { action.onAction(); }}>{action.title}</Button>
          </Card.Actions>
        ))}
      </Card.Content>
    </Card>
  );
}

export function PublicationCardMinimal(props) {
  let image_url = Image.resolveAssetSource(defaultPublicationImg).uri;
  if (props.publication.images.length) {
    image_url = props.publication.images[0].url;
  }
  return (
    <Card {...props} style={styles.publicationCard}>
      {props.actions.map((action, i) => (
        <Card.Actions key={uuidv4()} style={styles.actions}>
          <Button key={uuidv4()} onPress={() => { action.onAction(); }}>{action.title}</Button>
        </Card.Actions>
      ))}
      <Card.Cover source={{ uri: image_url }} />
      <Card.Content>
        <Title> {props.publication.title} </Title>
        <Paragraph>{props.publication.description}</Paragraph>
      </Card.Content>
    </Card>
  );
}

export function AddNewButton(props) {
  const styles = StyleSheet.create({
    addNew: {
      position: 'absolute',
      bottom: 20,
      right: 20,
    },
  });
  return (
    <View style={styles.addNew}>
      <Icon
        {...props}
        underlayColor="black"
        Component={TouchableHighlight}
        raised
        size={30}
        name="add"
        type="material"
        color="#5273a4"
        reverse
      />
    </View>
  );
}

export function SimpleTextInput(props) {
  const styles = StyleSheet.create({
    input: {
      minHeight: 70,
      minWidth: 50,
      margin: 5,
      flex: 1,
      paddingBottom: 20,
    },
  });
  if (!props.multiline) {
    return (
      <TextInput dense {...props} mode="outlined" style={styles.input} />
    );
  }
  return (
    <TextInput multiline {...props} mode="outlined" style={styles.input} />
  );
}

export function SimpleNumericInput({label, onChange, value, onlyPositives, description}) {
  const styles = StyleSheet.create({
    numericRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      margin: 10,
    }
  });

  let minValue = null;
  if (onlyPositives) {
    minValue = 0
  }

  return(
    <View style={styles.numericRow}>
      <View style={{flex: 1, flexDirection: 'column'}}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>{label}</Text>
        <Text style={{ fontSize: 12 }}>{description || ''}</Text>
      </View>
      {
        /* Corregir el valor inicial como '' */
      //<NumericInput minValue={minValue} value={value} onChange={(value) => {
      //  console.log('Change= %s', value)
      //}} />
      }
      <TextInput mode="outlined" style={styles.input} value={value} onChangeText={onChange} />
    </View>
  );
}


export function AppLogo(props) {
  return (
    <Text style={styles.appLogo}> BookBnB </Text>
  );
}

export function SnackBar(props) {
  const [snackbar, setSnackbar] = React.useState(true);

  React.useEffect(() => {
    setTimeout(setSnackbar, props.timeout, false);
  }, [props.navigation]);

  return (
    <Snackbar visible={snackbar}> {props.text} </Snackbar>
  );
}

export function FloatingSection(props) {
  return (
    <Surface style={styles.floatingSection}>
      <List.Subheader>{props.titleLabel}</List.Subheader>
      <Divider style={{ backgroundColor: 'black' }} />
      {props.children}
    </Surface>
  );
}

export function FloatingButton(props) {
  return (
    <Surface style={styles.floatingSection}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <List.Subheader>{props.buttonLabel}</List.Subheader>
        <Icon
          onPress={props.onPress}
          containerStyle={{ paddingRight: 10 }}
          size={40}
          name={props.iconName}
          type={props.iconType}
          color="#f03"
          {...props}
        />
      </View>
    </Surface>
  );
}


const styles = StyleSheet.create({
  floatingSection: {
    elevation: 2,
    marginTop: 10
  },
  appLogo: {
    fontSize: 50,
    margin: 30,
    fontWeight: 'bold',
  },
  publicationCard: {
    margin: 7,
  },
  actions: {
    justifyContent: 'flex-end',
    flex: 1,
    flexDirection: 'row',
  },
  reservationCard: {
    margin: 7,
  },
});
