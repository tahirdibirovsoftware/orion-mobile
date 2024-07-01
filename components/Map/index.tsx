import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import * as SplashScreen from 'expo-splash-screen';

type Position = {
  latitude: number;
  longitude: number;
};

const URL = `https://orion-server-oek4.onrender.com/api/telemetry/latest`;

const haversineDistance = (coords1: Position, coords2: Position): number => {
  const toRad = (x: number) => x * Math.PI / 180;

  const lat1 = coords1.latitude;
  const lon1 = coords1.longitude;
  const lat2 = coords2.latitude;
  const lon2 = coords2.longitude;

  const R = 6371; // Radius of the Earth in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

const MapComponent: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [endpointPosition, setEndpointPosition] = useState<Position | null>(null);
  const [heading, setHeading] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchInitialLocationData = async () => {
      try {
        await SplashScreen.preventAutoHideAsync();

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
      } catch (err: any) {
        setError(err.message);
        console.error(err); // Log the error to console
      } finally {
        setLoading(false);
        await SplashScreen.hideAsync();
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
        console.error(err); // Log the error to console
      }
    };

    fetchInitialLocationData();

    const intervalId = setInterval(() => {
      fetchLocationData();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (currentPosition && endpointPosition) {
      const dist = haversineDistance(currentPosition, endpointPosition);
      setDistance(dist);
    }
  }, [currentPosition, endpointPosition]);

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
    <View style={{ flex: 1 }}>
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
      <View style={styles.distanceContainer}>
        <Text style={styles.distanceText}>
          Distance: {distance ? `${distance.toFixed(2)} km` : 'Calculating...'}
        </Text>
      </View>
    </View>
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
  distanceContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    alignItems: 'center',
  },
  distanceText: {
    color: 'white',
    fontSize: 18,
  },
});

export default MapComponent;
