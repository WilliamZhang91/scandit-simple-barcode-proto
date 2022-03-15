import React, { useEffect } from "react";
import { SafeAreaView, View, ScrollView } from "react-native";
import { styles } from "./refillTypeStyles";
import { useGlobalContext } from "../../../store/context";
import { ProductPanel } from "./ProductPanel";
import { useNavigation } from '@react-navigation/native';

export const Urgent = ({ data }) => {

    const navigation = useNavigation();
    const { refillList, setRefillList } = useGlobalContext();

    const urgentRefill = data.filter(item => item.Stock <= +item.Stock_required / 2);
    
    useEffect(() => {
        setRefillList(urgentRefill)
    },[])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.headerContainer}>
                {urgentRefill.map((refill, index) => {
                    const { 
                        gtin, 
                        Material_Description, 
                        Stock, 
                        Stock_required, 
                        Aisle_Number 
                    } = refill;
                    return <ProductPanel
                        key={index}
                        gtin={gtin}
                        stock={Stock}
                        stock_required={Stock_required}
                        aisle_number={Aisle_Number}
                        material_description={Material_Description}
                        //urgentRefill={urgentRefill}
                    />
                })}
            </ScrollView>
        </SafeAreaView>
    );
};