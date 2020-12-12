import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';
import { Requester } from '../requester/requester';

export default function ReservationsScreen(props) {
    let reservations_card = []

    var requester = new Requester()

    return (
        <View style={{flex: 1, backgroundColor: 'grey'}}>
            <ScrollView>
                <View style={{flex: 1, padding: 10}}>
                    {requester.reservations().map(item => {
                        return (<ReservationCard reservation={item}/>)
                    })}
               </View>
            </ScrollView>
        </View>
    );
}

export { ReservationsScreen }
