import React from "react";
import {
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Alert, ScrollView
} from "react-native";
import independo from "../Images/Independo.png";
import firebase from "@firebase/app";
import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";
import "firebase/auth";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default class LoginAdult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailUser: "",
      password: "",
      isLoading: false,
    };
  }

  OnSignIn = async () => {
    if (this.state.emailUser.toLowerCase() && this.state.password) {
      this.setState({ isLoading: true });
      try {
        const response = await firebase
          .auth()
          .signInWithEmailAndPassword(
            this.state.emailUser.toLowerCase(),
            this.state.password
          );
        if (response) {
          this.setState({ isLoading: false });
        }
        this.props.navigation.navigate("LoadingScreen");
        //else to response??
      } catch (error) {
        this.setState({ isLoading: false });
        switch (error.code) {
          case "auth/invalid-email":
            Alert.alert("", "אנא, הזן אימייל חוקי", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
            break;
          case "auth/user-not-found":
            Alert.alert("", "משתמש עם אימייל זה אינו קיים, אנא הירשם", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 }}]);
            break;
          case "auth/wrong-password":
            Alert.alert("", "סיסמה שגויה !", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
            break;
        }
      }
    } else {
      Alert.alert("", "נא להזין מייל וסיסמה!", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
    }
  };

  render() {
    return (
     
      <KeyboardAvoidingView  
            behavior="padding" keyboardVerticalOffset={Platform.OS=="android" ? -200 : 0}>
            <ScrollView alwaysBounceVertical={false}>
          

      <CustomBackground>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            marginTop: Platform.OS === "ios" ? 60 : 10,
            marginBottom: HEIGHT / 60,
          }}
        >
          <Image source={independo} style={styles.logo} />
        </View>
        <View
          style={{
            flex: 2,
            borderWidth: 0,
            borderColor: "transparent",
            margin: WIDTH / 10,
            marginTop: 0,
            marginBottom: HEIGHT,
            
          }}
        >
          {this.state.isLoading ? (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1000,
                elevation: 1000,
              }}
            >
              <ActivityIndicator size="large" color="black" />
            </View>
          ) : null}
          <View
            style={{
              flex: 1,
              backgroundColor: "rgb(245,245,245)",
              alignItems: "center",
              paddingTop: HEIGHT / 25,
              borderColor: "black",
              borderRadius: 10,
              elevation: 20,
              shadowOpacity: 15,
              shadowColor: 'black',

            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: WIDTH / 11.8, paddingBottom: HEIGHT / 90 }}
            >
              התחברות
            </Text>
   
              <TextInput
                style={styles.input}
                placeholderTextColor={"black"}
                placeholder={"אימייל"}
                keyboardType="email-address"
                onChangeText={(emailUser) => this.setState({ emailUser })}

              />

       


            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"סיסמה"}
              secureTextEntry={true}
              onChangeText={(password) => this.setState({ password })}
            />
            <CustomValidationButton onPress={() => this.OnSignIn()}>
              <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>התחברות</Text>
            </CustomValidationButton>

            <TouchableOpacity
              style={{ alignItems: "center", flexDirection: "row" }}
              onPress={() => this.props.navigation.navigate("SignUp")}
            >
              <Text style={styles.text}>{" "}הרשמה</Text>
              <Text style={{ fontSize: WIDTH / 35 }}>אין לכם עדיין חשבון? </Text>

            </TouchableOpacity>

            <TouchableOpacity
              style={{
                alignItems: "center",
                flexDirection: "row",
                margin: 4,
              }}
              onPress={() => this.props.navigation.navigate("ForgotPassword")}
            >
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontSize: WIDTH / 35,
                  fontWeight: "bold",
                  paddingBottom:HEIGHT/30,

                }}
              >
                שכחת סיסמה?
              </Text>
            </TouchableOpacity>
          </View>

        </View>
      </CustomBackground>
      </ScrollView>
        </KeyboardAvoidingView>

    );
  }
}






const styles = StyleSheet.create({
  logo: {
    width: WIDTH / 1.7,
    height: HEIGHT / 3.2,
  },


  input: {
    width: WIDTH / 1.5,
    height: HEIGHT / 17.5,
    borderRadius: 10,
    fontSize: WIDTH / 27,
    paddingRight: WIDTH / 16.5,
    backgroundColor: "rgba(0,0,0,0.1)",
    color: "rgba(0,0,0,1)",
    borderWidth: 0.6,
    margin: HEIGHT / 128,
    textAlign: "right",
    fontWeight: "300",
  },
  text: {
    color: "rgba(0,0,0,0.7)",
    fontSize: WIDTH / 35,
    fontWeight: "bold",
    textAlign: "center",
  },
});
