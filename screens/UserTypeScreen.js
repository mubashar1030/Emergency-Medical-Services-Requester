import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import Colors from "../constants/colors.js";
import CustomButton from "../components/CustomButton";

const UserTypeScreen = ({ navigation }) => {
  const onButtonPress = (user) => {
    console.log(user);
    navigation.navigate('LoginScreen',{
      userType: user
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Requester"
          icon1="md-person"
          icon1Size={45}
          onPress={onButtonPress}
        />
        <CustomButton
          title="EMS Member"
          icon1="md-person"
          icon1Size={45}
          icon2="plus"
          icon2Size={32}
          onPress={onButtonPress}
        />
        <CustomButton
          title="Administrator"
          icon1="md-person"
          icon1Size={45}
          icon2="key"
          icon2Size={26}
          onPress={onButtonPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tertiary,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "80%",
    height: "50%",
    justifyContent: "space-around",
    alignItems: "center",
  },
});

export default UserTypeScreen;
