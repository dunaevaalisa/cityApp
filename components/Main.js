import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import { useState, useEffect } from 'react';

export default function Main({navigation}) {
  const [weather, setWeather] = useState(null); 

  useEffect(() => {
    getWeather(); 
  }, []);

  const getWeather = () => {
    fetch('https://api.openweathermap.org/data/2.5/weather?lat=60.192059&lon=24.945831&appid=0ad1aa4e4e91dc62efe48d9fe52fa500&units=metric')
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error('Error fetching weather:', error));
  };

  if (!weather || !weather.main || !weather.wind) {
    return <Text>Loading...</Text>; 
  }

  const weatherIcon = weather.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

  return (
    <View style={styles.container}>
      <Image source={{ uri: 'https://media.architecturaldigest.com/photos/5c9e699c1aeb991ed9e6da2b/16:9/w_2560%2Cc_limit/GettyImages-183996236.jpg' }} style={styles.image} />
      <Text style={styles.greeting}>Tervetuloa!</Text>
      <Text style={styles.forecastHeader}>Current weather:</Text>
      <View style={styles.forecastContainer}>
        <Text style={styles.weatherDescription}>{weather.weather[0].description}</Text>
        <Text style={styles.weatherDetail}>Temperature: {weather.main.temp} °C</Text>
        <Text style={styles.weatherDetail}>Wind Speed: {weather.wind.speed} m/s</Text>
        <Text style={styles.weatherDetail}>Pressure: {weather.main.pressure} atm</Text>
        <Image style={styles.weatherIcon} source={{ uri: iconUrl }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  forecastHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  forecastContainer: {
    alignItems: 'center',
  },
  weatherDescription: {
    fontSize: 18,
    marginBottom: 10,
  },
  weatherDetail: {
    fontSize: 16,
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
  },
});
