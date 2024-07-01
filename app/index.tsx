import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

import { Logo } from '@/components/Logo';
import MapComponent from '@/components/Map';
import { Navigation } from '@/components/Navigation';
import TelemetryTable from '@/components/Log';
import { Mode } from '@/shared/types';

const App: React.FC = () => {
  const [mode, setMode] = useState<Mode>('map');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Logo />
        <Navigation setMode={setMode} />
        {mode === 'map' && <MapComponent />}
        {mode === 'log' && <TelemetryTable />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'black',
  },
  map: {
    flex: 1,
  },
});

export default App;
