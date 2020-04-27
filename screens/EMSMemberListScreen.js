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
  const [isAddNewMember, setIsAddNewMember] = useState(false);
  const [isMemberSelected, setIsMemberSelected] = useState(false);
  const [memberSelected, setMemberSelected] = useState(null);
  const [memberList, setMemberList] = useState([
    {
      id: Math.floor(Math.random() * 1000).toString(),
      name: "John",
      phone: "090078601",
      email: "dummy@dummy.com",
      photo: require("../assets/dummy.png"),
    },
  ]);
  let content;

  if (isAddNewMember) {
    content = (
      <View style={styles.container}>
        <Text>Hello</Text>
      </View>
    );
  } else if (isMemberSelected) {
    content = (
      <View style={styles.container}>
        <Photo photo={memberSelected.photo} photoContainerStyle={{marginTop: '20%'}}/>
        <View style={styles.memberInformationContainer}>

        </View>
      </View>
    );
  } else {
    content = (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>EMS Members</Text>
        </View>
        <View style={styles.addMemberButton}>
          <MyButton
            buttonStyle={{
              width: widthPercentageToDP("30%"),
              height: heightPercentageToDP("6%"),
              backgroundColor: Colors.tertiary,
            }}
            text="Add Member"
            textStyle={{
              fontSize: widthPercentageToDP("4%"),
              color: Colors.secondary,
            }}
            // onPress={() => setIsRequestAccepted(false)}
          />
        </View>
        <FlatList
          data={memberList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => viewMemberHandler(item)}
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
                  label="Email:"
                  text={item.email}
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
  }
  const viewMemberHandler = (item) => {
    setIsMemberSelected(true);
    setMemberSelected(item), console.log(item.id);
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
    width: '90%',//widthPercentageToDP("90%"),
    marginTop: '2%',//heightPercentageToDP("2%"),
    marginBottom: '1%',//heightPercentageToDP("1%"),
  },
  title: {
    fontFamily: "Helvetica",
    color: Colors.primary,
    fontSize: 32,//heightPercentageToDP("4%"),
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
    width: "80%",
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  addMemberButton: {
    width: widthPercentageToDP("82%"),
    flexDirection: "row-reverse",
    marginTop: '1%',//heightPercentageToDP("1%"),
    marginBottom: '1%'//heightPercentageToDP("1%"),
  },
  memberInformationContainer: {
    width: widthPercentageToDP('90%'),
    height: '40%',//heightPercentageToDP('40%'),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP('7%'),
    marginTop: heightPercentageToDP('3%')
  }
});

export default AcceptRequestScreen;
