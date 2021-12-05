
import React from "react";
import { CheckBox } from "native-base";
import {
  Image,
  StyleSheet,
  Text,
  View,
  TextInput,
  Dimensions, Alert,ScrollView,KeyboardAvoidingView
} from "react-native";
import independo from "../Images/Independo.png";
import firebase from "@firebase/app";
import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";
require("firebase/auth");
require("firebase/database");

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class SignUp extends React.Component {
  constructor() {
    super();
    this.state = {
      emailUser: "",
      password: "",
      lastname: "",
      firstname: "",
      confirmpassword: "",
      status: "",
      parent: false,
      teacher: false,
      isLoading: false,
      //test:''
    };
    this.OnSignUp = this.OnSignUp.bind(this);
  }

  onePressed(status) {
    this.setState({ parent: true, teacher: false, status: status });
  }

  twoPressed(status) {
    this.setState({ parent: false, teacher: true, status: status });
  }

  OnSignUp = async () => {
    if (
      this.state.emailUser === "" ||
      this.state.password === "" ||
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.confirmpassword === "" ||
      this.state.status === ""
    ) {
      Alert.alert("", "כל השדות נדרשים", [{ text: "אוקיי",style: { fontSize: WIDTH / 41 } }])
    } else {
      if (this.state.password === this.state.confirmpassword) {
        this.setState({ isLoading: true });
        const { firstname, lastname, emailUser, password, status } = this.state;
        try {
          const response = await firebase
            .auth()
            .createUserWithEmailAndPassword(emailUser, password);

          if (response) {
            this.setState({ isLoading: false });
            await firebase
              .database()
              .ref("Users")
              .child(response.user.uid)
              .set({
                firstname: firstname,
                lastname: lastname,
                status: status,
                emailUser: response.user.email,
              });
            this.props.navigation.navigate("LoadingScreen");
          }
        } catch (error) {
          this.setState({ isLoading: false });
          switch (error.code) {
            case "auth/email-already-in-use":
              Alert.alert("", "משתמש כבר קיים. נסה להתחבר", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
            case "auth/weak-password":
              Alert.alert("", "הסיסמה חייבת להכיל לפחות 6 תווים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
            case "auth/invalid-email":
              Alert.alert("", "אנא, הזן אימייל חוקי", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);
              break;
          }
        }
      } else {
        Alert.alert("", "הסיסמה וסיסמת האישור צריכות להיות זהות", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }}]);
      }
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
            marginBottom: HEIGHT / 3.5,
            marginTop:0,
          }}
        >
          <View
            style={{
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
              הרשמה
            </Text>


            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"שם פרטי"}
              onChangeText={(firstname) => this.setState({ firstname })}
            />

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"שם משפחה"}
              onChangeText={(lastname) => this.setState({ lastname })}
            />

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

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"אישור סיסמה"}
              secureTextEntry={true}
              onChangeText={(confirmpassword) => this.setState({ confirmpassword })}
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: 'flex-end',
                alignItems: 'center',
                alignSelf: 'center',
                alignContent: 'flex-end',
                //marginTop:5
                marginTop: HEIGHT/179,
              }}
            >
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontSize: WIDTH / 27 }}>הורה </Text>
                  <CheckBox
                    checked={this.state.parent}
                    onPress={() => this.onePressed("Parent")}
                    style={{ marginRight: HEIGHT/45,  borderColor: "black" }}
                  />

                </View>

                <View style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
                  <Text style={{ fontSize: WIDTH / 27 }}>מטפל </Text>
                  <CheckBox
                    checked={this.state.teacher}
                    onPress={() => this.twoPressed("Teacher")}
                    style={{ marginRight: HEIGHT/45, borderColor: "black" }}
                  />

                </View>
              </View>
              <Text style={{ fontSize: WIDTH / 27 }}>סטטוס : </Text>
            </View>

            <CustomValidationButton onPress={() => this.OnSignUp()}>
              <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>שמור</Text>
            </CustomValidationButton>
          </View>
        </View>
      </CustomBackground>
      </ScrollView>
</KeyboardAvoidingView>
    );
  }
}











export default SignUp;















const styles = StyleSheet.create({
  logo: {
    width: WIDTH / 1.7,
    height: HEIGHT / 3.2,
  },

  input: {
    width: WIDTH/1.5,
    height: HEIGHT / 17.5,
    borderRadius: 10,
    fontSize: WIDTH/27,
    paddingRight: WIDTH/16.5,
    backgroundColor: "rgba(0,0,0,0.1)",
    color: "rgba(0,0,0,1)",
    borderWidth: 0.6,
    margin:HEIGHT / 128,
    textAlign: "right",
    fontWeight: "300",
  },
});
