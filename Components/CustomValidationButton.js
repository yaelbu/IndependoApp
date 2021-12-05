import React from "react";
import { View, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import Proptypes from "prop-types";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

const CustomValidationButton = ({ onPress, children }) => (
  <TouchableOpacity onPress={onPress} style={styles.btnCustom}>
    <View>{children}</View>
  </TouchableOpacity>
);

CustomValidationButton.Proptypes = {
  onPress: Proptypes.func.isRequired,
  children: Proptypes.element.isRequired,
  style: Proptypes.object,
};

CustomValidationButton.defaultProps = {
  style: [],
};

export default CustomValidationButton;

const styles = StyleSheet.create({
  btnCustom: {
    width: WIDTH/2,
    height: HEIGHT/21,
    borderRadius: 10,
    backgroundColor: "black",
    justifyContent: "center",
    marginTop: HEIGHT/45,
    marginBottom: HEIGHT/45,
    alignItems: "center",
    color: "black",
  },
});
