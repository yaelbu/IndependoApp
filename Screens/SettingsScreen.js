import React from "react";
import { StyleSheet, View, Text, Alert,StatusBar,Dimensions } from "react-native";
import firebase from "@firebase/app";
require("firebase/auth");
import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";
import colors from "../Colors";
import HeaderActions from "../Components/HeaderActions";
import { TouchableOpacity } from "react-native-gesture-handler";

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;



export default class SettingsScreen extends React.Component {
  signOut = async () => {
    try {
      await firebase.auth().signOut();
      this.props.navigation.navigate("WelcomeScreen");
    } catch (error) {
      Alert.alert("", "לא ניתן להתנתק כעת", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
    }
  };


  render() {
    return (
      <CustomBackground>
        <View>

      <StatusBar backgroundColor = "black" hidden={false} />
    </View>
        <HeaderActions children1={'הגדרות'}/>
        <View style={{ flex: 9, backgroundColor: 'transparent',justifyContent:'center',alignItems:'center' }}>
      <CustomValidationButton onPress={this.signOut}>
      <Text style={{ fontWeight: "600", color: "white",fontSize: WIDTH /30 }}>
           ניתוק</Text>
            </CustomValidationButton>
      </View>
       
      </CustomBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    backgroundColor: colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 10,
  },
});
