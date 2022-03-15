import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from '@react-navigation/native';

export const Home = () => {

    const navigation = useNavigation();

    return (
        <View>
            <Text>Home</Text>
            <Button
                title="Simple Scan"
                onPress={() => navigation.navigate("Scandit")}
            />
            <Button
                title="Matrix Bubble Scan"
                onPress={() => navigation.navigate("MatrixBubble")}
            />
            <Button
                title="Matrix Simple Scan"
                onPress={() => navigation.navigate("MatrixBubble")}
            />
        </View>
    );
};