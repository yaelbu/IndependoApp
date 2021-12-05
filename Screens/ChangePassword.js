
import firebase from "@firebase/app";
import React from "react";
import {
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  View,
  Text,
  Alert, KeyboardAvoidingView
  , ScrollView
} from "react-native";
require("firebase/auth");
require("firebase/database");
import independo from "../Images/Independo.png";
import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

export default class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newPassword: "",
      currentPassword: "",
    };
  }


  reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  OnChangePassword = async () => {
    if (this.state.currentPassword === "" || this.state.newPassword === "") {
      Alert.alert("", "כל השדות נדרשים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
    }
    else if (this.state.newPassword.length <= 5) {
      Alert.alert("", "הסיסמה חייבת להכיל לפחות 6 תווים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]);
    } else {
      try {
        await this.reauthenticate(this.state.currentPassword).then(() => {
          var user = firebase.auth().currentUser;
          user.updatePassword(this.state.newPassword);
          Alert.alert("", "הסיסמא שונתה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]);

          const response = firebase.database().ref("Users").child(user.uid);

          if (response) {

            //is response is true, we are redirected to the good Screen -Child,Parent,Teacher-
            response.on("value", (snapshot) => {
              const status = snapshot.val().status;
              if (status === "Parent") {
                this.props.navigation.navigate("HomeParent", { user });
              } else if (status === "Teacher") {
                this.props.navigation.navigate("HomeTeacher", { user });
              } else {
                this.props.navigation.navigate("HomeChild", { user });
              }
            });
          }
          this.setState({
            currentPassword: "",
            newPassword: ""
          })

        })

      } catch (error) {
        Alert.alert(error);
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
                justifyContent: 'center',

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
                marginBottom: HEIGHT / 5,

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
                  marginBottom: HEIGHT / 25

                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: WIDTH / 11.8, paddingBottom: HEIGHT / 30 }}
                >
                  שינוי סיסמה
                </Text>
                <TextInput
                  style={styles.input}
                  placeholderTextColor={"black"}
                  placeholder={" סיסמה הנוכחית"}
                  secureTextEntry={true}
                  onChangeText={(currentPassword) =>
                    this.setState({ currentPassword })
                  }
                />
                <TextInput
                  style={styles.input}
                  placeholderTextColor={"black"}
                  placeholder={" סיסמה חדשה"}
                  secureTextEntry={true}
                  onChangeText={(newPassword) => this.setState({ newPassword })}
                />

                <CustomValidationButton onPress={() => this.OnChangePassword()}>
                  <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>
                    שמור שינוי
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
