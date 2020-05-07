import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import GenerateRequestScreen from "./GenerateRequestScreen";
import SettingsScreen from "./SettingsScreen";

// This screen is just a container screen for requester.
// It has tabs at the bottom thorugh which the requester can view other screens available to him.
const RequesterScreen = ({ route, navigation }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // define tab icons.
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
        style: { backgroundColor: Colors.tertiary },
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
