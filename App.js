import React, { useState } from "react";
import { StyleSheet, Text, View, YellowBox } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Colors from "./constants/colors.js";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import SplashScreen from "./screens/SplashScreen.js";
import UserTypeScreen from "./screens/UserTypeScreen.js";
import LoginScreen from "./screens/LoginScreen.js";
import SignupScreen from './screens/SignupScreen'
import RequesterScreen from "./screens/RequesterScreen.js";
import EMSMemberScreen from './screens/EMSMemberScreen'
import AdministratorScreen from './screens/AdministratorScreen'
import _ from 'lodash';

YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};

const Stack = createStackNavigator();

const getFont = () =>
  Font.loadAsync({
    Helvetica: require("./assets/fonts/Helvetica.ttf"),
  });

export default function App() {
  const [fontsLoaded, setfontsLoaded] = useState(false);

  // Since fonts are loaded asynchronously the below condition checks if
  // fonts are loaded and only starts the app once the fonts are loaded so
  // so that the components do not get rendered before the loading of font.
  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="SplashScreen">
        <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="UserTypeScreen"
            component={UserTypeScreen}
            options={{
              title: "User Type",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              title: "Login",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
          <Stack.Screen
            name="RequesterScreen"
            component={RequesterScreen}
            options={{
              title: "EMS-R",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
          <Stack.Screen
            name="EMSMemberScreen"
            component={EMSMemberScreen}
            options={{
              title: "EMS-R",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
          <Stack.Screen
            name="AdministratorScreen"
            component={AdministratorScreen}
            options={{
              title: "EMS-R",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
          <Stack.Screen
            name="SignupScreen"
            component={SignupScreen}
            options={{
              title: "Sign Up",
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              headerTitleAlign: "center",
              headerTitleStyle: {
                fontWeight: "bold",
                fontSize: 22,
                color: Colors.tertiary,
              },
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <AppLoading startAsync={getFont} onFinish={() => setfontsLoaded(true)} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
