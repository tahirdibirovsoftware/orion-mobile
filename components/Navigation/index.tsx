import React, { FC } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { Mode } from '@/shared/types';

interface INavigate {
  setMode: React.Dispatch<React.SetStateAction<Mode>>;
}

const Navigation: FC<INavigate> = ({ setMode }) => {
  return (
    <View style={styles.navigation}>
      <Pressable 
        onPress={() => setMode('map')} 
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#005f99' : '#007acc'
          },
          styles.button
        ]}
      >
        <Text style={styles.buttonText}>Map</Text>
      </Pressable>
      <Pressable 
        onPress={() => setMode('log')} 
        style={({ pressed }) => [
          {
            backgroundColor: pressed ? '#005f99' : '#007acc'
          },
          styles.button
        ]}
      >
        <Text style={styles.buttonText}>Logs</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'black',
  },
  button: {
    flex: 1,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export { Navigation };
