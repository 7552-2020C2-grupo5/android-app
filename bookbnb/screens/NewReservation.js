import * as React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import { Button } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SimpleTextInput } from '../components/components';

function DateInput(props) {
    const [date, setDate] = React.useState(new Date());
    const [pickingDate, setPickingDate] = React.useState(false);

    function onSelectedDate(date) {
        setPickingDate(false);

        if (!date)
            return

        setDate(date);
        props.onChange && props.onChange(date)
    }

    if (pickingDate)
        return (
            <DateTimePicker
                value={date}
                mode='date'
                onChange={(e, date) => onSelectedDate(date)}
            />
        );

    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
            <SimpleTextInput editable={false} value={date.toLocaleDateString()}/>
            <Icon
                onPress={() => setPickingDate(true)}
                underlayColor='blue'
                size={40}
                name='calendar'
                type='evilicon'
            />
        </View>
    );

}


export default function NewReservationScreen({route, navigation}) {
    function handleDoReservation() {

    }

    return (
        <ScrollView>
            <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{margin: 10}}>
                    <Text style={{fontSize: 50, fontWeight: 'bold', textAlign: 'left'}}>Reservá</Text>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}> Fecha de inicio </Text>
                        <DateInput/>
                    </View>
                    <View style={{justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
                        <Text style={{fontWeight: 'bold'}}> Fecha de finalización </Text>
                        <DateInput/>
                    </View>
                    <Button dark={true} onPress={handleDoReservation} mode="contained"> Reservar </Button>
                </View>
            </View>
        </ScrollView>
    );
}

export { NewReservationScreen }
