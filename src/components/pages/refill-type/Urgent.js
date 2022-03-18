import React from "react";
import { SafeAreaView, ScrollView } from "react-native";
import { styles } from "./refillTypeStyles";
import { useGlobalContext } from "../../../store/context";
import { ProductPanel } from "./ProductPanel";

export const Urgent = () => {

    const { refillList } = useGlobalContext();

    const urgentRefill = refillList.filter(item => item.Stock <= +item.Stock_required / 2);
    console.log(urgentRefill);
    //useEffect(() => {
    //    setRefillList(urgentRefill)
    //}, [])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.headerContainer}>
                {urgentRefill.map((refill, index) => {
                    const { 
                        gtin, 
                        Material_Description, 
                        Stock, 
                        Stock_required, 
                        Aisle_Number,
                        image 
                    } = refill;
                    return <ProductPanel
                        key={index}
                        gtin={gtin}
                        stock={Stock}
                        stock_required={Stock_required}
                        aisle_number={Aisle_Number}
                        material_description={Material_Description}
                        image={image}
                    />
                })}
            </ScrollView>
        </SafeAreaView>
    );
};