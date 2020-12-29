import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ReservationCard } from '../components/components';
import { UserContext } from '../context/userContext';

function PublicationRelatedReservationList(props) {
}

function OwnReservationsList(props) {
}


export function ReservationsScreen({navigation, route}) {
    /* por props puede venir el publication_id entonces estamos en las reservas asociadas
     * a una publicación, o no puede venir nada entonces se trata de mis reservas (queremos mostrar
     * también las publicaciones asociadas a las mías)
     */
    const { uid, token, requester } = React.useContext(UserContext);
    const [reservations, setReservations] = React.useState([]);

    React.useEffect(() => {
        if (route.params && route.params.publication_id) {
            /* Son las asociadas a una publicación */
            let publication_id = route.params.publication_id
            requester.reservations({publication_id: publication_id}).then(reservations => {
                setReservations(reservations)
            })
        } else {
            requester.reservations({tenant_id: uid}).then(reservations => {
                setReservations(reservations)
            })
        }
    }, [])

    return (
        <View style={{flex: 1, backgroundColor: 'grey'}}>
            <ScrollView>
                <View style={{flex: 1, padding: 10}}>
                    {reservations.map(item => {
                        return (<ReservationCard reservation={item}/>)
                    })}
               </View>
            </ScrollView>
        </View>
    );
}
