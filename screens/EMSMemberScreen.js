import React, { useState } from "react";
import { StyleSheet } from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SettingsScreen from "./SettingsScreen";
import AcceptRequestScreen from "./AcceptRequestScreen";

// This screen is just a container screen for EMS Member.
// It has tabs at the bottom thorugh which the EMS Member can view other screens available to him.
const EMSMemberScreen = ({ route, navigation }) => {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          // Define tab icons.
          if (route.name === "AcceptRequestScreen") {
            return (
              <Entypo
                name="plus"
                size={widthPercentageToDP("12%")}
                color={Colors.secondary}
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
      <Tab.Screen name="AcceptRequestScreen" component={AcceptRequestScreen} />
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

export default EMSMemberScreen;
