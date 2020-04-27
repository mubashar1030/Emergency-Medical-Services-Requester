import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Colors from "../constants/colors.js";


const InfoText = (props) => {
  return (
    <View style={{...styles.info ,borderBottomWidth: props.border}}>
      <Text style={{...styles.label, fontSize: props.fontSize, width: props.labelWidth}}>{props.label} </Text>
      <Text style={{...styles.infoText, fontSize: props.fontSize,}}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  info: {
    width: "100%",
    height: heightPercentageToDP("5%"),
    // borderBottomWidth: border,
    alignItems: "center",
    paddingHorizontal: widthPercentageToDP("2.5%"),
    flexDirection: "row",
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("3%"),
    color: Colors.secondary,
    fontWeight: "bold",
    width: widthPercentageToDP("10%"),
  },
  infoText: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("3%"),
    color: Colors.secondary,
  },
});

export default InfoText;
