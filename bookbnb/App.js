import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Appbar, Button, withTheme, Provider as PaperProvider } from 'react-native-paper';
import { ProfileScreen } from './Screens/Profile'

export default function App() {
  return (
    <PaperProvider>
      <ProfileScreen/>
    </PaperProvider>
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
