import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

// This is a custom made simple button. And is used as login and signup button
// and other buttons to keep a consistent size and style.
const MyButton = (props) => {
  return (
    <TouchableOpacity
      style={{ ...styles.button, ...props.buttonStyle }}
      onPress={props.onPress}
    >
      <Text style={{ ...styles.text, ...props.textStyle }}>{props.text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("10%"),
    backgroundColor: Colors.primary,
    borderRadius: widthPercentageToDP("7%"),
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("4%"),
    color: Colors.tertiary,
    fontWeight: "bold",
  },
});

export default MyButton;
