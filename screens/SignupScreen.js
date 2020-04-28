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
  FlatList,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MyButton from "../components/MyButton";
import Photo from "../components/Photo";
import * as Progress from "react-native-progress";
import call from "react-native-phone-call";
import InfoText from "../components/InfoText";
import { Content } from "native-base";
import * as ImagePicker from 'expo-image-picker';
import { signup } from '../components/dbComm'



const SignupScreen = ({ route, navigation }) => {
  const [isNextPressed, setIsNextPressed] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [picture, setPicture] = useState(require('../assets/dummy.png'))
  let content;

  const loginPressHandler = () => {
    console.log("login Pressed");
  };

  const nextPressHandler = () => {
    if (newPassword !== newConfirmPassword) {
      Alert.alert("Password do not match", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    } else {
      setIsNextPressed(true);
    }
  };
  const handleChangePhoto = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });
      if (!result.cancelled) {
        setPicture({ uri: result.uri });
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  const signupHandler = async () => {
    console.log("Sign Up Finish Pressed.");

    let userProfile = {
      email: newEmail || "",
      user_type: 'requester',
      phone: newPhone,
      name: newName,
    };

    let isValid = await signup(userProfile, newPassword);

    if(isValid) {
      navigation.navigate('RequesterScreen');
    }
    else{
      Alert.alert("Error in information provided", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    }

  };

  if (!isNextPressed) {
    content = (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title1}>Welcome</Text>
            <Text style={styles.title2}>Sign Up</Text>
          </View>
          <View style={styles.addMemberContaniner}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                onChangeText={(text) => setNewName(text)}
                defaultValue={newName}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                onChangeText={(text) => setNewEmail(text)}
                autoCapitalize="none"
                defaultValue={newEmail}
              />
            </View>
            {/* <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone"
                onChangeText={(text) => setNewPhone(text)}
                defaultValue={newPhone}
                autoCapitalize="none"
              />
            </View> */}
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                onChangeText={(text) => setNewPassword(text)}
                autoCapitalize="none"
                defaultValue={newPassword}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                onChangeText={(text) => setNewConfirmPassword(text)}
                autoCapitalize="none"
                defaultValue={newConfirmPassword}
              />
            </View>
          </View>
          <View style={styles.buttonContainer2}>
            <MyButton onPress={() => nextPressHandler()} text="Next" />
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => loginPressHandler()}
          >
            <Text style={styles.signupText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  } else {
    content = (
      <View style={styles.container}>
        <View style={styles.photoContainer}>
          <Photo
            photo={picture}
            photoStyle={styles.photo}
          />
          <MyButton
            buttonStyle={styles.uploadPhotoButton}
            text="Upload Picture"
            textStyle={styles.uploadPhotoText}
            onPress={() => handleChangePhoto()}
          />
        </View>
        <View style={{ ...styles.addMemberContaniner, height: heightPercentageToDP('15%') }}>
          <View style={{ ...styles.inputContainer, height: '45%' }}>
            <TextInput
              placeholder="Phone"
              onChangeText={(text) => setNewPhone(text)}
              defaultValue={newPhone}
              autoCapitalize="none"
            />
          </View>
        </View>
        <View style={styles.buttonContainer2}>
          <MyButton onPress={() => signupHandler()} text="Sign Up" />
        </View>
        <TouchableOpacity
          style={{ alignItems: "center" }}
          onPress={() => setIsNextPressed(false)}
        >
          <Text style={styles.signupText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return <View style={{ flex: 1 }}>{content}</View>;
};

const styles = StyleSheet.create({
  scrollContainer: {
    // paddingVertical: heightPercentageToDP("10%"),
    // backgroundColor: 'green'
    alignItems: "center",
    // justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.tertiary,
  },
  titleContainer: {
    width: widthPercentageToDP("90%"),
    marginTop: "5%",
  },
  title1: {
    fontSize: 40,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: Colors.secondary,
  },
  title2: {
    fontSize: 30,
    fontFamily: "Helvetica",
    fontWeight: "bold",
    color: Colors.primary,
  },
  addMemberContaniner: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("50%"),
    justifyContent: "space-evenly",
    // paddingTop: heightPercentageToDP("6%"),
    backgroundColor: Colors.tertiary,
    alignItems: "center",
    // elevation: 4,
    // borderRadius: 25
  },
  inputContainer: {
    width: "85%", //widthPercentageToDP("70%"),
    height: "12%", //heightPercentageToDP("7%"),
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("5%"),
    elevation: 4,
    justifyContent: "center",
    paddingLeft: heightPercentageToDP("3%"),
  },
  buttonContainer2: {
    marginTop: "3%",
    marginBottom: "3%",
  },
  signupText: {
    fontFamily: "Helvetica",
    fontSize: 20,
    color: Colors.secondary,
  },
  photoContainer: {
    flexDirection: "row",
    marginTop: "25%", //heightPercentageToDP("15%"),
    alignItems: "center",
    width: widthPercentageToDP("85%"),
    justifyContent: "space-between",
  },
  uploadPhotoButton: {
    width: widthPercentageToDP("37%"),
    height: heightPercentageToDP("6%"),
    backgroundColor: Colors.tertiary,
  },
  photo: {
    width: widthPercentageToDP("40%"),
    height: widthPercentageToDP("40%"),
  },
  uploadPhotoText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2%"),
    color: Colors.secondary,
  },
});

export default SignupScreen;
