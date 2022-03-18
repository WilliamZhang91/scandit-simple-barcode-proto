import React, { useState } from "react"
import { styles } from "./productPanelStyles";
import { View, Text, Image, Pressable, ScrollView, Alert } from 'react-native';
import { TextInput, GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalContext } from "../../../store/context";

export const ProductPanel = ({
    gtin,
    material_description,
    stock,
    stock_required,
    aisle_number,
    image,
}) => {

    const { scanCount, setScanCount, showStockInput, setShowStockInput } = useGlobalContext();
    const [value, setValue] = useState()
    const navigation = useNavigation();
    console.log(image)

    const productDescription = () => {
        let product = [];
        product.push({
            gtin: gtin,
            material_description: material_description,
            stock: stock,
            stock_required,
            aisle_number: aisle_number,
            image
        });
        navigation.navigate("Scandit", { product: product });
    };

    return (
        <SafeAreaView style={styles.container}>
            <Pressable
                style={styles.panel}
                onPress={() => productDescription()}
            >
                <Image
                    source={{ uri: image }}
                    style={styles.productImg}
                />
                <Text style={styles.productDescription}>
                    {material_description}
                </Text>
                {showStockInput ?
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder={`${scanCount}`}
                        />
                        <View style={styles.text}>
                            <Text style={styles.warehouseStock}>/100</Text>
                        </View>
                    </View>
                    :
                    <View style={styles.inputBox}>
                        <Text>Stock: {stock} / {stock_required}</Text>
                    </View>}
            </Pressable>
        </SafeAreaView>
    );
};

