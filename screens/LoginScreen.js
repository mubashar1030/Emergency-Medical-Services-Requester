import React, { useState } from "react";
import { StyleSheet, Text, View, Button, TouchableOpacity } from "react-native";
import Colors from "../constants/colors.js";
import CustomButton from "../components/CustomButton";

const LoginScreen = (props) => {
    return(
        <View style={styles.container}>
            <Text>Login Screen</Text>
        </View>
    )
};

const styles= StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

export default LoginScreen;