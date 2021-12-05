import React from "react";
import { StyleSheet, Text, View,Dimensions } from "react-native";
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


export default class Header extends React.Component {
  render() {
    return (
      <View style={styles.header}>
        <Text style={styles.header_text}>MemoryGame</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: "column",
    alignSelf: "stretch",
    paddingTop: 50,
    paddingBottom: 5,
    backgroundColor: "#f3f3f3",
  },
  header_text: {
    fontWeight: "bold",
    fontSize: WIDTH/24,
    textAlign: "center",
  },
});
