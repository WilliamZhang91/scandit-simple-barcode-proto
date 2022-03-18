import React, { useState } from "react";
import { Modal, View, Text, Image, Pressable, ScrollView, Alert, SafeAreaView, KeyboardAvoidingView } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { styles } from "./dashboardStyles";
//import CloseIcon from '@mui/icons-material/Close';

export const ProductModal = ({
    isModalOpen,
    gtin,
    material_description,
    stock,
    stock_required,
    aisle_number,
    image,
    closeModal
}) => {

    const [inputStockCount, setInputStockCount] = useState(0)

    const postScanCount = () => {
        fetch("API_GATEWAY_ENDPOINT/update_stock_count", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gtin: gtin,
                stockCount: inputStockCount,
            }),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
    };

    const postTimestamp = () => {
        fetch("API_GATEWAY_KEY/record_datetime", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                gtin: gtin,
            }),
        })
            .then(response => response.json())
            .then(response => {
                console.log(response)
            })
            .catch(err => console.log(err))
    };

    return (
        <Modal
            visible={isModalOpen}
            animationType="slide">
            <KeyboardAwareScrollView>
                <SafeAreaView style={styles.container2}>
                    <View style={styles.container}>
                        <Image
                            style={styles.productImg}
                            source={{uri: image}}
                        />
                        <View style={styles.productDescription}>
                            <Text style={styles.userNameText}>
                                {material_description}
                            </Text>
                            <Text style={styles.userNameText}>
                                Stock on shelf: {stock}
                            </Text>
                            <Text style={styles.userNameText}>
                                Aisle Number: {aisle_number}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.btnGrid}>
                        <Pressable style={styles.btn}>
                            <ScrollView>
                                <TextInput
                                    keyboardType='number-pad'
                                    placeholder={`${stock}`}
                                    maxLength={2}
                                    style={{ fontSize: 80 }}
                                >
                                </TextInput>
                                <Text style={styles.btnText}></Text>
                            </ScrollView>
                        </Pressable>
                        <Pressable style={styles.btn} >
                            <Image
                                style={styles.btnIcons}
                                source={require('../assets/dashboard/alert.png')}
                            />
                            <Text style={styles.btnText}>DETAILS</Text>
                        </Pressable>
                        <Pressable style={styles.doneBtn}>
                            <Text>DONE</Text>
                        </Pressable>
                        <Pressable style={styles.CancelBtn} onPress={() => closeModal()}>
                            <Text>BACK</Text>
                        </Pressable>
                    </View>
                </SafeAreaView>
            </KeyboardAwareScrollView>
        </Modal>
    )
}