import React, { useState, Component } from "react";
import { StyleSheet, Text, View, Image, Animated, Button, TouchableOpacity } from "react-native";

import Logo from '../assets/logo.png'


class SplashScreen extends Component {

    state ={
        LogoAnim: new Animated.Value(0),
        TextAnim: new Animated.Value(0),
        LoadingSpinner: false,
    }

    componentDidMount(){
        const {LogoAnim, TextAnim} = this.state;

        Animated.parallel([
            Animated.spring(LogoAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                duration: 1000,
            }).start(),

            Animated.timing(TextAnim, {
                toValue: 1,
                duration: 1200,
            }),
        ]).start(() => {
            this.setState({
                LoadingSpinner: true,
            });
        });
    }

    render()
    {
        return(
            <View style={styles.container}>
                <Animated.View style={{
                    opacity: this.state.LogoAnim,
                    top: this.state.LogoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [80, 0],
                    })
                }}>
                    <Image source={Logo} style={{width: 250, height: 250}} resizeMode="contain"/>
                </Animated.View>
                <Animated.View style={{
                    opacity: this.state.TextAnim,
                }}>
                    <Text style={styles.textStyle}>EMS Requester</Text>
                </Animated.View>
            </View>
        )
    }
}

const styles = StyleSheet.create({

        container: {
            flex: 1,
            backgroundColor: '#F4F4F4',
            justifyContent: 'center',
            alignItems: 'center',
        },

        textStyle: {
            color: '#505050',
            fontFamily: 'Helvetica',
            fontSize: 27,
            marginTop: 5,
            fontWeight: '700',
        },

});

export default SplashScreen;