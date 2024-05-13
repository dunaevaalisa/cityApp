import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, update } from 'firebase/database';

export default function Photogallery() {
  const firebaseConfig = {
    apiKey: "AIzaSyB-RoOQ_IeTIRBusRoXh0-mQ-jYQgZaiPg",
    authDomain: "cityapp-a9f2a.firebaseapp.com",
    databaseURL: "https://cityapp-a9f2a-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "cityapp-a9f2a",
    storageBucket: "cityapp-a9f2a.appspot.com",
    messagingSenderId: "31824695602",
    appId: "1:31824695602:web:1d7d90f49686e5075d872b",
    measurementId: "G-T8RXZQZCFD"
  };
  
  const app = initializeApp(firebaseConfig);
  const database = getDatabase(app);

  const [title, setTitle] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    onValue(itemsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const itemsList = Object.keys(data).map((key) => ({ id: key, title: data[key].title, visited: data[key].visited }));
        setItems(itemsList);
      } else {
        setItems([]);
      }
    });
  }, []);

  const saveItem = () => {
    push(ref(database, 'items/'), { title, visited: false })
      .then(() => {
        console.log('Item saved successfully');
        setTitle('');
      })
      .catch((error) => {
        console.error('Error saving item: ', error);
      });
  };

  const toggleVisited = (itemId, visited) => {
    update(ref(database, `items/${itemId}`), { visited: !visited })
      .then(() => {
        console.log('Item visited status updated successfully');
      })
      .catch((error) => {
        console.error('Error updating visited status: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Title'
        style={styles.input}
        onChangeText={(text) => setTitle(text)}
        value={title}
      />
      <Button onPress={saveItem} title="Save" />
      <FlatList 
        style={styles.flatList}
        keyExtractor={item => item.id.toString()} 
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => toggleVisited(item.id, item.visited)}>
            <View style={[styles.itemContainer, item.visited && styles.visitedItem]}>
              <Text style={[styles.itemTitle, item.visited && styles.visitedText]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )} 
        data={items} 
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  input: {
    marginTop: 30,
    marginBottom: 10,
    fontSize: 18,
    width: 200,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  flatList: {
    marginTop: 20,
    width: '100%',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 18,
  },
  visitedItem: {
    backgroundColor: '#e0e0e0',
  },
  visitedText: {
    textDecorationLine: 'line-through',
  },
});
