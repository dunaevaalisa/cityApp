import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Linking, ActivityIndicator } from 'react-native';

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllNews = () => {
    setLoading(true);
    fetch(`https://newsdata.io/api/1/news?apikey=pub_43706549218a498aa3107c9c3f4c86067dd34&country=fi`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setNews(data.results || []); 
        setLoading(false);
      })
      .catch(error => {
        Alert.alert('Error', error); 
        setLoading(false);
      });
  };

  useEffect(() => {
    getAllNews();
  }, []);

  const styles = StyleSheet.create({
    newsContainer: {
      marginBottom: 20,
      padding: 10,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 10,
      backgroundColor: '#fff',
      elevation: 2,
    },
    newsTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: '#333',
    },
    newsDescription: {
      fontSize: 16,
      marginBottom: 10,
      color: '#555',
    },
    newsKeywords: {
      fontSize: 16,
      marginBottom: 10,
      color: '#777',
    },
    newsLink: {
      fontSize: 16,
      color: '#007bff',
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 10,
    },
    image: {
      width: 300,
      height: 200,
      borderRadius: 10,
    },
  });

  if (loading) {
    return (
      <View style={styles.container}> 
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    );
  } else {
    return (
      <View>
        <FlatList
          keyExtractor={(item) => item.article_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.newsContainer}>
              <Text style={styles.newsTitle}>Title: {item.title}</Text>
              <Text style={styles.newsDescription}>Description: {item.description}</Text>
              <Text style={styles.newsKeywords}>Category: {item.category}</Text>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={{ uri: item.image_url }} 
                />
              </View>
              <TouchableOpacity onPress={() => Linking.openURL(item.link)}>
                <Text style={styles.newsLink}>Link</Text>
              </TouchableOpacity>
            </View>
          )}
          data={news}
          ListEmptyComponent={<Text>No news found</Text>}
        />
      </View>
    );
  }
}
