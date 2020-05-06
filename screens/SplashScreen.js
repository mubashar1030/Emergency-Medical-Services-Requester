import React, { useState, Component, useEffect } from "react";
import { StyleSheet, Text, View, Image, Animated, Button, TouchableOpacity, AsyncStorage } from "react-native";

import Logo from '../assets/logo.png'
import { CommonActions } from '@react-navigation/native';
import { getSavedUser } from "../components/dbComm";


// class SplashScreen extends Component {

//     state ={
//         LogoAnim: new Animated.Value(0),
//         TextAnim: new Animated.Value(0),
//         LoadingSpinner: false,
//     }


//     componentDidMount(){
//         const {LogoAnim, TextAnim} = this.state;

//         Animated.parallel([
//             Animated.spring(LogoAnim, {
//                 toValue: 1,
//                 tension: 10,
//                 friction: 2,
//                 duration: 1000,
//             }).start(),

//             Animated.timing(TextAnim, {
//                 toValue: 1,
//                 duration: 1200,
//             }),
//         ]).start(() => {
//             this.setState({
//                 LoadingSpinner: true,
//             });
//         });
//     }

//     render()
//     {
//         return(
//             <View style={styles.container}>
//                 <Animated.View style={{
//                     opacity: this.state.LogoAnim,
//                     top: this.state.LogoAnim.interpolate({
//                         inputRange: [0, 1],
//                         outputRange: [80, 0],
//                     })
//                 }}>
//                     <Image source={Logo} style={{width: 250, height: 250}} resizeMode="contain"/>
//                 </Animated.View>
//                 <Animated.View style={{
//                     opacity: this.state.TextAnim,
//                 }}>
//                     <Text style={styles.textStyle}>EMS Requester</Text>
//                 </Animated.View>
//             </View>
//         )
//     }
// }

const SplashScreen = ({ route, navigation }) => {
    const [LogoAnim, setLogoAnime] = useState(new Animated.Value(0))
    const [TextAnim,setTextAnim] = useState( new Animated.Value(0))
    const [LoadingSpinner,setLoadingSpinner] = useState(false)
    useEffect(() => {
    
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
                setLoadingSpinner(true)
            });
            setTimeout(async ()=>{
                let userId=''
                let userProfile=''
                try {
                    userId = await AsyncStorage.getItem('userId') || 'none';
                    userProfile = await AsyncStorage.getItem('userProfile') || 'none';
                } catch (error) {
                    // Error retrieving data
                    console.log(error.message);
                }
                console.log(userId)
                if (userId!=='none' && userProfile!=='none'){
                    let userInfo = await getSavedUser(userId);
                    if (!userInfo) {
                        navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [
                                { name: "UserTypeScreen" },
                              ],
                            })
                        );
                      } else {
                        if (
                          userProfile == "Requester" && (userInfo["user_type"] == "requester" || userInfo["user_type"] == "Admin" 
                            || userInfo["user_type"] == "EMS_Member")
                        ) {
                          // navigation.navigate("RequesterScreen");
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [
                                { name: "RequesterScreen" },
                              ],
                            })
                          );
                        } else if (
                          userProfile == "EMS Member" &&
                          (userInfo["user_type"] == "EMS_Member" ||
                            userInfo["user_type"] == "Admin")
                        ) {
                          // navigation.navigate("EMSMemberScreen");
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [
                                { name: "EMSMemberScreen" },
                              ],
                            })
                          );
                        } else if (
                          userProfile == "Administrator" &&
                          userInfo["user_type"] == "Admin"
                        ) {
                          // navigation.navigate("AdministratorScreen");
                          navigation.dispatch(
                            CommonActions.reset({
                              index: 0,
                              routes: [
                                { name: "AdministratorScreen" },
                              ],
                            })
                          );
                        } else {
                            navigation.dispatch(
                                CommonActions.reset({
                                  index: 0,
                                  routes: [
                                    { name: "UserTypeScreen" },
                                  ],
                                })
                            );
                        }
                      }
                }
                else{
                    navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            { name: "UserTypeScreen" },
                          ],
                        })
                    );

                }
                
            },1500)
            
        },[])


    return(
            <View style={styles.container}>
                <Animated.View style={{
                    opacity: LogoAnim,
                    top: LogoAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [80, 0],
                    })
                }}>
                    <Image source={Logo} style={{width: 250, height: 250}} resizeMode="contain"/>
                </Animated.View>
                <Animated.View style={{
                    opacity: TextAnim,
                }}>
                    <Text style={styles.textStyle}>EMS Requester</Text>
                </Animated.View>
            </View>
        )
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