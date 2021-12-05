import React from "react";
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Alert, KeyboardAvoidingView, ScrollView } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { CheckBox } from "native-base";
import colors from "../Colors";
import CustomBackground from "../Components/CustomBackground";
import CustomValidationButton from "../Components/CustomValidationButton";
import independo from "../Images/Independo.png";
import firebase from "firebase/app";
import { compose } from "redux";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
require("firebase/auth");

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class AddTaskModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      taskname: "",
      category: "",
      hygiene: false,
      tidying: false,
    };
  }

  onePressed(category) {
    this.setState({ hygiene: true, tidying: false, category: category });
  }

  twoPressed(category) {
    this.setState({ hygiene: false, tidying: true, category: category });
  }

  createTask = async () => {
    const { taskname, category } = this.state;
    console.log("taskname.lenght = ", taskname.length);
    if (taskname.length > 16) {
      Alert.alert("", "שם המשימה מכילה לכל היותר 15 תווים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);

    }
    else if (taskname !== "" && category !== "") {
      const task = { taskname, category };
      // this.props.addTask(task);

      //console.log("Task,taskname = ", task.taskname)
      try {
        await firebase
          .database()
          .ref("Tasks").child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid).orderByKey().equalTo(task.taskname).once("value", snapshot => {
            if (snapshot.exists()) {
              Alert.alert("", "כבר קיים משימה בשם זה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
              console.log("exists");
            }
            else {
              firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                .child(task.taskname)
                .set({ taskname: task.taskname, category: task.category, CountAssign: 0, image: "", video: "", Steps: {} });
              this.props.addTasks({ taskname: task.taskname, category: task.category, image: "", video: "", Steps: {},CountAssign: 0 });
              this.setState({
                taskname: "",
                category: "",
                hygiene: false,
                tidying: false,
              });
              this.props.closeModal();
            }
          });
      }
      catch (error) {
        console.log(error);
      }








    } else {
      Alert.alert("", "כל השדות נדרשים", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
    }
  };

  render() {
    return (
      <KeyboardAvoidingView
        behavior="padding" keyboardVerticalOffset={Platform.OS == "android" ? -200 : 0}>
        <ScrollView alwaysBounceVertical={false}>

          <CustomBackground style={{ backgroundColor: '#fef8de' }}>
            <View>
              <TouchableOpacity
                style={{ position: "absolute", top: HEIGHT / 13, left: WIDTH / 13 }}
                onPress={this.props.closeModal}
              >
                <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: 'center',
                marginTop: Platform.OS === "ios" ? HEIGHT / 8 : HEIGHT / 90,
                marginBottom: HEIGHT / 30,

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
                  marginBottom: HEIGHT / 24

                }}
              >
                <Text
                  style={{ fontWeight: "bold", fontSize: WIDTH / 11.8, paddingBottom: HEIGHT / 30 }}
                >
                  יצירת משימה
                </Text>

                <TextInput
                  style={styles.input}
                  placeholderTextColor={"black"}
                  placeholder={"שם המשימה"}
                  onChangeText={(text) => this.setState({ taskname: text })}
                />


                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    alignSelf: 'center',
                    alignContent: 'flex-end',
                    marginTop: 5,
                  }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={{ fontSize: WIDTH / 27, paddingRight: 0 }}>היגיינה </Text>
                      <CheckBox
                        checked={this.state.hygiene}
                        onPress={() => this.onePressed("היגיינה")}
                        style={{ marginRight: HEIGHT / 45, borderColor: "black" }}
                      />

                    </View>

                    <View style={{ flexDirection: 'row', marginBottom: 2, alignItems: 'center' }}>
                      <Text style={{ fontSize: WIDTH / 27 }}>{"  "}סידור </Text>
                      <CheckBox
                        checked={this.state.tidying}
                        onPress={() => this.twoPressed("סידור")}
                        style={{ marginRight: HEIGHT / 45, borderColor: "black" }}
                      />

                    </View>
                  </View>
                  <Text style={{ fontSize: WIDTH / 27 }}>קטגוריה :</Text>
                </View>

                <CustomValidationButton onPress={this.createTask}>
                  <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>
                    יצירה!</Text>
                </CustomValidationButton>
              </View>
            </View>
          </CustomBackground>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addTasks: (task) => dispatch({ type: "ADD_TASK", payload: task }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(AddTaskModal);



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
