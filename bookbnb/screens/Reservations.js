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

    async function _fetchReservationsData() {
        if (route.params && route.params.publication) {
            /* Son las asociadas a una publicación */
            let publication_id = route.params.publication.id
            requester.reservations({publication_id: publication_id}).then(async reservations => {
                /* TODO: Agregar quién hizo la reserva junto con el link al perfil */
                var ownerData = await requester.profileData({id: uid})
                for (const reservation of reservations) {
                    try {
                        var ownerData = await requester.profileData({id: reservation.tenant_id})
                        reservation.title = route.params.publication.title
                        reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`
                    } catch(e) { }
                }
                setReservations(reservations)
            })
        } else {
            requester.reservations({tenant_id: uid}).then(async reservations => {
                for (const reservation of reservations) {
                    try {
                        var relatedPublication = await requester.getPublication(Number(reservation.publication_id))
                        var ownerData = await requester.profileData({id: uid})
                        reservation.title = relatedPublication.title
                        reservation.owner = `${ownerData.first_name} ${ownerData.last_name}`
                    } catch(e) { }
                }
                setReservations(reservations)
            })
        }
    }

    React.useEffect(() => {
        return navigation.addListener('focus', () => {
            _fetchReservationsData()
        });
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
