import React from "react"
import { styles } from "./productPanelStyles";
import { View, Text, Image, Pressable, ScrollView } from 'react-native';
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
    count
}) => {

    const { isBarcodeCorrect, scanCount } = useGlobalContext();
    const { showStockInput, setShowStockInput } = useGlobalContext();
    const navigation = useNavigation();

    const productDescription = () => {
        let product = [];
        product.push({
            gtin: gtin,
            material_description: material_description,
            stock: stock,
            stock_required,
            aisle_number: aisle_number
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
                    source={require("../../assets/refillMenu/coke.png")}
                    style={styles.productImg}
                />
                <Text style={styles.productDescription}>
                    {material_description}
                </Text>
                {showStockInput ? <View>
                    <Text>{scanCount}</Text>
                </View> : null}
                {showStockInput ?
                    <View style={styles.inputBox}>
                        <TextInput
                            keyboardType="number-pad"
                            style={styles.input}
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
    )
}

