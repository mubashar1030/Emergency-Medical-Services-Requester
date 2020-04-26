import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacityBase,
  Animated,
  Button,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import Photo from "../components/Photo";
import MyButton from "../components/MyButton";

const SettingScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.photoContainer}>
        <Photo photo={require("../assets/dummy.png")} photoStyle={styles.photo} />
        {/* <TouchableOpacity style={styles.uploadPhotoButton}>
            <Text>Upload Photo</Text>
        </TouchableOpacity> */}
        <MyButton buttonStyle={styles.uploadPhotoButton}/>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
  photoContainer: {
      flexDirection: 'row',
      marginTop: heightPercentageToDP('15%'),
      alignItems: 'center',
      width: widthPercentageToDP('80%'),
      justifyContent: "space-between"
  },
  uploadPhotoButton: {
    width: widthPercentageToDP('25%'),
    height: heightPercentageToDP('6%'),
    backgroundColor: Colors.tertiary
  },
  photo: {
    width: widthPercentageToDP("40%"),
    height: widthPercentageToDP("40%"),
  },
});

export default SettingScreen;
