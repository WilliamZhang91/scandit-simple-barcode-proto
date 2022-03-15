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

export const ProductDashboard = ({ route }) => {

    console.log(route)

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Image
                    style={styles.productImg}
                    source={require('../assets/refillMenu/coke.png')}
                />
                <View style={styles.productDescription}>
                    <Text style={styles.userNameText}>
                        {route.params.product.material_description}
                    </Text>
                    <Text style={styles.userNameText}>
                        Stock on shelf: {route.params.product.stock}
                    </Text>
                    <Text style={styles.userNameText}>
                        Aisle Number: {route.params.product.aisle_number}
                    </Text>
                </View>
            </View>
            <View style={styles.btnGrid}>
                <Pressable style={styles.btn} onPress={() => navigation.navigate("Refill")}>
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/three-strikes.png')}
                    />
                    <Text style={styles.btnText}>UPDATE STOCK</Text>
                </Pressable>
                <Pressable style={styles.btn} >
                    <Image
                        style={styles.btnIcons}
                        source={require('../assets/dashboard/alert.png')}
                    />
                    <Text style={styles.btnText}>DETAILS</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}
