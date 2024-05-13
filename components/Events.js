import { StyleSheet, Text, View, Button, TextInput, FlatList, Image, TouchableOpacity, Linking, ActivityIndicator} from 'react-native';
import { useState, useEffect } from 'react';

export default function Events() {
    const [keyword, setKeyword] = useState('');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const getEvents = () => {
        setLoading(true);
        fetch(`https://app.ticketmaster.com/discovery/v2/events.json?countryCode=FI&keyword=${keyword}&apikey=K28BaUXfgfv2hEhYt529Vdou30repj5R`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network error');
                }
                return response.json();
            })
            .then(data => {
                const eventsData = data._embedded ? data._embedded.events : [];
                setEvents(eventsData);  
                setLoading(false);
            })
            .catch(error => {
                Alert.alert('Error', error); 
                setLoading(false);
            });
    }

    const getAllEvents = () => {
        setLoading(true);
        fetch('https://app.ticketmaster.com/discovery/v2/events.json?countryCode=FI&apikey=K28BaUXfgfv2hEhYt529Vdou30repj5R')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const eventsData = data._embedded ? data._embedded.events : [];
            setEvents(eventsData); 
            setLoading(false);
        })
        .catch(error => {
            Alert.alert('Error', error); 
            setLoading(false);
        });
    }

    useEffect(() => {
        getAllEvents();
    }, []);

    if (loading) {
        return (
          <View style={styles.container}> 
            <ActivityIndicator size="large" color="#00ff00" />
          </View>
        );
      } else {
    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input}
                    placeholder='Type keyword'
                    value={keyword}
                    onChangeText={text => setKeyword(text)}
                />
                <Button title="Search" onPress={getEvents} />
                <Button title="Show All Events" onPress={getAllEvents} />
            </View>
            <FlatList
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.eventContainer}>
                        <Text style={styles.eventTitle}>Event: {item.name}</Text>
                        <Text style={styles.eventDate}>Date: {item.dates.start.localDate}</Text>
                        <Text style={styles.eventDate}>Time: {item.dates.start.localTime}</Text>
                        <Text style={styles.eventDescription}>Min price: {item.priceRanges[0].min} €</Text>
                        <Text style={styles.eventDescription}>Max price: {item.priceRanges[0].max} €</Text>
                        <View style={styles.imageContainer}>
                            <Image
                                style={styles.image}
                                source={{ uri: item.images[0].url }} 
                            />
                        </View>
                        <TouchableOpacity onPress={() => Linking.openURL(item._embedded.venues[0].url)}>
                            <Text style={styles.link}>Link: {item._embedded.venues[0].url}</Text>
                        </TouchableOpacity>
                    </View>
                )}
                data={events}
            />
            {loading && <ActivityIndicator size="large" color="#00ff00" />}
        </View>
    );
}
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10,
        paddingHorizontal: 10,
    },
    eventContainer: {
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        alignItems: 'center',
    },
    eventTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    eventDescription: {
        fontSize: 16,
        marginBottom: 5,
    },
    eventDate: {
        fontSize: 16,
        color: '#555', 
    },
    imageContainer: {
        alignItems: 'center',
        marginVertical: 10,
    },
    image: {
        width: 300,
        height: 200,
        borderRadius: 10,
    },
    link: {
        fontSize: 16,
        color: 'grey',
    },
});
