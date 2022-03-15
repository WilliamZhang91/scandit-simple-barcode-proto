import React from "react";
import { View, Text } from "react-native";

export const Result = ({ route }) => {

    const { barcode } = route.params
    const { results } = route.params

    if (barcode) {
        return (
            <View>
               <Text>barcode: {JSON.stringify(barcode)} : </Text>
            </View>
        )
    } else if (results) {
        return (
            <View>
                <Text>result: {JSON.stringify(results)}</Text>
            </View>
        )
    } else {
        return (
            <View>
                <Text>Nothing scanned</Text>
            </View>
        )
    }
}