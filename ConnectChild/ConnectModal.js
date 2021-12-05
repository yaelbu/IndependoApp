
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Alert,ScrollView,KeyboardAvoidingView
} from "react-native";
import firebase from "firebase";
import colors from "../Colors";
import { AntDesign } from "@expo/vector-icons";
import independo from "../Images/Independo.png";
import CustomBackground from "../Components/CustomBackground";
import CustomValidationButton from "../Components/CustomValidationButton";
import "firebase/storage";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class ConnectModal extends React.Component {
  state = {
    emailAdult: "",
  };

  componentDidMount = async () => {
    //enter to the task with list of todo list
  };

  addAdultConnexion = async () => {
    let email = this.props.email;
    if (this.state.emailAdult !== "") {
      firebase
        .database()
        .ref("Users")
        .child(firebase.auth().currentUser.uid)
        .once("value", async(snapshot) => {
          if (snapshot.val().status === "Teacher") {
            console.log('teacher')
            firebase
              .database()
              .ref("Users")
              .orderByChild("emailUser")
              .equalTo(this.state.emailAdult.toLowerCase())
              .on("value", async (snapshot2) =>{
                if (snapshot2.exists()) {
                  snapshot2.forEach((data) =>{
                    console.log("data.key = ",data.key)
                    const statusAdult =firebase
                      .database()
                      .ref("Users")
                      .child(data.key);
                    if (statusAdult) {
                       statusAdult.on("value", async(snapshot1) => {
                        if (snapshot1.val().status === "Teacher") {
                          //Teacher has to connect Parent and not Teacher,so impossible!
                          Alert.alert("", "לא ניתן לחבר ילד למורה נוסף", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }])
            
                        } else if (snapshot1.val().status === "Parent") {
                          console.log("parent")
                          await firebase
                            .database()
                            .ref("Users")
                            .child(email.key)
                            .once("value", async(snapshot) => {
                              if (snapshot.val().creatorParent === "") {
                                await firebase
                                  .database()
                                  .ref("Users")
                                  .child(email.key)
                                  .update({ creatorParent: snapshot1.key });
                                Alert.alert(
                                  "", "החיבור מוצלח", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]
                                );
                                try {
                                  await firebase
                                    .database()
                                    .ref("AdultList")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key)
                                    .once("value",  async(snapshot) =>{
                                      await firebase
                                        .database()
                                        .ref("AdultList")
                                        .child(data.key)
                                        .child(email.key)
                                        .set(snapshot.val()),
                                        function (error) {
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log("successfully");
                                          }
                                        };
                                    });
                                } catch (error) {
                                  console.log("catch => " + error);
                                }
                                try {
                                  console.log("data.key = ",data.key)
                                  console.log("email.key = ",email.key)
                                  const UpdateIdParent = firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key);
                                    
                                    UpdateIdParent.once("value", async(snapshot1) => {
                                      snapshot1.forEach(async(childSnapshot)=>{
                                        const updateid= firebase
                                        .database()
                                        .ref("Feedback")
                                        .child(firebase.auth().currentUser.uid)
                                        .child(email.key).child(childSnapshot.key)

                                        await updateid.once("value",async(snapshot3)=>{
                                          updateid.update({idParent:data.key})
                                            })
                                          })
                                        
                                      });
                                    const lastupdate= firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key);
                                     lastupdate.on("value",  async(snapshot2) =>{
                                      await firebase
                                        .database()
                                        .ref("Feedback")
                                        .child(data.key).child(email.key)
                                        .set(snapshot2.val()),
                                        function (error) {
                                          //data.key
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log("successfully");
                                          }
                                        };
                                    }); 
                                } catch (error) {
                                  console.log("catch => " + error);
                                }
                              } else {
                                Alert.alert(
                                  "", "הילד כבר מחובר להורה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]
                                );
                              }
                            });
                        }
                      });
                    }
                  });
                } else {
                  Alert.alert("", "המייל לא קיים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]);

                }
              });
          }

 /*          if (snapshot.val().status === "Parent") {
            console.log('parent')
            firebase
              .database()
              .ref("Users")
              .orderByChild("emailUser")
              .equalTo(this.state.emailAdult.toLowerCase())
              .on("value",  async(snapshot2)=> {
                if (snapshot2.exists()) {
                  snapshot2.forEach(function (data) {
                    console.log("data.key = ",data.key)
                    const statusAdult = firebase
                      .database()
                      .ref("Users")
                      .child(data.key);
                    if (statusAdult) {
                      statusAdult.on("value", async(snapshot1) => {
                        if (snapshot1.val().status === "Parent") {
                          //Teacher has to connect Parent and not Teacher,so impossible!
                          Alert.alert(
                            "", "לא ניתן לחבר ילד להורה נוסף", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]
                          );
                        } else if (snapshot1.val().status === "Teacher") {
                          await firebase
                            .database()
                            .ref("Users")
                            .child(email.key)
                            .once("value", async(snapshot) => {
                              if (snapshot.val().creatorTeacher === "") {
                               await firebase
                                  .database()
                                  .ref("Users")
                                  .child(email.key)
                                  .update({ creatorTeacher: snapshot1.key });
                                Alert.alert(
                                  "", "החיבור מוצלח", [{ text: "אוקיי",style: { fontSize: WIDTH / 41 }  }]
                                );

                                try {
                                 await firebase
                                    .database()
                                    .ref("AdultList")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key)
                                    .once("value",  async(snapshot)=> {
                                      firebase
                                        .database()
                                        .ref("AdultList")
                                        .child(data.key)
                                        .child(email.key)
                                        .set(snapshot.val()),
                                        function (error) {
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log("successfully");
                                          }
                                        };
                                    });
                                } catch (error) {
                                  console.log("catch => " + error);
                                }
                                try {
                                  console.log("data.key = ",data.key)
                                  console.log("email.key = ",email.key)
                                  const UpdateIdTeacher =await firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key);
                                    
                                    UpdateIdTeacher.once("value", async(snapshot1) => {
                                      snapshot1.forEach(childSnapshot=>{
                                        const updateid=firebase
                                        .database()
                                        .ref("Feedback")
                                        .child(firebase.auth().currentUser.uid)
                                        .child(email.key).child(childSnapshot.key)

                                        updateid.once("value",snapshot3=>{
                                          updateid.update({idTeacher:data.key})
                                            })
                                          })
                                        
                                      });
                                    const lastupdate= firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(firebase.auth().currentUser.uid)
                                    .child(email.key);
                                    lastupdate.on("value",  async(snapshot2) =>{
                                      await firebase
                                        .database()
                                        .ref("Feedback")
                                        .child(data.key).child(email.key)
                                        .set(snapshot2.val()),
                                        function (error) {
                                          //data.key
                                          if (error) {
                                            console.log(error);
                                          } else {
                                            console.log("successfully");
                                          }
                                        };
                                    }); 
                                } catch (error) {
                                  console.log("catch => " + error);
                                }
                              } else {
                                Alert.alert(
                                  "", "הילד כבר מחובר למורה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]
                                );
                              }
                            });
                        }
                      });
                    }
                  });
                  //props.closeModal;
                  //this.props.closeModal;
                } else {
                  Alert.alert("", "המייל לא קיים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 }  }]);

                }
              });
          } */
        });
    }
    else {
      Alert.alert("", "השדה הוא שדה חובה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])

    }
    this.setState({ emailAdult: "" })
  };


  render() {
    //const email = this.props.email;
    return (
      <KeyboardAvoidingView  
      behavior="padding" keyboardVerticalOffset={Platform.OS=="android" ? -200 : 0}>
      <ScrollView alwaysBounceVertical={false}>
  
      <CustomBackground>
        <TouchableOpacity
          style={{ position: "absolute", top: HEIGHT / 17.2, left: WIDTH / 13.8, zIndex: 10 }}
          onPress={this.props.closeModal}
        >
          <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
        </TouchableOpacity>
        <View
          style={{
            header: 20,
            marginBottom: Platform.OS === "ios" ? 0 : -10,
            backgroundColor: "",
            alignItems: "center",
            marginTop: Platform.OS === "ios" ? 50 : 15
          }}
        >
          <Image source={independo} style={styles.logo} />
        </View>
        <View
          style={{
            flex: 1,
            borderWidth: 0,
            borderColor: "transparent",
            margin: 40,
            marginTop: 0,
            marginBottom: Platform.OS === "ios" ? WIDTH / 2.1 : WIDTH / 3.9

          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "rgb(245,245,245)",
              alignItems: "center",
              paddingTop: Platform.OS === "ios" ? HEIGHT / 25 : HEIGHT / 35,
              //borderWidth: 0.1,
              borderColor: "black",
              borderRadius: 10,
              elevation: 20,
              shadowOpacity: 15,
              shadowColor: 'black',

            }}
          >

            <Text
              style={{ fontWeight: "bold", fontSize: WIDTH / 18, paddingBottom: Platform.OS === "ios" ? 20 : 20,paddingRight: WIDTH/16.5 }}
            >
              נא, להכניס את כתובת מייל של הורה/מורה שתרצה לשייך לילד

            </Text>

            <TextInput
              style={styles.input}
              placeholderTextColor={"black"}
              placeholder={"אימייל"}
              keyboardType="email-address"
              onChangeText={(text) => this.setState({ emailAdult: text })}
              value={this.state.emailAdult}
            />

            <CustomValidationButton onPress={() => this.addAdultConnexion()}>
              <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>הוספה</Text>
            </CustomValidationButton>
          </View>
        </View>
      </CustomBackground>
      </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}


export default ConnectModal;

const styles = StyleSheet.create({

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
