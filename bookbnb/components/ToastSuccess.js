import * as React from "react";
import Toast from 'react-native-toast-message';

export function ToastError(title, message) {
  Toast.show({
    text1: 'EXITO',
    type: 'success',
    text2: message
  })
}
