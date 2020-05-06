import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import Colors from "../constants/colors.js";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import MyButton from "../components/MyButton";
import Photo from "../components/Photo";
import InfoText from "../components/InfoText";
import { auth, db, firebase } from '../components/ApiInfo';
import { addNewEmsMember, removeMember, makeAdmin } from "../components/dbComm";
import * as Progress from "react-native-progress";

const AcceptRequestScreen = () => {
  const [isAddNewMember, setIsAddNewMember] = useState(false);
  const [isMemberSelected, setIsMemberSelected] = useState(false);
  const [memberSelected, setMemberSelected] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [isAddingMemberOverlay,setIsAddingMemberOverlay] = useState(false);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberPhone, setNewMemberPhone] = useState('');
  const [newMemberPassword, setNewMemberPassword] = useState('');
  const [newMemberConfirmPassword, setNewMemberConfirmPassword] = useState('');

  const memberListener = () => {
    let observer = db.collection('users')
      .onSnapshot(querySnapshot => {
        querySnapshot.docChanges().forEach(async (change) => {
          if (change.type === 'added') {
            var item = change.doc.data();
            var URL;
            if (item['user_type'] == 'EMS_Member') {
              try {
                var ref = await firebase.storage().ref("profile photo").child(item['email']).getDownloadURL().then(url => {
                  URL = url;
                });
                item['photo'] = { uri: URL };
                console.log("Success: Image Retrived From Database");
              } catch (error) {
                item['photo'] = { uri: "https://therminic2018.eu/wp-content/uploads/2018/07/dummy-avatar-300x300.jpg" };
              }

              setMemberList(memberList => [...memberList, item]);
            }
          }
        });
      });
  }
  const [getMembers, setGetMembers] = useState(() => {
    memberListener();
  })

  const makeAdminHandler = () => {
    Alert.alert("Are you sure?", "", [
      {
        text: "Yes",
        style: "cancel",
        onPress: () => {
          makeAdmin(memberSelected);
          setIsMemberSelected(false);
          if (memberList.length != 1) {
            for (var i = 0; i < memberList.length; i++) {
              if (memberList[i]['email'] == memberSelected['email']) {
                memberList.splice(i, 1);
                break;
              }
            }
          }
          else {
            setMemberList([]);
          }
        }
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const removeMemberHandler = () => {
    Alert.alert("Are you sure?", "", [
      {
        text: "Yes",
        style: "cancel",
        onPress: () => {
          removeMember(memberSelected);
          setIsMemberSelected(false);
          if (memberList.length != 1) {
            for (var i = 0; i < memberList.length; i++) {
              if (memberList[i]['email'] == memberSelected['email']) {
                memberList.splice(i, 1);
                break;
              }
            }
          }
          else {
            setMemberList([]);
          }
        },
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);


  };

  const addMemberHandler = async () => {
    if (newMemberPassword !== newMemberConfirmPassword) {
      Alert.alert("Password do not match", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    }  else if (newMemberPassword.length < 6) {
      Alert.alert("Password length should be atleast six", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    } else if (newMemberPhone.length!==11 || newMemberPhone.match(/[0-9]/g).length!==11) {
      Alert.alert("Please enter a valid phone number", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    }
    else {
      let userProfile = {
        email: newMemberEmail,
        name: newMemberName,
        phone: newMemberPhone,
        user_type: "EMS_Member",
      };
      setIsAddingMemberOverlay(true);
      var dbReply = await addNewEmsMember(userProfile, newMemberPassword);
      setIsAddingMemberOverlay(false);

      if (dbReply) {
        setIsAddNewMember(false);
      } else {
        Alert.alert("Error: Email already in use", "", [
          {
            text: "Okay",
            style: "cancel",
          },
        ]);
      }
    }
  }

  // The below condition brings up an overlay when new EMS member information
  // is being verfying by database.
  let addingMemberOverlay;
  if (isAddingMemberOverlay) {
    addingMemberOverlay = (
      <View style={styles.addingMemberOverlayContainer}>
        <Progress.Bar indeterminate width={200} color={Colors.secondary} />
        <Text style={{ ...styles.signupText, paddingTop: "2%" }}>
          Working on it...
        </Text>
      </View>
    );
  }


  let content;

  if (isAddNewMember) {
    // console.log()
    content = (
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.addMemberContaniner}>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                onChangeText={(text) => setNewMemberName(text)}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Email"
                onChangeText={(text) => setNewMemberEmail(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Phone (e.g 03213456789)"
                onChangeText={(text) => setNewMemberPhone(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password (atleast 6 characters)"
                onChangeText={(text) => setNewMemberPassword(text)}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                onChangeText={(text) => setNewMemberConfirmPassword(text)}
                autoCapitalize="none"
                secureTextEntry={true}
              />
            </View>
          </View>
          <View style={styles.buttonContainer2}>
            <MyButton onPress={() => addMemberHandler()} text="Add Member" />
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => setIsAddNewMember(false)}
          >
            <Text style={styles.signupText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {addingMemberOverlay}
      </ScrollView>
    );
  } else if (isMemberSelected) {
    content = (
      <View style={styles.container}>
        <Photo
          photo={memberSelected.photo}
          photoContainerStyle={{ marginTop: "20%" }}
        />
        <View style={styles.memberInformationContainer}>
          <View style={styles.memberDetails}>
            <InfoText
              label="Name: "
              text={memberSelected.name}
              border={1}
              labelWidth={widthPercentageToDP("18%")}
              fontSize={16}
            />
            <InfoText
              label="Email: "
              text={memberSelected.email}
              border={1}
              labelWidth={widthPercentageToDP("18%")}
              fontSize={16}
            />
            <InfoText
              label="Phone: "
              text={memberSelected.phone}
              border={1}
              labelWidth={widthPercentageToDP("18%")}
              fontSize={16}
            />
          </View>
          <View style={styles.buttonContainer}>
            <MyButton
              buttonStyle={{
                width: "40%", //widthPercentageToDP("25%"),
                height: "70%", //heightPercentageToDP("5%"),
              }}
              text="Make Admin"
              textStyle={{ fontSize: 17 }}
              onPress={() => makeAdminHandler()}
            />
            <MyButton
              buttonStyle={{
                width: "40%", //widthPercentageToDP("25%"),
                height: "70%", //heightPercentageToDP("5%"),
              }}
              text="Remove"
              textStyle={{ fontSize: 17 }}
              onPress={() => removeMemberHandler()}
            />
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
            onPress={() => setIsMemberSelected(false)}
          />
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
            onPress={() => setIsAddNewMember(true)}
          />
        </View>
        <FlatList
          data={memberList}
          keyExtractor={(item) => item.email}
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
    justifyContent: "center",
    backgroundColor: Colors.tertiary,
  },
  scrollContainer: {
    // paddingVertical: heightPercentageToDP("10%"),
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1
  },
  titleContainer: {
    width: "90%", //widthPercentageToDP("90%"),
    marginTop: "2%", //heightPercentageToDP("2%"),
    marginBottom: "1%", //heightPercentageToDP("1%"),
  },
  title: {
    fontFamily: "Helvetica",
    color: Colors.primary,
    fontSize: 32, //heightPercentageToDP("4%"),
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
    marginTop: "1%", //heightPercentageToDP("1%"),
    marginBottom: "1%", //heightPercentageToDP("1%"),
  },
  memberInformationContainer: {
    width: widthPercentageToDP("90%"),
    height: "35%", //heightPercentageToDP('40%'),
    elevation: 4,
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("7%"),
    marginTop: heightPercentageToDP("3%"),
    paddingVertical: "3%",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  memberDetails: {
    width: "100%",
    paddingHorizontal: "6%",
  },
  buttonContainer: {
    // backgroundColor: 'blue',
    width: "88%",
    height: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "5%",
  },
  endButton: {
    width: widthPercentageToDP("90%"),
    flexDirection: "row-reverse",
    marginTop: "10%", //heightPercentageToDP("4%"),
  },
  addMemberContaniner: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("50%"),
    justifyContent: "space-evenly",
    // paddingTop: heightPercentageToDP("6%"),
    backgroundColor: Colors.tertiary,
    alignItems: "center",
    // elevation: 4,
    // borderRadius: 25
  },
  inputContainer: {
    width: "85%", //widthPercentageToDP("70%"),
    height: "12%", //heightPercentageToDP("7%"),
    backgroundColor: Colors.tertiary,
    borderRadius: widthPercentageToDP("5%"),
    elevation: 4,
    justifyContent: "center",
    paddingLeft: heightPercentageToDP("3%"),
  },
  buttonContainer2: {
    marginTop: "3%",
    marginBottom: '3%'
  },
  signupText: {
    fontFamily: "Helvetica",
    fontSize: 25,
    color: Colors.secondary,
  },
  addingMemberOverlayContainer: {
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

export default AcceptRequestScreen;
