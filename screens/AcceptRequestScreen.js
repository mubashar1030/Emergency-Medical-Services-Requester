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
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(null);
  const [isRequestSelected, setIsRequestSelected] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  let content;

  if (!isRequestAccepted) {
    if (currentRequests.length === 0) {
      content = (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.upperText}>There are Currently</Text>
            <Text style={styles.lowerText}>No Requests!</Text>
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
            emergencyDetails: "Blah Blah Blah",
            phone: "090078601",
            latitude: 31.47,
            longitude: 74.4111,
          },
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
            emergencyDetails: "Blah Blah Blah",
            phone: "090078601",
            latitude: 31.47,
            longitude: 74.4111,
          },
          {
            id: Math.floor(Math.random() * 1000).toString(),
            name: "Mubashar",
            dateTime: "27/04/2019 04:04",
            photo: require("../assets/dummy.png"),
            emergencyDetails: "Blah Blah Blah",
            phone: "090078601",
            latitude: 31.47,
            longitude: 74.4111,
          },
        ]);
      }, 2000);
    } else {
      if (!isRequestSelected) {
        content = (
          <View style={styles.container}>
            {/* <Text>aaa</Text> */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Requests</Text>
            </View>
            <FlatList
              data={currentRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => viewRequestHandler(item)}
                >
                  <View>
                    <Photo photo={item.photo} photoStyle={styles.photo} />
                  </View>
                  <View style={styles.infoContainer}>
                    <InfoText
                      label="Name:"
                      text={item.name}
                      border={1}
                      labelWidth={widthPercentageToDP("10%")}
                      fontSize={widthPercentageToDP("3%")}
                    />
                    <InfoText
                      label="Time:"
                      text={item.dateTime}
                      border={0}
                      labelWidth={widthPercentageToDP("10%")}
                      fontSize={widthPercentageToDP("3%")}
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        );
      } else {
        const region = {
          latitude: requestSelected.latitude, //31.5770699,//31.47,
          longitude: requestSelected.longitude, //74.3751424,//74.4111,
          latitudeDelta: 0.002,
          longitudeDelta: 0.0006,
        };
        content = (
          <View style={styles.container}>
            <View
              style={{
                ...styles.textContainer,
                marginTop: '2%',//heightPercentageToDP("3%"),
              }}
            >
              <Text style={styles.upperText}>Someone is</Text>
              <Text style={styles.lowerText}>Requesting Assistance!</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={region}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: region.latitude,
                    longitude: region.longitude,
                  }}
                />
              </MapView>
            </View>
            <View style={styles.selectedRequestInfoContainer}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.label}>Name: </Text>
                <Text style={styles.infoText}>{requestSelected.name}</Text>
              </View>
              <View>
                <Text style={styles.label}>Emergency Details: </Text>
                <ScrollView style={styles.emergencyDetails}>
                  <Text style={styles.infoText}>
                    {requestSelected.emergencyDetails}
                  </Text>
                </ScrollView>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <MyButton
                buttonStyle={{
                  width: widthPercentageToDP("55%"),
                  height: heightPercentageToDP("10%"),
                  backgroundColor: Colors.primary,
                }}
                text="Accept"
                textStyle={{ fontSize: widthPercentageToDP("8%") }}
                onPress={() => acceptRequestHandler()}
              />

              <MyButton
                buttonStyle={{
                  width: widthPercentageToDP("25%"),
                  height: heightPercentageToDP("10%"),
                  backgroundColor: Colors.tertiary,
                }}
                text="Back"
                textStyle={{
                  fontSize: widthPercentageToDP("5%"),
                  color: Colors.secondary,
                }}
                onPress={() => setIsRequestSelected(false)}
              />
            </View>
          </View>
        );
      }
    }
  } else {
    const region = {
      latitude: requestAccepted.latitude, //31.5770699,//31.47,
      longitude: requestAccepted.longitude, //74.3751424,//74.4111,
      latitudeDelta: 0.002,
      longitudeDelta: 0.0006,
    };
    content = (
      <View style={styles.container}>
        <View
          style={{
            ...styles.textContainer,
            marginTop: heightPercentageToDP("3%"),
          }}
        >
          <Text style={styles.lowerText}>Request Details</Text>
        </View>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={region}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker
              coordinate={{
                latitude: region.latitude,
                longitude: region.longitude,
              }}
            />
          </MapView>
        </View>
        <View style={styles.acceptedRequestInfoContainer}>
          <View style={styles.upperInfo}>
            <View style={{ alignItems: "center" }}>
              <Photo photo={requestAccepted.photo} photoStyle={styles.photo2} />
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => makeCall(requestAccepted.phone)}
              >
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.infoContainer}>
              <InfoText
                label="Name:"
                text={requestAccepted.name}
                border={1}
                labelWidth={widthPercentageToDP("10%")}
                fontSize={widthPercentageToDP("3%")}
              />
              <InfoText
                label="Time:"
                text={requestAccepted.dateTime}
                border={1}
                labelWidth={widthPercentageToDP("10%")}
                fontSize={widthPercentageToDP("3%")}
              />
              <InfoText
                label="Phone:"
                text={requestAccepted.phone}
                border={1}
                labelWidth={widthPercentageToDP("10%")}
                fontSize={widthPercentageToDP("3%")}
              />
            </View>
          </View>
          <View>
            <Text
              style={{ ...styles.label, fontSize: widthPercentageToDP("4%") }}
            >
              Emergency Details:
            </Text>
            <ScrollView
              style={{
                ...styles.emergencyDetails,
                height: heightPercentageToDP("17%"),
              }}
            >
              <Text
                style={{
                  ...styles.infoText,
                  fontSize: widthPercentageToDP("4%"),
                }}
              >
                {requestSelected.emergencyDetails}
              </Text>
            </ScrollView>
          </View>
        </View>
        <View style={styles.endButton}>
          <MyButton
            buttonStyle={{
              width: widthPercentageToDP("25%"),
              height: heightPercentageToDP("5%"),
              backgroundColor: Colors.primary,
            }}
            text="End"
            textStyle={{ fontSize: widthPercentageToDP("5%") }}
            onPress={() => setIsRequestAccepted(false)}
          />
        </View>
      </View>
    );
  }

  const viewRequestHandler = (item) => {
    setIsRequestSelected(true);
    setRequestSelected(item);
    console.log(item.id);
  };
  const acceptRequestHandler = () => {
    setIsRequestAccepted(true);
    setIsRequestSelected(false);
    setRequestAccepted(requestSelected);
  };
  const makeCall = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: false,
    };
    call(args).catch(console.error);
  };
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
  photo2: {
    width: widthPercentageToDP("20%"),
    height: widthPercentageToDP("20%"),
    // backgroundColor: 'red'
  },
  infoContainer: {
    width: "80%",
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  mapContainer: {
    marginTop: heightPercentageToDP("2%"),
    borderRadius: widthPercentageToDP("7%"),
    elevation: 2,
    overflow: "hidden",
    backgroundColor: Colors.tertiary,
  },
  map: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("25%"),
    borderRadius: widthPercentageToDP("7%"),
  },
  selectedRequestInfoContainer: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("30%"),
    // backgroundColor: 'red',
    marginTop: heightPercentageToDP("3%"),
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("5%"),
    color: Colors.secondary,
    fontWeight: "bold",
    // width: widthPercentageToDP("16%"),
  },
  infoText: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("5%"),
    color: Colors.secondary,
    paddingLeft: widthPercentageToDP("2%"),
  },
  emergencyDetails: {
    paddingHorizontal: widthPercentageToDP("2%"),
    width: widthPercentageToDP("80%"),
    height: heightPercentageToDP("20%"),
    // backgroundColor: 'blue',
    overflow: "scroll",
  },
  buttonContainer: {
    flexDirection: "row",
    width: widthPercentageToDP("85%"),
    justifyContent: "space-between",
    marginTop: heightPercentageToDP("2%"),
  },
  acceptedRequestInfoContainer: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("40%"),
    backgroundColor: Colors.tertiary,
    marginTop: heightPercentageToDP("3%"),
    borderRadius: widthPercentageToDP("10%"),
    elevation: 4,
    paddingHorizontal: widthPercentageToDP("5%"),
    paddingVertical: heightPercentageToDP("1%"),
  },
  upperInfo: {
    flexDirection: "row",
    marginBottom: heightPercentageToDP("1%"),
  },
  callButton: {
    width: widthPercentageToDP("15%"),
    height: heightPercentageToDP("4%"),
    backgroundColor: Colors.tertiary,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPercentageToDP("4%"),
    marginTop: heightPercentageToDP("1%"),
  },
  callButtonText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2%"),
    color: Colors.secondary,
  },
  endButton: {
    width: widthPercentageToDP("90%"),
    flexDirection: "row-reverse",
    marginTop: heightPercentageToDP("2%"),
  },
});

export default AcceptRequestScreen;
