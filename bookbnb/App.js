import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './Screens/Profile'
import { View, StatusBar, Text, StyleSheet } from 'react-native';

export default function App() {
  return (
    <View>
      <ProfileScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
