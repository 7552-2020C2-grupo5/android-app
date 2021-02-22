import {SimpleTextInput} from "./components";
import * as React from "react";

export default function NumericInput(props) {
  // const handleChange = (value) => {
  //   const numericRegex = /^\d*[.]?\d*$/;
  //   if (numericRegex.test(value)) {
  //     props.onChange(value);
  //   }
  // };

  return (
    <SimpleTextInput {...props}
                     numeric
                     keyboardType="numeric"
                     value={props.value}
    />
  );
}