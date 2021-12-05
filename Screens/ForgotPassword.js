
import firebase from "@firebase/app";
import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TextInput,
  Dimensions,
  Alert, ScrollView, KeyboardAvoidingView
} from "react-native";
import independo from "../Images/Independo.png";

import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";


const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emailup: "",
    };
  }

  ResetPassword = async () => {
    const email = this.state.emailup;
    if (email === "") {
      Alert.alert("", "נדרש דואר אלקטרוני", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }])
    } else {


      try {
        await firebase.auth().sendPasswordResetEmail(email);
        Alert.alert("", "הודעת דואל נשלחה לכתובת הדואל שלך", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
        this.props.navigation.navigate("WelcomeScreen");
      } catch (e) {
        if(e.message==="The email address is badly formatted.")
        {
          Alert.alert("", "אנא, הזן אימייל חוקי", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
           
        }
      }
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding" keyboardVerticalOffset={Platform.OS == "android" ? -200 : 0}>
        <ScrollView alwaysBounceVertical={false}>
          <CustomBackground>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                marginTop: Platform.OS === "ios" ? 60 : 10,
                marginBottom: HEIGHT / 30
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
                marginBottom: HEIGHT / 3.5,

              }}
            >
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
                  marginBottom: HEIGHT / 13

                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: WIDTH / 11.8, paddingBottom: HEIGHT / 30 }}
                >
                  שכחת את הסיסמה
                </Text>
                <View style={{ justifyContent: 'center', alignItems: 'flex-end' }}>

                  <Text style={{ fontSize: WIDTH / 32, textAlign: 'right', marginRight: 10 }}>
                    נא, להכניס את כתובת מייל לשיחזור סיסמה
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholderTextColor={"black"}
                    placeholder={"אימייל"}
                    keyboardType="email-address"
                    onChangeText={(inputEmail) =>
                      this.setState({ emailup: inputEmail })
                    }
                  />
                </View>

                <CustomValidationButton onPress={() => this.ResetPassword()}>
                  <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>
                    שיחזור סיסמה
                  </Text>
                </CustomValidationButton>
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

});
