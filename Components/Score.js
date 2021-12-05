import React from "react";
import { StyleSheet, Text, View,Dimensions } from "react-native";
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default class Score extends React.Component {
  render() {
    return (
      <View style={{ alignItems: "center", height: HEIGHT/9, paddingTop: 20 }}>
        <View style={styles.score_container}>
          <Text style={styles.scoreText}>Score</Text>
          <Text style={styles.score}>{this.props.score}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  score_container: {
    alignItems: "center",

    borderWidth: 2,
    width: WIDTH/4.14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#97c6db",
  },
  score: {
    fontSize: WIDTH/14,
    fontWeight: "bold",
  },
  scoreText: {
    fontSize: WIDTH/20.7,
    fontWeight: "bold",
  },
});
