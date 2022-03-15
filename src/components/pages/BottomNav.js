import React from 'react';
import { styles } from './bottomNavStyles';

import { SafeAreaView, View, Pressable, Image, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const BottomNav = () => {

    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.bottomNavContainer}>

            <View style={styles.menuContainer}>
                <Pressable onPress={() => console.log('alert bottom nav btn pressed')}
                    style={styles.imgContainer} >
                    <Image
                        style={styles.img}
                        source={require('../assets/refillMenu/alert.png')}
                    />
                    <Text style={styles.bottomNavText}>ALERT</Text>
                </Pressable>
                <Pressable onPress={() => console.log('text bottom nav btn pressed')}
                    style={styles.imgContainer} >
                    <Image
                        style={styles.img}
                        source={require('../assets/refillMenu/text.png')}
                    />
                    <Text style={styles.bottomNavText}>TEXT</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('Dashboard')}
                    style={styles.imgContainer} >
                    <Image
                        style={styles.img}
                        source={require('../assets/refillMenu/home.png')}
                    />
                    <Text style={styles.bottomNavText}>HOME</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
    ;
}
