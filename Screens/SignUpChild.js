
import React from "react";
import { CheckBox } from "native-base";
import {Image,Modal,TouchableOpacity,StyleSheet,Text,View,TextInput,Alert, Dimensions,ScrollView,KeyboardAvoidingView} from "react-native";
import independo from "../Images/Independo.png";

import firebase from "firebase/app";
import { AntDesign } from "@expo/vector-icons";
import CustomValidationButton from "../Components/CustomValidationButton";
import CustomBackground from "../Components/CustomBackground";

require("firebase/database");
require("firebase/auth");

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class SignUpChild extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      lastname: "",
      firstname: "",
      confirmpassword: "",
      check: false,
      repeat: "",
      isLoading: false,
      show: false,
    };
    this.SavePress = this.SavePress.bind(this);
  }

  onePressed() {
    this.setState({ check: !this.state.check });
  }

  SavePress = async () => {
    console.log(HEIGHT)
    let useruid = firebase.auth().currentUser.uid;
    const currUser = firebase.auth().currentUser;
    let creatorParent = "";
    let creatorTeacher = "";

    const response1 = firebase
      .database()
      .ref("Users")
      .child(firebase.auth().currentUser.uid);
    if (
      this.state.email === "" ||
      this.state.password === "" ||
      this.state.firstname === "" ||
      this.state.lastname === "" ||
      this.state.confirmpassword === "" ||
      this.state.check === false
    ) {
      if (this.state.check === false) {
        Alert.alert("", "כדי להמשיך, עליך להסכים לתנאי השימוש", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }}]);
      } else {
        Alert.alert("", "כל השדות דרושים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
      }
    } else {
      if (this.state.password === this.state.confirmpassword) {
        const { firstname, lastname, email, password, status } = this.state;
        const nameChild = firstname + " " + lastname;
        if (response1) {
          //is response is true, we are redirected to the good Screen -Child,Parent,Teacher-
          response1.on("value", async (snapshot) => {
            const status = snapshot.val().status;
            if (status === "Parent") {
              creatorParent = useruid;
              try {
                await firebase
                  .auth()
                  .createUserWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                    var user = userCredential.user;
                    this.setState({ isLoading: false });
                    firebase
                      .database()
                      .ref("Users")
                      .child(user.uid)
                      .set({
                        firstname: firstname,
                        lastname: lastname,
                        status: "Child",
                        creatorParent,
                        creatorTeacher,
                        Points: 0,
                        emailUser: user.email,
                        CountGame: 0,
                        countViewVideo: 0
                      });
                    firebase
                      .database()
                      .ref("AdultList")
                      .child(useruid)
                      .child(user.uid)
                      .set({ childEmail: user.email, name: nameChild });
                    firebase.auth().signOut();
                    firebase.auth().updateCurrentUser(currUser);
                    this.props.navigation.navigate("LoadingScreen");
                  });
                Alert.alert("", "הילד נוסף!", [{ text: "אוקיי",style: { fontSize: WIDTH / 41 } }])

              } catch (error) {
                this.setState({ isLoading: false });
                switch (error.code) {
                  case "auth/email-already-in-use":
                    Alert.alert("", "משתמש כבר קיים. נסה להתחבר", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
                  case "auth/weak-password":
                    Alert.alert("", "הסיסמה חייבת להכיל לפחות 6 תווים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
                  case "auth/invalid-email":
                    Alert.alert("", "כתובת מייל מעוצבת בצורה שגויה", [{ text: "אוקיי",style: { fontSize: WIDTH / 41 }}]);
                    break;
                }
              }
            } else if (status === "Teacher") {
              creatorTeacher = useruid;
              try {
                await firebase
                  .auth()
                  .createUserWithEmailAndPassword(email, password)
                  .then((userCredential) => {
                    var user = userCredential.user;
                    this.setState({ isLoading: false });
                    firebase
                      .database()
                      .ref("Users")
                      .child(user.uid)
                      .set({
                        firstname: firstname,
                        lastname: lastname,
                        status: "Child",
                        creatorParent,
                        creatorTeacher,
                        Points: 0,
                        emailUser: user.email,
                        CountGame: 0,
                        countViewVideo: 0
                      });
                    firebase
                      .database()
                      .ref("AdultList")
                      .child(useruid)
                      .child(user.uid)
                      .set({ childEmail: user.email, name: nameChild });
                    firebase.auth().signOut();
                    firebase.auth().updateCurrentUser(currUser);
                    this.props.navigation.navigate("LoadingScreen");
                  });
                Alert.alert("", "הילד נוסף!", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }}])
              } catch (error) {
                this.setState({ isLoading: false });
                switch (error.code) {
                  case "auth/email-already-in-use":
                    Alert.alert("", "משתמש כבר קיים. נסה להתחבר", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }}]);
                  case "auth/weak-password":
                    Alert.alert("", "הסיסמה חייבת להכיל לפחות 6 תווים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }}]);
                  case "auth/invalid-email":
                    Alert.alert("", "כתובת מייל מעוצבת בצורה שגויה", [{ text: "אוקיי",style: { fontSize: WIDTH / 41 } }]);
                    break;
                }
              }
            }
          });
        }
      } else {
        Alert.alert("", "הסיסמה וסיסמת האישור צריכות להיות זהות", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
      }
    }
  };

  render() {
    return (
      <KeyboardAvoidingView  
      behavior="padding" keyboardVerticalOffset={Platform.OS=="android" ? -200 : 0}>
      <ScrollView alwaysBounceVertical={false}>
  
      <CustomBackground>
        <Modal transparent={true} visible={this.state.show}>
          <View style={{ backgroundColor: "#000000aa", flex: 1 }}>
            <ScrollView style={styles.tcContainer}>
              <View
                style={{
                  backgroundColor: "white",
                  marginVertical: HEIGHT / 9,
                  marginHorizontal: WIDTH / 14,
                  borderRadius: 10,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    //height: HEIGHT / 7,
                    flex:1
                  }}
                >
                  <View style={{ flex: 1,alignSelf:'stretch',alignItems:'flex-end' }}>
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ show: false });
                      }}
                    >
                      <AntDesign
                        name="close"
                        size={24}
                        color="black"
                      /*                  style={{  top: HEIGHT/30, left: WIDTH/13.8}} */
                      />
                    </TouchableOpacity>
                  </View>

                    <View style={{ flex: 2, alignItems: 'center' }}>
                      <Text style={{ fontSize: WIDTH / 14 }}>Terms & Conditions</Text>
                    </View>


      
                </View>
                <View style={{ flex: 5, alignItems: 'center',margin:12 }}>

                  <Text style={styles.tcP}>
                    ידוע לי כי האפליקציה עושה שימוש בתמונות ושומרת נתונים אישיים
                    לחיצה על אישור מהווה הסכמה לכך אני מאשרת קבלת תוכן באמצעות
                    דיוור ישיר
                  </Text>

                </View>
              </View>
            </ScrollView>
          </View>
        </Modal>

        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: 'center',
            //backgroundColor:'yellow',
            height:HEIGHT/5

          }}
        >
          <Image source={independo} style={styles.logo} />
        </View>

        <View
          style={{
            flex: 3,
            borderWidth: 0,
            borderColor: "transparent",
            margin: WIDTH / 10,
            marginBottom: HEIGHT / 2,
            marginTop: 0,
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
              רשום את ילדך
            </Text>

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"שם פרטי"}
              onChangeText={(inputFirstName) =>
                this.setState({ firstname: inputFirstName })
              }
            />

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"שם משפחה"}
              onChangeText={(inputLastName) =>
                this.setState({ lastname: inputLastName })
              }
            />

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"אימייל"}
              keyboardType="email-address"
              onChangeText={(inputEmail) =>
                this.setState({ email: inputEmail })
              }
            />

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"סיסמה"}
              secureTextEntry={true}
              onChangeText={(inputPassword) =>
                this.setState({ password: inputPassword })
              }
            />

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"אימות סיסמה"}
              secureTextEntry={true}
              onChangeText={(inputConfirmationPassword) =>
                this.setState({ confirmpassword: inputConfirmationPassword })
              }
            />

            <View
              style={{
                alignItems: "center",
                justifyContent: "space-around",
                flexDirection: "row",
              }}
            >



              <TouchableOpacity
                onPress={() => {
                  this.setState({ show: true });
                }}
              >
                <Text
                  style={{
                    fontSize: WIDTH / 34.5,
                    fontWeight: "bold",
                    color: "blue",
                    textDecorationLine: "underline",
                  }}
                >
                  {" "}תנאי השימוש
                </Text>
              </TouchableOpacity>
              <Text style={{ fontSize: WIDTH / 34.5, fontWeight: "bold" }}>
                {" "}קראתי ואישרתי את
              </Text>
              <CheckBox
                checked={this.state.check}
                onPress={() => this.onePressed()}
                style={{ marginRight: HEIGHT / 45, borderColor: "black" }}
              />
            </View>



            <CustomValidationButton onPress={() => this.SavePress()}>
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


export default SignUpChild;

const styles = StyleSheet.create({

  tcContainer: {
    marginTop: 15,
    marginBottom: 15,
    height: HEIGHT * 0.7,
  },
  tcP: {
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },
  tcL: {
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 12,
  },


  text: {
    color: "rgba(0,0,0,0.7)",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },


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
