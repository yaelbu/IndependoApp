import React from "react";
import { View, Image, Text, StyleSheet, Dimensions } from "react-native";
import Proptypes from "prop-types";
import independo from '../Images/Independo.png'

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

const HeaderMenu = ({ children }) => (
  <View style={styles.headerContainer}>
    <View style={styles.textContainer}>
      <Text style={styles.text}>
        {children}
      </Text>
    </View>
  </View>
);

HeaderMenu.Proptypes = {
  children: Proptypes.element.isRequired,
  style: Proptypes.object,
};

HeaderMenu.defaultProps = {
  style: [],
};

export default HeaderMenu;

const styles = StyleSheet.create({
  text: {
    fontSize: WIDTH / 14,
    textDecorationLine:'underline',
    fontFamily: Platform.OS === "ios" ? 'HiraginoSans-W6' : "",
  },

  textContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
    marginRight: WIDTH / 28,
  },

  headerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  }
});
