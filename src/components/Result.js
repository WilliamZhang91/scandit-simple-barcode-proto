import React from "react";
import { View, Text } from "react-native";
import { useGlobalContext } from "../store/context";

export const Result = ({ route }) => {

    const { stock } = useGlobalContext();
    const { matrixSimple } = useGlobalContext();

    //console.log(barcode) {shelf: 0, barcode: 0}

    if (stock.shelf !== 0 && stock.warehouse !== 0) {
        return (
            <View>
                <Text>Shelf: {stock.shelf}</Text>
                <Text>Warehouse: {stock.warehouse}</Text>
            </View>
        )
    } else if (matrixSimple) {
        return (
            <View>
                <Text>
                    {matrixSimple.map((matrix, index) => {
                    return <View>
                        <Text>Product: {matrix.product}</Text>
                        <Text>Shelf: {matrix.shelf}</Text>
                        <Text>warehouse: {matrix.warehouse}</Text>
                    </View>
                })}
                </Text>
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