import React from 'react';
import { configureFonts, DefaultTheme } from 'react-native-paper';
import customFonts from './Fonts';

const theme = {
  ...DefaultTheme,
  fonts: configureFonts(customFonts),
  roundness: 30,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4123a',
    accent: '#f1c40f',
  },
};

export default theme;
