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
import Photo from "../components/Photo";
import * as Progress from "react-native-progress";
import call from "react-native-phone-call";
import {
  updateRequestDB,
  removeRequestFromServicing,
  sendPushNotification,
  removeRequestFromPending,
} from "../components/dbComm";
import { auth, db, firebase } from "../components/ApiInfo";
import { registerForPushNotificationsAsync } from "../components/PushNotification";

// This screen is only available to Requester. Through this screen
// the requester can generate requests and view responder information.
const GenerateRequestScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: 31.47,
    longitude: 74.4111,
    latitudeDelta: 0.00922,
    longitudeDelta: 0.00421,
  });
  const [isRequestGenerated, setIsRequestGenerated] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [emergencyDetails, setEmergencyDetails] = useState("");
  const [emsMemberDetails, setEmsMemberDetails] = useState({
    name: "",
    phone: "",
    photo: {},
  });
  const [PushNotification, setPushNotification] = useState(() => {
    registerForPushNotificationsAsync();
  });
  const [checkIfRequestExists, setCheckIfRequestExists] = useState(() => {
    var ref = db
      .collection("pending requests")
      .where("email", "==", auth.currentUser.email);
    ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        setIsRequestGenerated(true);
        setIsRequestAccepted(false);
      });
    });
  })

  useEffect(() => {
    (async () => {
      // get location permission
      let { status } = await Location.requestPermissionsAsync().catch(
        async () => {
          await Location.requestPermissionsAsync();
        }
      );
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        console.log("hello");
      }
      console.log("Success: Location Permission Granted");
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

  // set map region
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

  // this function listens if the request has been accepted
  const acceptanceListener = () => {
    let observer = db
      .collection("servicing requests")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            var item = change.doc.data();
            var valuePresent = false;

            if (item["email"] == auth.currentUser.email) {
              valuePresent = true;
              console.log(valuePresent);
              setEmsMemberDetails({
                name: item["EMS Member Name"],
                phone: item["EMS Member Phone"],
                photo: item["EMS Member Photo"],
              });
              setIsRequestAccepted(true);
            }
          }
          if (change.type === "modified") {
            console.log("Modified Request: ", change.doc.data());
          }
          if (change.type === "removed") {
            let item = change.doc.data();
            if (item["email"] == auth.currentUser.email) {
              setIsRequestGenerated(false);
              return;
            }
          }
        });
      });
  };

  const [listener, setListener] = useState(() => {
    acceptanceListener();
  })

  const onRequestEMSPressHandler = () => {
    console.log(emergencyDetails);
    setShowMap(true);
    setIsRequestGenerated(true);
    setIsRequestAccepted(false);
    updateRequestDB(region, emergencyDetails);
    // acceptanceListener();
    sendPushNotification();
  };

  const onEndRequestHandler = () => {
    setShowMap(true);
    setIsRequestGenerated(false);
    setIsRequestAccepted(false);
    removeRequestFromServicing("email");
    console.log("Update: Requester Ended Request");
  };

  // opens phone app
  const makeCall = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: false,
    };
    call(args).catch(console.error);
  };

  // The content of the screen varies as the EMS member performs
  // different operations available to him. The below conditions makes sure of it.
  let content;
  if (!isRequestGenerated) {
    if (showMap) {
      // the content when requester selects location
      content = (
        <View style={styles.container}>
          <View style={styles.mapContainer}>{Map}</View>
          <View style={styles.buttonContainer}>
            <MyButton onPress={() => setShowMap(false)} text="Next" />
          </View>
        </View>
      );
    } else {
      // the content when requester adds emergency details
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
      // the content when requester waits for his request to be accepted
      content = (
        <View style={styles.container}>
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
                removeRequestFromPending();
              }}
              text="Cancel"
            />
          </View>
        </View>
      );
      console.log("Update: Waiting For Request To Be Accepted...");
    } else {
      // the content where requester views responder information
      console.log("Success: Request Accepted");
      content = (
        <View style={styles.container}>
          <Photo
            photo={emsMemberDetails["photo"]}
            photoContainerStyle={{ marginTop: "10%" }}
            photoStyle={styles.photo}
          />
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
            <Text style={styles.infoText}>
              Name: {emsMemberDetails["name"]}
            </Text>
            <View style={styles.phoneContainer}>
              <Text style={styles.infoText}>
                Phone: {emsMemberDetails["phone"]}
              </Text>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => makeCall(emsMemberDetails["phone"])}
              >
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

  return <View style={{ flex: 1 }}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: Colors.tertiary,
  },
  mapContainer: {
    marginTop: heightPercentageToDP("5%"),
    borderRadius: widthPercentageToDP("7%"),
    width: widthPercentageToDP("90%"),
    height: "70%",
    elevation: 2,
    overflow: "hidden",
    backgroundColor: Colors.tertiary,
  },
  map: {
    width: "100%",
    height: "100%",
    borderRadius: widthPercentageToDP("7%"),
  },
  buttonContainer: {
    marginTop: "10%",
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
    height: "65%",
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("7%"),
    elevation: 4,
    paddingVertical: heightPercentageToDP("2%"),
    paddingHorizontal: heightPercentageToDP("3%"),
    marginTop: heightPercentageToDP("5%"),
  },
  buttonContainer2: {
    alignItems: "center",
    marginTop: heightPercentageToDP("5%"),
    marginBottom: heightPercentageToDP("2%"),
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
    borderWidth: widthPercentageToDP("1%"),
    borderColor: Colors.tertiary,
  },
  photo: {
    width: widthPercentageToDP("40%"),
    height: widthPercentageToDP("40%"),
    resizeMode: "contain",
  },
  infoTextContainer: {
    elevation: 4,
    borderRadius: widthPercentageToDP("7%"),
    width: widthPercentageToDP("70%"),
    height: heightPercentageToDP("15%"),
    backgroundColor: Colors.tertiary,
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
    width: widthPercentageToDP("100%"),
    height: heightPercentageToDP("6%"),
    marginTop: "5%",
  },
  endButton: {
    width: widthPercentageToDP("25%"),
    height: heightPercentageToDP("6%"),
    backgroundColor: Colors.primary,
    elevation: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: widthPercentageToDP("5%"),
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
