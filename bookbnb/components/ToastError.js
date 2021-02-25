import * as React from "react";
import Toast from 'react-native-toast-message';

export function ToastError(message) {
  Toast.show({
    text1: 'ERROR',
    type: 'error',
    text2: message
  })
}
