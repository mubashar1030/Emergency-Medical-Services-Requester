import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import MapView, { Marker } from "react-native-maps";
import MyButton from "../components/MyButton";
import Photo from "../components/Photo";
import call from "react-native-phone-call";
import InfoText from "../components/InfoText";
import { auth, db, firebase } from "../components/ApiInfo";
import {
  getCurrentUser,
  getTime,
  photoUrlRetriver,
  removeRequestFromServicing,
  pushNotificaionRequester,
} from "../components/dbComm";
import { registerForPushNotificationsAsync } from "../components/PushNotification";

// This screen is only available to EMS Members. Through this screen
// the requester can accept requests and view request information.
const AcceptRequestScreen = () => {
  const [currentRequests, setCurrentRequests] = useState([]);
  const [isRequestAccepted, setIsRequestAccepted] = useState(false);
  const [requestAccepted, setRequestAccepted] = useState(null);
  const [isRequestSelected, setIsRequestSelected] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  let content;

  const [checkInPending, setCheckInPending] = useState(() => {
    var ref = db
      .collection("servicing requests")
      .where("EMS Member Email", "==", auth.currentUser.email);
    ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        setRequestAccepted(doc.data());
        setRequestSelected(doc.data());
        console.log(doc.data());
        setIsRequestAccepted(true);
        setIsRequestSelected(false);
        requestEndListener();
      });
    });
  });

  // This function updates the requester once his request has be accepted.
  const updateRequester = () => {
    var ref = db
      .collection("pending requests")
      .where("email", "==", requestSelected["email"]);
    ref.get().then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
    let memberDetails = getCurrentUser();
    let requesterAndMemberDetails = requestSelected;
    requesterAndMemberDetails["EMS Member Name"] = memberDetails["name"];
    requesterAndMemberDetails["EMS Member Email"] = memberDetails["email"];
    requesterAndMemberDetails["EMS Member Phone"] = memberDetails["phone"];
    requesterAndMemberDetails["EMS Member Photo"] = { uri: photoUrlRetriver() };
    requesterAndMemberDetails["dateTime Accepted"] = getTime();
    db.collection("servicing requests").add(requesterAndMemberDetails);
    db.collection("history").add(requesterAndMemberDetails);
    console.log("Success: The Request Is Moved To 'Servicing Requests'");
    try {
      pushNotificaionRequester(requestSelected["email"]);
      console.log("Success: push notificaion sent to Requester");
    } catch (error) {
      console.log("Update: token for requester not in database");
    }
  };

  // This function listens if the requester has ended the request.
  const requestEndListener = () => {
    let observer = db
      .collection("servicing requests")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "removed") {
            let item = change.doc.data();
            if (item["EMS Member Email"] == auth.currentUser.email) {
              setIsRequestAccepted(false);
              // console.log('>>>>>>>>>>>>>>>>>>>>>>> ', currentRequests)
              return;
            }
          }
        });
      });
  };




  const [pushNotificaiton, setpushNotificaiton] = useState(() => {
    registerForPushNotificationsAsync();
  });

  // The content of the screen varies as the EMS member performs
  // different operations available to him. The below conditions makes sure of it.
  if (!isRequestAccepted) {
    if (currentRequests.length === 0) {
      // the content for when there are no requests
      content = (
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.upperText}>There are Currently</Text>
            <Text style={styles.lowerText}>No Requests!</Text>
          </View>
        </View>
      );
    } else {
      if (!isRequestSelected) {
        // the content for when viewing the list of all current requests
        content = (
          <View style={styles.container}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Requests</Text>
            </View>
            <FlatList
              data={currentRequests}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  onPress={() => { viewRequestHandler(item); console.log(currentRequests.length) }}
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
        // the content for when a request is selected to be viewed in more detail
        const region = {
          latitude: requestSelected.latitude,
          longitude: requestSelected.longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.0006,
        };
        content = (
          <View style={styles.container}>
            <View
              style={{
                ...styles.textContainer,
                marginTop: "2%",
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
      // the content for the details of accepted request
      latitude: requestAccepted.latitude,
      longitude: requestAccepted.longitude,
      latitudeDelta: 0.002,
      longitudeDelta: 0.0006,
    };
    content = (
      <View style={styles.container}>
        <View
          style={{
            ...styles.textContainer,
            marginTop: "2%",
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
                height: "30%",
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
            onPress={() => {
              setIsRequestAccepted(false);
              // setIsRequestSelected(false);
              removeRequestFromServicing("EMS Member Email");
              console.log("Update: EMS Member Ended Request");
              // console.log("After End: ", currentRequests);
            }}
          />
        </View>
      </View>
    );
  }

  const viewRequestHandler = (item) => {
    setRequestSelected(item);
    setIsRequestSelected(true);
    console.log(item.id);

  };
  const acceptRequestHandler = () => {
    setIsRequestAccepted(true);
    setIsRequestSelected(false);
    setRequestAccepted(requestSelected);
    updateRequester();
    requestEndListener();
  };
  const makeCall = (phoneNumber) => {
    const args = {
      number: phoneNumber,
      prompt: false,
    };
    call(args).catch(console.error);
  };



  // This function listens for changes request list.
  const requestListener = async () => {
    console.log("Before Addition: ", currentRequests);
    var requestLst = []
    let observer = db
      .collection("pending requests")
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            console.log("Update: New Request Detected");
            requestLst.push(change.doc.data());
            setCurrentRequests((previousRequests) => [
              ...previousRequests,
              change.doc.data(),
            ]);
            console.log("After Addition: ", requestLst);
            setCurrentRequests(requestLst);

          }
          if (change.type === "modified") {
            console.log("Modified Request: ", change.doc.data());
          }
          if (change.type === "removed") {
            console.log("Update: A request was removed");
            console.log("after removal:    ", currentRequests);
            let item = change.doc.data();
            for (var i = 0; i < requestLst.length; i++) {
              if (requestLst[i]["email"] == item["email"]) {
                requestLst.splice(i, 1);
              }
            }
            console.log("requstLst: ", requestLst);
            setCurrentRequests(requestLst);
          }
        });
      });
  };

  const [listener, setListener] = useState(() => {
    requestListener();
  });

  return <View style={{ flex: 1 }}>{content}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
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
  },
  photo2: {
    width: widthPercentageToDP("20%"),
    height: widthPercentageToDP("20%"),
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
    height: "30%",
    marginTop: heightPercentageToDP("3%"),
    paddingHorizontal: widthPercentageToDP("5%"),
  },
  label: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("5%"),
    color: Colors.secondary,
    fontWeight: "bold",
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
    height: "50%",
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
    height: "42%",
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
