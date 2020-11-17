import { StyleSheet, Platform } from 'react-native';

let SafeAreaStyle = StyleSheet.create({
    droidSafeArea: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: Platform.OS === 'android' ? 25 : 0
    },
});

export { SafeAreaStyle }
