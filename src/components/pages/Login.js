import React, { useState } from "react";
import {
    Pressable,
    SafeAreaView,
    TextInput,
    Text,
    View,
    Image
} from 'react-native';
import { styles } from "./loginStyles"
import { useNavigation } from "@react-navigation/native";

export const Login = () => {

    const [staffId, setStaffId] = useState();
    const [password, setPassword] = useState();

    const navigation = useNavigation();

    const handleLogin = () => {
        if (staffId && password) {
            navigation.push('Dashboard')
        } else {
            console.log('Please enter required fields')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Image
                    style={styles.crown}
                    source={require('../assets/login/crown.png')} />
            </View>
            <Text style={styles.loginHeader}>
                Refill &amp; Tracking
            </Text>
            <Pressable
                onPress={() => console.log('scan staff ID btn pressed')}
                style={styles.scanId} >
                <Image
                    style={styles.camera}
                    source={require('../assets/login/camera.png')} />
                <Text
                    style={styles.scanText}>Tap to scan your staff ID</Text>
            </Pressable>
            <View style={styles.loginInputContainer}>
                <Text style={styles.loginText}>
                    Login
                </Text>
            </View>

            <TextInput
                onChangeText={(e) => setStaffId(e)}
                keyboardType='number-pad'
                style={styles.loginInput}
                placeholder='Staff ID' />

            <TextInput
                onChangeText={(e) => setPassword(e)}
                style={styles.loginInput}
                secureTextEntry={true}
                placeholder='Password' />

            <TextInput
                style={styles.loginInput}
                placeholder='Verification Code'
                keyboardType='number-pad' />

            {
                staffId && password ?
                    <>
                        <Pressable
                            style={styles.loginBtn}
                            onPress={() => handleLogin()} >
                            <Text style={styles.loginBtnText} >Login</Text>
                        </Pressable>
                    </> : <></>
            }


        </SafeAreaView>
    )
}