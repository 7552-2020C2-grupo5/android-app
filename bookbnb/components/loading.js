import * as React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';


export function LoadableView(props) {
  return (
    <View style={{flex: 1}}>
      {props.loading?
        <>
          <View style={styles.activityView}>
            <ActivityIndicator size='large' style={styles.indicator}/>
            <Text style={styles.message}> {props.message} </Text>
          </View>
        </>
        :
        props.children}
    </View>
  );
}

const styles = StyleSheet.create({
  activityView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  indicator: {
    margin: 20,
  },
  message: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'grey'
  },
});
