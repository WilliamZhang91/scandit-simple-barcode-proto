import React from "react";
import { styles } from "./refillTypeStyles";
import { Pressable, View, Text, SafeAreaView, ScrollView } from "react-native";
import { data } from "../../../data";
import { ProductPanel } from "./ProductPanel";

export const Standard = () => {

    const standardRefill = data.filter(item => item.Stock > +item.Stock_required / 2);
    console.log(standardRefill)

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.headerContainer}>
                {standardRefill.map((refill, index) => {
                    return <ProductPanel key={index} refillList={refill} />
                })}
            </ScrollView>
        </SafeAreaView>
    );
};