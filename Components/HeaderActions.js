import React from "react";
import { View, Text, StyleSheet, Dimensions, Header } from "react-native";
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


const HeaderActions = ({ children1, children2, children3 }) => (
  <View style={styles.HeaderContainer}>
    
 <View style={styles.container}>
    <View style={styles.divider} />
    <Text style={styles.title}>
      {children1}
      <Text style={styles.TitleText}>{children2}</Text>
    </Text>
    <View style={styles.divider} />
  </View>
  </View>
);

HeaderActions.Proptypes = {
  children1: Proptypes.element.isRequired,
  children2: Proptypes.element.isRequired,
  children3: Proptypes.element.isRequired,
  style: Proptypes.object,
};

HeaderActions.defaultProps = {
  style: [],
};

export default HeaderActions;

const styles = StyleSheet.create({
  container: {
    //height:HEIGHT/9,
    flexDirection: "row",
    backgroundColor:'transparent',
    alignItems:'center',
  },

  divider: {
    backgroundColor: "#5515d4",
    height: 3,
    flex: 1,
    alignSelf: "center",
  },

  TitleText: {
    fontWeight: "300",
   color:'#5515d4',
    fontFamily: Platform.OS==="ios" ? "Verdana-Bold" :"",
  },
  title: {
    fontSize: WIDTH/11,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 20,
    fontFamily: Platform.OS==="ios" ? "Verdana-Bold" :"",
  },
  HeaderContainer:{
    flex: 1, backgroundColor: 'transparent', justifyContent: 'center'
  }
});
