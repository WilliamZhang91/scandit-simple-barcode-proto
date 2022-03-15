import React, { useState } from "react";
import { styles } from "./refillStyles";
import { Pressable, View, Text, SafeAreaView } from "react-native";
import { Urgent } from "./refill-type/Urgent";
import { Standard } from "./refill-type/Standard";
import { data } from "../../data";
import { BottomNav } from "./BottomNav";

export const Refill = () => {

    const [refillType, setRefillType] = useState(1);

    const selectPage = (number) => {
        setRefillType(number)
    }

    return (
        <View>
            <View style={styles.container}>
                <SafeAreaView style={styles.menuContainer}>
                    <Pressable
                        style={
                            (refillType === 1)
                                ?
                                [styles.btnMenu, styles.btnBackground]
                                : styles.btnMenu
                        }
                        onPress={() => selectPage(1)}
                    >
                        <Text style={styles.menuText}>URGENT</Text>
                    </Pressable>
                    <Pressable
                        style={
                            (refillType === 2)
                                ?
                                [styles.btnMenu, styles.btnBackground]
                                : styles.btnMenu
                        }
                        onPress={() => selectPage(2)}
                    >
                        <Text style={styles.menuText}>STANDARD</Text>
                    </Pressable>
                    <Pressable style={styles.flag} onPress={() => selectPage(3)}>
                        <Text></Text>
                    </Pressable>
                </SafeAreaView>
                {(() => {
                    if (refillType === 1) {
                        return <Urgent data={data} />
                    } else if (refillType === 2) {
                        return <Standard data={data} />
                    } else if (refillType === 3) {
                        return null
                    }
                })()}
                <Pressable style={styles.doneBtn}>
                    <Text>DONE</Text>
                </Pressable>
            </View>
        </View>
    );
};