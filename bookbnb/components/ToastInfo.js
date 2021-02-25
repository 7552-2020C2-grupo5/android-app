import * as React from "react";
import Toast from 'react-native-toast-message';

export function ToastInfo(title, message) {
  Toast.show({
    text1: title,
    type: 'info',
    text2: message
  })
}
