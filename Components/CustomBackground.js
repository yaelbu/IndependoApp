import React from "react";
import { StyleSheet, ImageBackground, StatusBar } from "react-native";
import Proptypes from "prop-types";


const customBackgroundComponent = ({ children }) => (

  <ImageBackground style={styles.imagebackground}>
    {children}
 
  </ImageBackground>
);

customBackgroundComponent.Proptypes = {
  children: Proptypes.element.isRequired,
};

export default customBackgroundComponent;

const styles = StyleSheet.create({
  imagebackground: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    backgroundColor:'white'
  },
});
