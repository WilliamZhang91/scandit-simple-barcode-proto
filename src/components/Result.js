import React from "react";
import { View, Text } from "react-native";

export const Result = ({ route }) => {

    const { barcode } = route.params

    return (
        <View>
            <Text>barcode: {JSON.stringify(barcode)}</Text>
        </View>
    )
}