import React from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

// This is a custom photo container. It's used all over the project
// for a circular photo. It's size can be varied.
const Photo = (props) => {
  return (
    <View style={{ ...styles.photoContainer, ...props.photoContainerStyle }}>
      <Image
        source={props.photo}
        style={{ ...styles.photo, ...props.photoStyle }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  photoContainer: {
    // marginTop: heightPercentageToDP("15%")
    borderRadius: heightPercentageToDP("100%"),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    overflow: "hidden",
    borderWidth: widthPercentageToDP("1%"),
    borderColor: Colors.tertiary,
  },
  photo: {
    width: widthPercentageToDP("50%"),
    height: widthPercentageToDP("50%"),
    resizeMode: "contain",
  },
});

export default Photo;
