import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

export const Logo = (): JSX.Element => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
        await Font.loadAsync({
          'OrionFont': require('../../assets/fonts/electromagnetic-lungs-font/ElectromagneticLungs-BVmx.ttf'),
          'SystemFont': {
            uri: '../../assets/fonts/Roboto_Slab/RobotoSlab-VariableFont_wght.ttf',
            display: Font.FontDisplay.FALLBACK,
          },
        });
      } catch (error) {
        console.warn(error);
      } finally {
        setFontsLoaded(true);
        await SplashScreen.hideAsync();
      }
    };

    loadFonts();
  }, []);

//   if (!fontsLoaded) {
//     return null; // Optionally render a loading indicator here
//   }

  return (
    <Text style={styles.logo}>
      ORION<Text style={styles.trade}>&trade;</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  logo: {
    backgroundColor: '#111111',
    color: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '3%',
    fontSize: 25,
    fontFamily: 'OrionFont',
    textAlign: 'center',
  },
  trade: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'SystemFont', // Replace with an appropriate font or system font
  },
});
