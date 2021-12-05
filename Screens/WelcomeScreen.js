import React from "react";
import { View, Image, TouchableOpacity, StyleSheet,Dimensions } from "react-native";
import independo from "../Images/Independoo.png";
import child from "../Images/child.png";
import adult from "../Images/adult.png";
import CustomBackground from '../Components/CustomBackground';
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


export default class WelcomeScreen extends React.Component {
  render() {
    console.log("HEIGHT =",HEIGHT)
    console.log("WIDTH =",WIDTH)
    return (
      <CustomBackground>
        <View
          style={{
            flex: 1,
            borderWidth: 35,
            borderColor: "transparent",
            marginTop: WIDTH/11.8,
          }}
        >
          <View
            style={{
              height: HEIGHT/4.4,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image source={independo} style={styles.logo} />
          </View>

          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <TouchableOpacity
              style={styles.btnWelcome}
              onPress={() => this.props.navigation.navigate("LoginChild")}
            >
              <View>
                <Image source={child} style={styles.images} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnWelcome}
              onPress={() => this.props.navigation.navigate("LoginAdult")}
            >
              <View>
                <Image source={adult} style={styles.images} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBackground>
    );
  }
}

const styles = StyleSheet.create({
  logo: {
    width: WIDTH/1.4,
    height: HEIGHT/5.5,
  },

  btnWelcome: {
    width: WIDTH/2.4,
    height: WIDTH/2.4,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    margin: HEIGHT/90,
    elevation:15,
    shadowOpacity:1.59,
    shadowColor:'black',
    marginBottom:HEIGHT/44
  },


  images: {
    width: WIDTH/2.4,
    height: WIDTH/2.4,
    
  },

});
