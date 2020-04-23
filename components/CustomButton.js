import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Colors from '../constants/colors.js';
import { Ionicons, Entypo } from '@expo/vector-icons';

// This is a custom button component.
// It is built for icons on the left side and title on the right side.

const CustomButton = (props) => {
    return (
        <TouchableOpacity style={{ ...styles.button, ...props.buttonStyle }}>
            <View style={{ ...styles.buttonLabel, ...props.buttonLabelStyle }}>
                <View style={{ ...styles.mainIcon, ...props.secondIconStyle }}>
                    <Ionicons
                        name={props.icon1}
                        size={props.icon1Size}
                        color={Colors.secondary}
                    />
                    {/* The following icon is overlapped on the bottom right of first icon. */}
                    <View style={{ ...styles.secondIcon, ...props.secondIconStyle }}>
                        <Entypo
                            name={props.icon2}
                            size={props.icon2Size}
                            color={Colors.primary}
                        />
                    </View>
                </View>
                <Text style={{ ...styles.buttonText, ...props.buttonTextStyle }} >
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        elevation: 4,
        width: '90%',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: '20%',
        backgroundColor: Colors.tertiary,
        borderRadius: 30

    },
    buttonLabel: {
        width: '80%',
        height: '60%',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: '5%'
    },
    mainIcon: {
        width: '30%',
        height: '80%',
        justifyContent: "center",
    },
    secondIcon: {
        paddingLeft: '40%',
        paddingTop: '70%',
        position: 'absolute'
    },
    buttonText: {
        paddingLeft: '10%',
        fontFamily: 'Helvetica',
        fontSize: 20,
        fontWeight: "bold",
        color: Colors.secondary
    }


})

export default CustomButton;