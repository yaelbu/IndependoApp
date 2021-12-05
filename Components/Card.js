import React from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Image,
  Dimensions
} from "react-native";
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    let icon_name = require("../Images/question.jpg");
    console.log("icon_name = ",icon_name);
    if (this.props.is_open) {
      icon_name = this.props.Image_name;
    }

    return (
      <View style={styles.card}>
        <TouchableHighlight
          onPress={this.props.clickCard}
          activeOpacity={0.75}
          underlayColor={"#f1f1f1"}
        >
          <Image
            source={icon_name}
            size={40}
            //color={icon_color}
            style={{
              borderWidth: 3,
              borderRadius: 6,
              borderColor: "black",
              width: WIDTH/5.3,
              height:WIDTH/5.3, 
           /*    height: HEIGHT/11.2,
              width:HEIGHT/11.2, */
              margin: 10,
            }}
          />
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",

  },
});
