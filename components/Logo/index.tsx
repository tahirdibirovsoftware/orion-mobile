import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
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

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <Text style={styles.logo}>
      ORION<Text style={styles.trade}>&trade;</Text>
    </Text>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
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
    fontFamily: 'Roboto', // Use a fallback font if needed
  },
});
