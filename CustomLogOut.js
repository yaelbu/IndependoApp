import { SafeAreaView, View, Text, Dimensions, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerItems } from "react-navigation-drawer";

import React from 'react';
import Independo from './Images/Independoo.png';

const { height: HEIGHT } = Dimensions.get("window");


export const CustomLogOut = (props) => (
  <SafeAreaView style={styles.container}>
    <View style={{ height: HEIGHT / 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
        <TouchableOpacity onPress={()=>console.log("test")}>
            <Text>teeeesy</Text>
        </TouchableOpacity>

    </View>
  </SafeAreaView>
);







const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});