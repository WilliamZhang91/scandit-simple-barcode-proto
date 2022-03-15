import React, { useEffect } from "react";
import { styles } from "./dashboardStyles"
import { useNavigation } from "@react-navigation/native";
import {
    SafeAreaView,
    Pressable,
    View,
    Text,
    Image
} from "react-native";
import { useGlobalContext } from "../../store/context";

export const Dashboard = () => {

    const { refillList, setRefillList } = useGlobalContext();
    const navigation = useNavigation();

    //async function getRefillList() {
    //    await fetch(`API Gateway Link`)
    //        .then(response => response.json())
    //        .then(response => {
    //            console.log(response);
    //            setRefillList(response)
    //        })
    //        .catch(err => console.error(err));
    //};
    //
    //useEffect(() => {
    //    let fetch = false
    //    if (!fetch) getRefillList();
    //    console.log(refillList)
    //    return () => { fetch = true }
    //}, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/dashboard/placeholder-profile.png')}
                    style={styles.userImg}
                />
                <Text style={styles.userNameText}>Full Name</Text>
                <Text style={styles.userRole}>Role</Text>
            </View>
            <Text style={styles.header}>Hello, Full Name</Text>
            <View style={styles.btnGrid}>
                <Pressable style={styles.btn} onPress={() => navigation.navigate("Refill")}>
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/three-strikes.png')}
                    />
                    <Text style={styles.btnText}>REFILL LIST</Text>
                </Pressable>
                <Pressable style={styles.btn} >
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/alert.png')}
                    />
                    <Text style={styles.btnText}>ALERT</Text>
                </Pressable>
                <Pressable
                    disabled
                    style={styles.btn}>
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/message.png')}
                    />
                    <Text style={styles.btnText}>TEXT</Text>
                </Pressable>
                <Pressable
                    disabled
                    style={styles.btn}>
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/clover.png')}
                    />
                    <Text style={styles.btnText}>CHECK LIST</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}