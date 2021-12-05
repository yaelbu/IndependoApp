import React from "react";
import { Text, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

const RenderListEmail = ({ onPress, children1, children2 }) => (

  <TouchableOpacity
    style={styles.taskContainer}
    onPress={onPress}
  >
    <Text style={styles.taskTitle}>
      {children2} - {children1}
    </Text>
  </TouchableOpacity>
);

RenderListEmail.Proptypes = {
  children1: Proptypes.element.isRequired,
  children2: Proptypes.element.isRequired,
  style: Proptypes.object,
};

RenderListEmail.defaultProps = {
  style: [],
};

export default RenderListEmail;

const styles = StyleSheet.create({
  taskContainer: {
    alignItems: "center",
    height: HEIGHT/16,
    backgroundColor: '#efe8fd',
    justifyContent:'center',
    alignItems:'flex-end',
    borderWidth: 1,
    borderColor: colors.black,
    paddingRight:WIDTH/40
  },

  taskTitle: {
    fontSize: WIDTH/21,
    fontWeight: "600",
    color: colors.black,
    fontFamily: Platform.OS === "ios" ? "Gill Sans" : "",

  },

});
