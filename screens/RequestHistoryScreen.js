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
  const [requestHistory, setRequestHistory] = useState([
    {
      id: Math.floor(Math.random() * 1000).toString(),
      requester: "John",
      responder: "Smith",
      requesterPhone: "090078601",
      responderPhone: "090078601",
      Location: "31.2 N 73.2 E",
      emergencyDetails: "Blah blah blah",
      dateTime: "27/04/2020 19:30",
    },
  ]);
  const [isRequestSelected, setIsRequestSelected] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  let content;
  if (!isRequestSelected) {
    content = (
      <View style={styles.container}>
        {/* <Text>aaa</Text> */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Request History</Text>
        </View>
        <FlatList
          data={requestHistory}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => viewRequestHandler(item)}
            >
              <View style={styles.infoContainer}>
                <InfoText
                  label="Requester: "
                  text={item.requester}
                  border={1}
                  labelWidth={widthPercentageToDP("22%")}
                  fontSize={widthPercentageToDP("4%")}
                />
                <InfoText
                  label="Responder: "
                  text={item.responder}
                  border={1}
                  labelWidth={widthPercentageToDP("22%")}
                  fontSize={widthPercentageToDP("4%")}
                />
                <InfoText
                  label="DateTime: "
                  text={item.dateTime}
                  border={1}
                  labelWidth={widthPercentageToDP("22%")}
                  fontSize={widthPercentageToDP("4%")}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  } else {
    content = (
      <View style={styles.container}>
        {/* <Text>hello</Text> */}
        <View style={styles.requestDetailContainer}>
          <View style={styles.requestDetails}>
            <InfoText
              label="Requester: "
              text={requestSelected.requester}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Phone: "
              text={requestSelected.requesterPhone}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Responder: "
              text={requestSelected.responder}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Phone: "
              text={requestSelected.responderPhone}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="DateTime: "
              text={requestSelected.dateTime}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <View style={styles.emergencyDetailsContainer}>
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
        </View>
        <View style={styles.endButton}>
          <MyButton
            buttonStyle={{
              width: widthPercentageToDP("25%"),
              height: heightPercentageToDP("5%"),
              backgroundColor: Colors.primary,
            }}
            text="Back"
            textStyle={{ fontSize: widthPercentageToDP("5%") }}
            onPress={() => setIsRequestSelected(false)}
          />
        </View>
      </View>
    );
  }
  const viewRequestHandler = (item) => {
    setIsRequestSelected(true);
    setRequestSelected(item), console.log(item.id);
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
  card: {
    width: widthPercentageToDP("82%"),
    height: heightPercentageToDP("22%"),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    flexDirection: "row",
    // alignItems: "center",
    borderRadius: widthPercentageToDP("20%"),
    marginTop: heightPercentageToDP("3%"),
    marginBottom: heightPercentageToDP("1%"),
    paddingHorizontal: widthPercentageToDP("5%"),
    marginHorizontal: widthPercentageToDP("3%"),
    paddingVertical: heightPercentageToDP("2.5%"),
    overflow: "hidden",
  },
  infoContainer: {
    width: widthPercentageToDP("70%"),
    paddingHorizontal: widthPercentageToDP("5%"),
    // justifyContent: 'space-evenly'
  },
  requestDetailContainer: {
    elevation: 4,
    backgroundColor: Colors.tertiary,
    width: widthPercentageToDP("80%"),
    height: heightPercentageToDP("70%"),
    marginTop: heightPercentageToDP("5%"),
    borderRadius: widthPercentageToDP("7%"),
    paddingVertical: heightPercentageToDP("3%"),
    justifyContent: "space-evenly",
    alignItems: 'center'
  },
  requestDetails: {
    width: widthPercentageToDP("77%"),
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("5%"),
    color: Colors.secondary,
    fontWeight: "bold",
    paddingHorizontal: widthPercentageToDP('2.5%'),
    // height: heightPercentageToDP("5%"),
    justifyContent: 'space-evenly'
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
    width: widthPercentageToDP("67%"),
    height: heightPercentageToDP("20%"),
    // backgroundColor: 'blue',
    overflow: "scroll",
  },
  emergencyDetailsContainer: {
    marginTop: heightPercentageToDP('1%'),
    height: heightPercentageToDP('35%')
  },
  endButton: {
    width: widthPercentageToDP("80%"),
    flexDirection: "row-reverse",
    marginTop: heightPercentageToDP("4%"),
  },
});

export default AcceptRequestScreen;
