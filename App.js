import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Colors from './constants/colors.js';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import UserTypeScreen from './screens/UserTypeScreen.js';

const Stack = createStackNavigator();

const getFont = () => Font.loadAsync({
  'Helvetica': require('./assets/fonts/SundayMorning.otf'),
});

export default function App() {
  const [fontsLoaded, setfontsLoaded] = useState(false);
  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" component={UserTypeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  else {
    return (
      <AppLoading
        startAsync={getFont}
        onFinish={() => setfontsLoaded(true)}
      />
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
});
