import {StyleSheet, Text, View} from "react-native";
import * as React from "react";

export default function InformationText(props) {
  return (
    <View style={styles.messageContainer}>
      <Text style={styles.message}> {props.message} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'grey',
    textAlign: "center"
  },
  messageContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "white"
  }
});