import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function CityMap() {
    const [location, setLocation] = useState(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('No permission to get location')
          setLoading(false);
          return;
        }
  
        let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.High});
        setLocation(location.coords);
        setLoading(false);
      })();
    }, []);
    
  
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#00ff00" />
            </View>
        );
    } else if (!location) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>No permission to get location</Text>
            </View>
        );
    } else {
        return (
            <View style={{ flex: 1 }}>
                <MapView
                    style={{ flex: 1 }}
                    initialRegion={{
                        latitude: location.latitude,
                        longitude: location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                        }}
                        title="You are here!"
                    />
                </MapView>
            </View>
        );
    }
}
