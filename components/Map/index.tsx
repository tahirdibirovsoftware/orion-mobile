import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

type Position = {
  latitude: number;
  longitude: number;
};

const URL = `https://orion-server-oek4.onrender.com/api/telemetry/latest`;

const MapComponent: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [endpointPosition, setEndpointPosition] = useState<Position | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialLocationData = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          throw new Error('Permission to access location was denied');
        }

        const location = await Location.getCurrentPositionAsync({});
        setCurrentPosition({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });

        const headingData = await Location.getHeadingAsync();
        setHeading(headingData.trueHeading);
      } catch (err:any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocationData = async () => {
      try {
        const response = await axios.get(URL);
        const { gps1latitude, gps1longitude } = response.data;
        const latitude = parseFloat(gps1latitude);
        const longitude = parseFloat(gps1longitude);

        if (!isNaN(latitude) && !isNaN(longitude)) {
          setEndpointPosition({ latitude, longitude });
        } else {
          throw new Error('Invalid GPS coordinates');
        }
      } catch (err) {
        setError('Failed to fetch endpoint data');
      }
    };

    fetchInitialLocationData();

    const intervalId = setInterval(() => {
      fetchLocationData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!currentPosition || !endpointPosition) {
    return (
      <View style={styles.container}>
        <Text>No location data available</Text>
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      initialRegion={{
        ...currentPosition,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
    >
      <Marker 
        coordinate={currentPosition} 
        title="You" 
        pinColor="blue"
        rotation={heading}
      />
      <Marker coordinate={endpointPosition} title="Endpoint" />
      <Polyline
        coordinates={[currentPosition, endpointPosition]}
        strokeColor="#000"
        strokeWidth={3}
      />
    </MapView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: 'red',
  },
});

export default MapComponent;
