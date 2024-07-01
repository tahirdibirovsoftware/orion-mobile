import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, ScrollView } from 'react-native';
import axios from 'axios';

interface ITelemetry {
    packetid: number;
    packetnumber: number;
    satellitestatus: number;
    errorcode: string;
    missiontime: string;
    pressure1: string;
    pressure2: string;
    altitude1: string;
    altitude2: string;
    altitudedifference: string;
    descentrate: string;
    temp: string;
    voltagelevel: string;
    gps1latitude: string;
    gps1longitude: string;
    gps1altitude: string;
    pitch: string;
    roll: string;
    yaw: string | null;
    lnln: string;
    iotdata: string;
    teamid: number;
}

const URL = `https://orion-server-oek4.onrender.com/api/telemetry`;

const TelemetryTable: React.FC = () => {
    const [data, setData] = useState<ITelemetry[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(URL);
                setData(prevData => {
                    const newData = response.data.slice(-30);
                    return [...prevData.slice(newData.length), ...newData];
                });
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch data');
                setLoading(false);
            }
        };

        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [data]);

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

    const renderItem = ({ item }: { item: ITelemetry }) => (
        <View style={styles.row}>
            <Text style={styles.cell}>{item.packetnumber}</Text>
            <Text style={styles.cell}>{item.satellitestatus}</Text>
            <Text style={styles.cell}>{item.errorcode}</Text>
            <Text style={styles.cell}>{item.missiontime}</Text>
            <Text style={styles.cell}>{item.pressure1}</Text>
            <Text style={styles.cell}>{item.pressure2}</Text>
            <Text style={styles.cell}>{item.altitude1}</Text>
            <Text style={styles.cell}>{item.altitude2}</Text>
            <Text style={styles.cell}>{item.altitudedifference}</Text>
            <Text style={styles.cell}>{item.descentrate}</Text>
            <Text style={styles.cell}>{item.temp}</Text>
            <Text style={styles.cell}>{item.voltagelevel}</Text>
            <Text style={styles.cell}>{item.gps1latitude}</Text>
            <Text style={styles.cell}>{item.gps1longitude}</Text>
            <Text style={styles.cell}>{item.gps1altitude}</Text>
            <Text style={styles.cell}>{item.pitch}</Text>
            <Text style={styles.cell}>{item.roll}</Text>
            <Text style={styles.cell}>{item.yaw ?? 'N/A'}</Text>
            <Text style={styles.cell}>{item.lnln}</Text>
            <Text style={styles.cell}>{item.iotdata}</Text>
            <Text style={styles.cell}>{item.teamid}</Text>
        </View>
    );

    return (
        <ScrollView horizontal>
            <View style={styles.container}>
                <FlatList
                    ref={flatListRef}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.packetid.toString()}
                    ListHeaderComponent={
                        <View style={styles.header}>
                            <Text style={styles.cell}>Packet #</Text>
                            <Text style={styles.cell}>Sat Status</Text>
                            <Text style={styles.cell}>Error Code</Text>
                            <Text style={styles.cell}>Mission Time</Text>
                            <Text style={styles.cell}>Pressure 1</Text>
                            <Text style={styles.cell}>Pressure 2</Text>
                            <Text style={styles.cell}>Altitude 1</Text>
                            <Text style={styles.cell}>Altitude 2</Text>
                            <Text style={styles.cell}>Altitude Diff</Text>
                            <Text style={styles.cell}>Descent Rate</Text>
                            <Text style={styles.cell}>Temp</Text>
                            <Text style={styles.cell}>Voltage Level</Text>
                            <Text style={styles.cell}>GPS1 Latitude</Text>
                            <Text style={styles.cell}>GPS1 Longitude</Text>
                            <Text style={styles.cell}>GPS1 Altitude</Text>
                            <Text style={styles.cell}>Pitch</Text>
                            <Text style={styles.cell}>Roll</Text>
                            <Text style={styles.cell}>Yaw</Text>
                            <Text style={styles.cell}>LNLN</Text>
                            <Text style={styles.cell}>IoT Data</Text>
                            <Text style={styles.cell}>Team ID</Text>
                        </View>
                    }
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 5,
    },
    header: {
        flexDirection: 'row',
        borderBottomWidth: 2,
        borderBottomColor: '#000',
        paddingVertical: 5,
    },
    cell: {
        minWidth: 100, // Adjust this to your need
        textAlign: 'center',
        paddingHorizontal: 5,
    },
    errorText: {
        color: 'red',
    },
});

export default TelemetryTable;
