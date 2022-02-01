import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

export const Home = () => {

    const navigation = useNavigation();

    return (
        <View>
            <Text>Home</Text>
            <Button
                title="Scan"
                onPress={() => navigation.navigate("Scandit")}
            />
        </View>
    )
}