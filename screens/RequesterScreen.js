import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GenerateRequestScreen from './GenerateRequestScreen';
import SettingsScreen from './SettingsScreen'

const RequesterScreen = ({ route, navigation }) => {

  function HomeScreen() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Home!</Text>
      </View>
    );
  }

  // function SettingsScreen() {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Settings!</Text>
  //     </View>
  //   );
  // }

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "GenerateRequest") {
            return (
              <Entypo
                name="plus"
                size={widthPercentageToDP("12%")}
                color={Colors.primary}
              />
            );
          } else if (route.name === "Settings") {
            return (
              <Ionicons
                name="md-settings"
                size={widthPercentageToDP("8%")}
                color={Colors.secondary}
              />
            );
          }

        },
      })}
      tabBarOptions={{
        showLabel: false,
        style: {backgroundColor: Colors.tertiary},
        inactiveBackgroundColor: Colors.tertiary,
        tabStyle: { elevation: 4, borderRadius: 10 },
        activeBackgroundColor: Colors.selected,
      }}
    >
      <Tab.Screen name="GenerateRequest" component={GenerateRequestScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
});

export default RequesterScreen;
