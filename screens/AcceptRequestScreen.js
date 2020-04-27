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

const AcceptRequestScreen = () => {
  const [currentRequests, setCurrentRequests] = useState([]);
  let content;

  if (currentRequests.length === 0) {
    content = (
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.upperText}>There are Currently</Text>
          <Text style={styles.lowerText}>No Requests</Text>
        </View>
      </View>
    );
    setTimeout(() => {
      setCurrentRequests([
        ...currentRequests,
        {
          id: Math.floor(Math.random() * 1000).toString(),
          name: "Mubashar",
          dateTime: "27/04/2019 04:04",
          photo: require("../assets/dummy.png"),
        },
        {
          id: Math.floor(Math.random() * 1000).toString(),
          name: "Mubashar",
          dateTime: "27/04/2019 04:04",
          photo: require("../assets/dummy.png"),
        },
        {
          id: Math.floor(Math.random() * 1000).toString(),
          name: "Mubashar",
          dateTime: "27/04/2019 04:04",
          photo: require("../assets/dummy.png"),
        },
        {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
          },
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
          },
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
          },
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
          },
      ]);
    }, 2000);
  } else {
    content = (
      <View style={styles.container}>
        {/* <Text>aaa</Text> */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Requests</Text>
        </View>
        <FlatList
          data={currentRequests}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.card} onPress={()=>{console.log(item.id)}}>
              <View>
                <Photo photo={item.photo} photoStyle={styles.photo} />
              </View>
              <View style={styles.infoContainer}>
                <InfoText label="Name:" text={item.name} border={1} />
                <InfoText label="Time:" text={item.dateTime} border={0} />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }
  return <View style={{ flex: 1 }}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
  titleContainer: {
    width: widthPercentageToDP("90%"),
    marginTop: heightPercentageToDP("2%"),
    marginBottom: heightPercentageToDP("1%"),
  },
  title: {
    fontFamily: "Helvetica",
    color: Colors.primary,
    fontSize: heightPercentageToDP("4%"),
    fontWeight: "bold",
  },
  textContainer: {
    marginTop: heightPercentageToDP("20%"),
    alignItems: "center",
  },
  upperText: {
    fontFamily: "Helvetica",
    color: Colors.secondary,
    fontSize: heightPercentageToDP("3%"),
    fontWeight: "bold",
  },
  lowerText: {
    fontFamily: "Helvetica",
    color: Colors.primary,
    fontSize: heightPercentageToDP("4%"),
    fontWeight: "bold",
  },
  card: {
    width: widthPercentageToDP("82%"),
    height: heightPercentageToDP("12%"),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: widthPercentageToDP("16%"),
    marginTop: heightPercentageToDP("3%"),
    marginBottom: heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("5%"),
    marginHorizontal: widthPercentageToDP("3%"),
    overflow: "hidden",
  },
  photo: {
    width: widthPercentageToDP("20%"),
    height: widthPercentageToDP("20%"),
    // backgroundColor: 'red'
  },
  infoContainer: {
    width: widthPercentageToDP("50%"),
    paddingHorizontal: widthPercentageToDP("5%"),
  },
});

export default AcceptRequestScreen;
