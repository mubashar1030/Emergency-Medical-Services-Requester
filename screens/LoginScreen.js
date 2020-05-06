import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  AsyncStorage
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { signin } from "../components/dbComm";
import * as Progress from "react-native-progress";
import { database } from "firebase";
import { CommonActions } from '@react-navigation/native';

const LoginScreen = ({ route, navigation }) => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const onSigninPressHandler = async () => {
    console.log("User Type: " + route.params.userType);
    console.log("email: " + email);
    console.log("Password: " + password);
    var memberType = null;
    setIsVerifying(true);
    let userInfo = await signin(email, password);
    setIsVerifying(false);

    if (!userInfo) {
      Alert.alert("Login Error", "Incorrect Username and/or Password", [
        {
          text: "Try Again!",
          style: "cancel",
        },
      ]);
    } else {
      if (
        route.params.userType == "Requester" && (userInfo["user_type"] == "requester" || userInfo["user_type"] == "Admin" 
          || userInfo["user_type"] == "EMS_Member")
      ) {
        // navigation.navigate("RequesterScreen");
        try {
          await AsyncStorage.setItem('userId', email);
          await AsyncStorage.setItem('userProfile', route.params.userType);
        } catch (error) {
          // Error setting data
          console.log('error setting data')
          console.log(error.message);
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: "RequesterScreen" },
            ],
          })
        );
      } else if (
        route.params.userType == "EMS Member" &&
        (userInfo["user_type"] == "EMS_Member" ||
          userInfo["user_type"] == "Admin")
      ) {
        // navigation.navigate("EMSMemberScreen");
        try {
          await AsyncStorage.setItem('userId', email);
          await AsyncStorage.setItem('userProfile', route.params.userType);
        } catch (error) {
          // Error setting data
          console.log('error setting data')
          console.log(error.message);
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: "EMSMemberScreen" },
            ],
          })
        );
      } else if (
        route.params.userType == "Administrator" &&
        userInfo["user_type"] == "Admin"
      ) {
        // navigation.navigate("AdministratorScreen");
        try {
          await AsyncStorage.setItem('userId', email);
          await AsyncStorage.setItem('userProfile', route.params.userType);
        } catch (error) {
          // Error setting data
          console.log('error setting data')
          console.log(error.message);
        }
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              { name: "AdministratorScreen" },
            ],
          })
        );
      } else {
        Alert.alert("Login Error", "Incorrect Username and/or Password", [
          {
            text: "Try Again!",
            style: "cancel",
          },
        ]);
      }
    }
  };

  // The below condition brings up a verifying overlay when user information
  // is being verfying by database.
  let verifyOverlay;
  if (isVerifying) {
    verifyOverlay = (
      <View style={styles.verifyOverlayContainer}>
        <Progress.Bar indeterminate width={200} color={Colors.secondary} />
        <Text style={{ ...styles.signupText, paddingTop: "2%" }}>
          Verifying...
        </Text>
      </View>
    );
  }

  const onSignupPressHandler = () => {
    console.log("Sign up Button is Pressed.");
    navigation.navigate("SignupScreen");
  };

  // Signup button should only be displayed if user is Requester.
  // The below condition makes sure of it.
  let signupButton;
  if (route.params.userType === "Requester") {
    signupButton = (
      <TouchableOpacity
        style={{ alignItems: "center" }}
        onPress={onSignupPressHandler}
      >
        <Text style={styles.signupText}>Sign Up</Text>
      </TouchableOpacity>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View Style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.loginContaniner}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Email"
              onChangeText={(text) => setemail(text)}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              autoCapitalize="none"
              secureTextEntry={true}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onSigninPressHandler}
          >
            <Text style={styles.text}>Sign In</Text>
          </TouchableOpacity>
        </View>
        {signupButton}
      </View>
      {verifyOverlay}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    // paddingVertical: heightPercentageToDP("10%"),
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
  logo: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("30%"),
    resizeMode: "contain",
  },
  loginContaniner: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("30%"),
    justifyContent: "space-around",
    paddingTop: heightPercentageToDP("6%"),
  },
  inputContainer: {
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("7%"),
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("5%"),
    elevation: 4,
    justifyContent: "center",
    paddingLeft: heightPercentageToDP("3%"),
  },
  buttonContainer: {
    paddingTop: heightPercentageToDP("3%"),
    paddingBottom: heightPercentageToDP("2%"),
  },
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
  signupText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2.5%"),
    color: Colors.secondary,
  },
  verifyOverlayContainer: {
    elevation: 10,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: Colors.tertiary,
    opacity: 0.8,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LoginScreen;
