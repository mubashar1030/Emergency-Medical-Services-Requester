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
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";

const LoginScreen = ({ route, navigation }) => {
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");

  // Signup button should only be displayed if user is Requester.
  // The below condition makes sure of it.

  const onSigninPressHandler = () => {
    console.log("User Type: " + route.params.userType);
    console.log("email: " + email);
    console.log("Password: " + password);
    if (email !== "cs360" || password !== "cs360") {
      Alert.alert("Login Error", "Incorrect Username and/or Password", [
        {
          text: "Try Again!",
          style: "cancel",
        },
      ]);
    }
    else {
      if (route.params.userType=='Requester'){
        navigation.navigate('RequesterScreen');
      }
      else if (route.params.userType=='EMS Member'){
        navigation.navigate('EMSMemberScreen');
      }
      else if (route.params.userType=='Administrator'){
        navigation.navigate('AdministratorScreen');
      }

    }
  };

  const onSignupPressHandler = () => {
    console.log("Sign up Button is Pressed.");
    navigation.navigate('SignupScreen');
    
  };

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
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: heightPercentageToDP("10%"),
    alignItems: "center",
    justifyContent: "center",
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
});

export default LoginScreen;
