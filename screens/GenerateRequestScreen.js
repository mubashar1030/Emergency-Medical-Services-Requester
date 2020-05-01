import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import MyButton from "../components/MyButton";
import Photo from '../components/Photo'
import * as Progress from "react-native-progress";
import call from "react-native-phone-call";
import { updateRequestDB } from '../components/dbComm';

const GenerateRequestScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 31.47, //31.5770699,//31.47,
    longitude: 74.4111, //74.3751424,//74.4111,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [isRequestGenerated, setIsRequestGenerated] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [emergencyDetails, setEmergencyDetails] = useState("");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log("hello");
      }
      console.log("hello1");
      setTimeout(() => {
        Location.getCurrentPositionAsync({}).then((location) => {
          setLocation(location);
          setRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421,
          });
        });
      }, 200);
    })();
  }, []);

  let Map;
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    Map = (
      <MapView
        style={styles.map}
        initialRegion={region}
        onRegionChange={(reg) => setRegion(reg)}
        showsUserLocation
        showsMyLocationButton
        // region={region}
      >
        <Marker
          coordinate={{
            latitude: region.latitude,
            longitude: region.longitude,
          }}
        />
      </MapView>
    );
  }

  const onRequestEMSPressHandler = () => {
    console.log(emergencyDetails);
    setShowMap(true);
    setIsRequestGenerated(true);
    setIsRequestAccepted(false);
    updateRequestDB(region, emergencyDetails);
  };

  const onEndRequestHandler = () => {
    setShowMap(true);
    setIsRequestGenerated(false);
    setIsRequestAccepted(false);
  };

  const makeCall = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: false,
    };
    call(args).catch(console.error);
  };

  let content;
  if (!isRequestGenerated) {
    if (showMap) {
      content = (
        <View style={styles.container}>
          <View style={styles.mapContainer}>{Map}</View>
          <View style={styles.buttonContainer}>
            <MyButton onPress={() => setShowMap(false)} text="Next" />
          </View>
        </View>
      );
    } else {
      content = (
        <ScrollView
          contentContainerStyle={{ alignItems: "center", flexGrow: 1 }}
        >
          <View Style={styles.container}>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                placeholder="Emergency details"
                onChangeText={(text) => setEmergencyDetails(text)}
              />
            </View>
            <View style={styles.buttonContainer2}>
              <MyButton onPress={onRequestEMSPressHandler} text="Request EMS" />
            </View>
            <TouchableOpacity
              style={{ alignItems: "center" }}
              onPress={() => setShowMap(true)}
            >
              <Text style={styles.gobackText}>Go Back</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
  } else {
    if (!isRequestAccepted) {
      content = (
        <View style={styles.container}>
          {/* <View style={styles.mapContainer}>{Map}</View> */}
          <View style={styles.waitingTextContainer}>
            <Text style={styles.waitingText1}>Searching for Responder</Text>
            <Text style={styles.waitingText2}>Please Wait</Text>
          </View>
          <Progress.Bar indeterminate width={200} color={Colors.secondary} />
          <View style={styles.buttonContainer}>
            <MyButton
              onPress={() => {
                setShowMap(true);
                setIsRequestGenerated(false);
              }}
              text="Cancel"
            />
          </View>
        </View>
      );
      console.log("hit");
      setTimeout(() => {
        setIsRequestAccepted(true);
      }, 3000);
    } else {
      content = (
        <View style={styles.container}>
          {/* <View style={styles.photoContainer}>
            <Image
              source={require("../assets/dummy.png")}
              style={styles.photo}
            />
          </View> */}
          <Photo photo={require("../assets/dummy.png")} photoContainerStyle={{marginTop: '20%'}}/>
          <View
            style={{
              ...styles.waitingTextContainer,
              marginTop: heightPercentageToDP("3%"),
            }}
          >
            <Text style={styles.waitingText1}>EMS is</Text>
            <Text style={styles.waitingText2}>On Their Way!</Text>
          </View>
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoText}>Name: Call Me</Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.infoText}>Phone: 090078601</Text>
              <TouchableOpacity style={styles.callButton} onPress={()=>makeCall('090078601')}>
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.endButtonContainer}>
            <TouchableOpacity
              style={styles.endButton}
              onPress={onEndRequestHandler}
            >
              <Text style={styles.endButtonText}>End</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  }

  return (
    // <View style={styles.container}>
    //   <View style={styles.mapContainer}>{Map}</View>
    //   <View style={styles.buttonContainer}>
    //     <TouchableOpacity style={styles.button}>
    //       <Text style={styles.text}>Next</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>
    <View style={{ flex: 1 }}>{content}</View>
    // {content}
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
  mapContainer: {
    marginTop: heightPercentageToDP("5%"),
    borderRadius: widthPercentageToDP("7%"),
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("60%"),
    elevation: 2,
    overflow: "hidden",
    backgroundColor: Colors.tertiary,
  },
  map: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("60%"),
    borderRadius: widthPercentageToDP("7%"),
  },
  buttonContainer: {
    // position: "absolute",
    marginTop: '10%',//heightPercentageToDP("80%"),
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
  inputContainer: {
    width: widthPercentageToDP("90%"),
    height: '65%',//heightPercentageToDP("60%"),
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("7%"),
    elevation: 4,
    // justifyContent: "center",
    paddingVertical: heightPercentageToDP("2%"),
    paddingHorizontal: heightPercentageToDP("3%"),
    marginTop: heightPercentageToDP("5%"),
  },
  buttonContainer2: {
    alignItems: "center",
    marginTop: heightPercentageToDP("5%"),
    marginBottom: heightPercentageToDP("2%"),
    // position: "absolute",
    // marginTop: heightPercentageToDP("80%"),
  },
  gobackText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2.5%"),
    color: Colors.secondary,
  },
  waitingTextContainer: {
    marginTop: heightPercentageToDP("30%"),
    alignItems: "center",
    marginBottom: heightPercentageToDP("3%"),
  },
  waitingText1: {
    fontFamily: "Helvetica",
    color: Colors.secondary,
    fontSize: heightPercentageToDP("3%"),
  },
  waitingText2: {
    fontFamily: "Helvetica",
    color: Colors.primary,
    fontSize: heightPercentageToDP("4%"),
  },
  photoContainer: {
    marginTop: heightPercentageToDP("15%"),
    borderRadius: heightPercentageToDP("100%"),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    overflow: "hidden",
    borderWidth: widthPercentageToDP('1%'),
    borderColor: Colors.tertiary
  },
  photo: {
    width: widthPercentageToDP("50%"),
    height: widthPercentageToDP("50%"),
    resizeMode: "contain",
  },
  infoTextContainer: {
    elevation: 4,
    borderRadius: widthPercentageToDP("7%"),
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("15%"),
    backgroundColor: Colors.tertiary,
    // alignItems: 'center',
    paddingLeft: widthPercentageToDP("5%"),
    paddingRight: widthPercentageToDP("5%"),
    justifyContent: "space-evenly",
  },
  infoText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2%"),
    color: Colors.secondary,
  },
  phoneContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  callButton: {
    width: widthPercentageToDP("15%"),
    height: heightPercentageToDP("4%"),
    backgroundColor: Colors.tertiary,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPercentageToDP("4%"),
  },
  callButtonText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2%"),
    color: Colors.secondary,
  },
  endButtonContainer: {
    // position: "absolute",
    width: widthPercentageToDP("100%"),
    height: heightPercentageToDP("6%"),
    marginTop: '5%'
  },
  endButton: {
    // position: 'absolute',
    width: widthPercentageToDP("25%"),
    height: heightPercentageToDP("6%"),
    backgroundColor: Colors.primary,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPercentageToDP("5%"),
    // marginTop: '5%',//heightPercentageToDP("82%"),
    marginLeft: widthPercentageToDP("70%"),
  },
  endButtonText: {
    fontFamily: "Helvetica",
    fontSize: heightPercentageToDP("2%"),
    color: Colors.tertiary,
    fontWeight: "bold",
  },
});

export default GenerateRequestScreen;
