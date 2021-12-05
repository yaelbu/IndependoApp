import React from "react";
import { View, Text, StyleSheet, Dimensions, Header } from "react-native";
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


const HeaderActionsNewTask = ({ children1, children2, children3 }) => (
  <View style={styles.container}>
    <View style={styles.divider} />
    <Text style={styles.title}>
      {children1}
      <Text style={styles.TitleText}>{children2}</Text>
    </Text>
    <View style={styles.divider} />
  </View>
);

HeaderActionsNewTask.Proptypes = {
  children1: Proptypes.element.isRequired,
  children2: Proptypes.element.isRequired,
  children3: Proptypes.element.isRequired,
  style: Proptypes.object,
};

HeaderActionsNewTask.defaultProps = {
  style: [],
};

export default HeaderActionsNewTask;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex:1,
   //marginTop:Platform.OS==="ios" ? HEIGHT/1.9 :HEIGHT/1.9,
    backgroundColor:'transparent',
    alignSelf:'center',
    alignItems:'center',
    justifyContent:'center'
  // height:HEIGHT/9,

  },

  divider: {
    //backgroundColor: colors.redTitle,
    backgroundColor: "#5515d4",
    height: 2.5,
    flex: 1,
    alignSelf: "center",
  },

  TitleText: {
    fontWeight: "300",
   // color: colors.redTitle,
   color:'#5515d4',
    fontFamily: Platform.OS==="ios" ? "Verdana-Bold" :"",
  },
  title: {
    fontSize: WIDTH/11,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 10,
    fontFamily: Platform.OS==="ios" ? "Verdana-Bold" :"",
  },
});
