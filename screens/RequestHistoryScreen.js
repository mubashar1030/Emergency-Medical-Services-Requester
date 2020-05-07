import React, { useState } from "react";
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
import MyButton from "../components/MyButton";
import InfoText from "../components/InfoText";
import { auth, db, firebase } from "../components/ApiInfo";

// Through this screen the administrator can view the request history.
const AcceptRequestScreen = () => {
  const [requestHistory, setRequestHistory] = useState([]);
  const [isRequestSelected, setIsRequestSelected] = useState(false);
  const [requestSelected, setRequestSelected] = useState(null);
  const [historyUpdate, setHistoryUpdate] = useState(false);
  let content;

  // The below function listens for changes in request history.
  const historyListener = () => {
    let observer = db.collection("history").onSnapshot((querySnapshot) => {
      querySnapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          var item = change.doc.data();
          setRequestHistory((requestHistory) => [...requestHistory, item]);
        }
      });
    });
  };
  const [getHistroy, setGetHistroy] = useState(() => {
    historyListener();
  });

  // The content of the screen varies as the admin performs
  // different operations available to him. The below conditions makes sure of it.
  if (!isRequestSelected) {
    // the content for when admin wants to view all request history.
    content = (
      <View style={styles.container}>
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
                  text={item.name}
                  border={1}
                  labelWidth={widthPercentageToDP("22%")}
                  fontSize={widthPercentageToDP("4%")}
                />
                <InfoText
                  label="Responder: "
                  text={item["EMS Member Name"]}
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
    // the content for when admin wants to view a specific request.
    content = (
      <View style={styles.container}>
        <View style={styles.requestDetailContainer}>
          <View style={styles.requestDetails}>
            <InfoText
              label="Requester: "
              text={requestSelected["name"]}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Phone: "
              text={requestSelected["phone"]}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Responder: "
              text={requestSelected["EMS Member Name"]}
              border={1}
              labelWidth={widthPercentageToDP("22%")}
              fontSize={widthPercentageToDP("4%")}
            />
            <InfoText
              label="Phone: "
              text={requestSelected["EMS Member Phone"]}
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
              <ScrollView style={styles.emergencyDetails}>
                <Text style={styles.infoText}>
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
  },
  requestDetailContainer: {
    elevation: 4,
    backgroundColor: Colors.tertiary,
    width: widthPercentageToDP("80%"),
    height: "70%",
    marginTop: heightPercentageToDP("5%"),
    borderRadius: widthPercentageToDP("7%"),
    paddingVertical: heightPercentageToDP("3%"),
    justifyContent: "space-evenly",
    alignItems: "center",
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
    paddingHorizontal: widthPercentageToDP("2.5%"),
    justifyContent: "space-evenly",
  },
  infoText: {
    fontFamily: "Helvetica",
    fontSize: widthPercentageToDP("4%"),
    color: Colors.secondary,
    paddingLeft: widthPercentageToDP("2%"),
  },
  emergencyDetails: {
    paddingHorizontal: widthPercentageToDP("2%"),
    width: widthPercentageToDP("67%"),
    overflow: "scroll",
  },
  emergencyDetailsContainer: {
    marginTop: heightPercentageToDP("1%"),
    height: "50%",
  },
  endButton: {
    width: widthPercentageToDP("80%"),
    flexDirection: "row-reverse",
    marginTop: heightPercentageToDP("4%"),
  },
});

export default AcceptRequestScreen;
