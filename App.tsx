import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeNavigator from "./navigation/HomeNavigator.tsx";
import { SafeAreaView, StyleSheet, View } from "react-native";

const Stack = createNativeStackNavigator();

function App() {
  return (
      <NavigationContainer >
          <HomeNavigator/>
      </NavigationContainer>
  );
}

export default App;
