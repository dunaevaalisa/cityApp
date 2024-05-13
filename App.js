import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Main from './components/Main';
import Events from './components/Events';
import News from './components/News';
import CityMap from './components/CityMap';
import Photogallery from './components/PlaceList';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';


const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = ({ route }) => ({
  tabBarIcon: ({ focused, color, size }) => {
    let iconName;

    if (route.name === 'Main') {
      iconName = 'home';
    } else if (route.name === 'Settings') {
      iconName = 'settings';
    } else if (route.name === 'Events') {
      iconName = 'sparkles-outline';
    } else if (route.name === 'News') {
      iconName = 'earth-outline';
    } else if (route.name === 'Weather') {
      iconName = 'cloud-outline';
    } else if (route.name === 'CityMap') {
      iconName = 'map';
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }
});



function HomeTabs() {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="Events" component={Events} />
      <Tab.Screen name="News" component={News} />
      <Tab.Screen name="CityMap" component={CityMap} />
    </Tab.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeTabs} />
      <Drawer.Screen name="Place list" component={Photogallery} />
    </Drawer.Navigator>
  );
}

function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator />
    </NavigationContainer>
  );
}

export default App;
