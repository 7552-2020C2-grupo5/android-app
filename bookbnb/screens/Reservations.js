import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';

export default function ReservationsScreen(props) {

    let fakeReservations = [{
        title: 'Reserva',
        subtitle: 'dirección',
        initial_date: new Date("2020-11-21T03:17:52.882Z").toLocaleDateString(),
        end_date: new Date("2020-12-24T03:17:52.882Z").toLocaleDateString(),
        publication_id: 5
    }]


    return (
        <View style={{flex: 1, backgroundColor: 'grey'}}>
            <ScrollView>
                <View style={{flex: 1, padding: 10}}>
                    <ReservationCard reservation={fakeReservations[0]}/>
                    <ReservationCard reservation={fakeReservations[0]}/>
                    <ReservationCard reservation={fakeReservations[0]}/>
                    <ReservationCard reservation={fakeReservations[0]}/>
                    <ReservationCard reservation={fakeReservations[0]}/>
                </View>
            </ScrollView>
        </View>
    );
}

export { ReservationsScreen }
