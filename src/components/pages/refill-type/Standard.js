import React from "react";
import { styles } from "./refillTypeStyles";
import { SafeAreaView, ScrollView } from "react-native";
import { useGlobalContext } from "../../../store/context";
import { ProductPanel } from "./ProductPanel";

export const Standard = () => {

    const { refillList } = useGlobalContext();

    const standardRefill = refillList.filter(item => item.Stock > Math.floor(+item.Stock_required / 2));
    console.log(standardRefill);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.headerContainer}>
                {standardRefill.map((refill, index) => {
                    const {
                        gtin,
                        Material_Description,
                        Stock,
                        Stock_required,
                        Aisle_Number
                    } = refill
                    return <ProductPanel
                        key={index}
                        gtin={gtin}
                        stock={Stock}
                        stock_required={Stock_required}
                        aisle_number={Aisle_Number}
                        material_description={Material_Description}
                    />
                })}
            </ScrollView>
        </SafeAreaView>
    );
};