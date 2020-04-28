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

  const [newMemberName, setNewMemberName] =useState('');
  const [newMemberEmail, setNewMemberEmail] =useState('');
  const [newMemberPhone, setNewMemberPhone] =useState('');
  const [newMemberPassword, setNewMemberPassword] =useState('');
  const [newMemberConfirmPassword, setNewMemberConfirmPassword] =useState('');

  const makeAdminHandler = () => {
    Alert.alert("Are you sure?", "", [
      {
        text: "Yes",
        style: "cancel",
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
      },
      {
        text: "No",
        style: "cancel",
      },
    ]);
  };

  const addMemberHandler = () => {
    if (newMemberPassword !== newMemberConfirmPassword){
      Alert.alert("Password do not match", "", [
        {
          text: "Okay",
          style: "cancel",
        },
      ]);
    }
  }

  let content;

  if (isAddNewMember) {
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
                placeholder="Phone"
                onChangeText={(text) => setNewMemberPhone(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Password"
                onChangeText={(text) => setNewMemberPassword(text)}
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Confirm Password"
                onChangeText={(text) => setNewMemberConfirmPassword(text)}
                autoCapitalize="none"
              />
            </View>
          </View>
          <View style={styles.buttonContainer2}>
            <MyButton onPress={() => addMemberHandler()} text="Add Member" />
          </View>
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={()=>setIsAddNewMember(false)}
          >
            <Text style={styles.signupText}>Cancel</Text>
          </TouchableOpacity>
        </View>
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
  scrollContainer: {
    paddingVertical: heightPercentageToDP("10%"),
    alignItems: "center",
    justifyContent: "center",
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
});

export default AcceptRequestScreen;
