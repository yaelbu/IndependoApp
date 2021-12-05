import { SafeAreaView, View,Text, Image, Dimensions, ScrollView, StyleSheet } from "react-native";
import { DrawerItems } from "react-navigation-drawer";

import React from 'react';
import Independo from './Images/Independoo.png';

const { height: HEIGHT } = Dimensions.get("window");
const { width: WIDTH } = Dimensions.get("window");

export const CustomDrawerNavigator = (props) => (
  <SafeAreaView style={styles.container}>
     <View
      style={{
        //backgroundColor: '#f50057',
        height: HEIGHT/4.5,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Image source={Independo} style={{resizeMode:'center'}}/>
    </View>
 {/*    <View style={{ flex:1,height: HEIGHT / 5, alignItems: 'center', justifyContent: 'center', backgroundColor: 'orange' }}>
      <Image source={Independo} style={{ width: HEIGHT / 4, height: HEIGHT / 6.5 }} />

    </View> */}
    <ScrollView>
      <DrawerItems {...props}/>
      {/* <DrawerItems {...this.props}  activeTintColor='#2196f3' activeBackgroundColor='rgba(0, 0, 0, .04)' inactiveTintColor='rgba(0, 0, 0, .87)' inactiveBackgroundColor='transparent' style={{backgroundColor: '#000000'}} labelStyle={{color: '#ffffff'}}/>
 */}
    </ScrollView>
  </SafeAreaView>
);







const styles = StyleSheet.create({
  container: {
    flex: 1,

  },
});