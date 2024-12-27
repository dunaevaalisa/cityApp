import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { FIREBASE_API, FIREBASE_API, FIREBASE_authDomain, FIREBASE_databaseURL, FIREBASE_projectId, FIREBASE_storageBucket, FIREBASE_messagingSenderId, FIREBASE_appId, FIREBASE_measurementId} from '@env';

export default function PlaceList() {
  const firebaseConfig = {
    apiKey: FIREBASE_API,
    authDomain: FIREBASE_authDomain,
    databaseURL: FIREBASE_databaseURL,
    projectId: FIREBASE_projectId,
    storageBucket: FIREBASE_storageBucket,
    messagingSenderId: FIREBASE_messagingSenderId,
    appId: FIREBASE_appId,
    measurementId: FIREBASE_measurementId
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
        console.log('Item saved');
        setTitle('');
      })
      .catch((error) => {
        Alert.alert('Error', error); 
      });
  };

  const toggleVisited = (itemId, visited) => {
    update(ref(database, `items/${itemId}`), { visited: !visited })
      .then(() => {
        console.log('Item status updated');
      })
      .catch((error) => {
        Alert.alert('Error', error); 
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder='Place'
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
