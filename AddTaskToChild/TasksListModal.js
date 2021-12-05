import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  Alert
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import NetworkImage from "react-native-image-progress";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import firebase from "firebase";
import white from "../Images/white.png";
import { connect } from "react-redux";
import { compose } from "redux";
import colors from "../Colors";
import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import CustomBackground from "../Components/CustomBackground";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import "firebase/storage";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class TasksListModal extends React.Component {
  componentDidMount = async () => {
    const tasks = await firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).once('value');//check if the task with this name is already exist
    const taskArray = snapshotToArray2(tasks);
    this.props.loadTasks(taskArray);

  };


  AddTaskToChildConfirmation = (selectedTask) => {
    Alert.alert(
      '', 'האם אתה בטוח שברצונך להוסיף משימה זו לילד?',
      [
        { text: 'ביטול', style: { fontSize: WIDTH / 41 } },
        { text: 'הוספה', style: { fontSize: WIDTH / 41 }, onPress: () => this.AddTaskToChild(selectedTask) },

      ],
      {
        cancelable: false
      }
    );
  }


  AddTaskToChild = async (selectedTask) => {
    //console.log("this.props.tasls.tasks = ", this.props.tasks.tasks)
    const email = this.props.email;
    console.log("email.key = ", email.key)
    firebase
      .database()
      .ref("Users")
      .child(firebase.auth().currentUser.uid)
      .child("status")
      .once("value")
      .then(async (snapshot) => {


        if (snapshot.val() === "Teacher") {

          try {
            await firebase
              .database()
              .ref("Tasks")
              .child(email.key).child(firebase.auth().currentUser.uid)
              .child(selectedTask.taskname)
              .once("value", async (snapshot) => {
                if (snapshot.exists()) {


                  Alert.alert("", "משימה זו כבר הוקצתה לילד זה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                }
                else {
                  if (typeof selectedTask.Steps === "object" && selectedTask.video !== "" && selectedTask.image !== "") {
                    await firebase
                      .database()
                      .ref("Tasks")
                      .child(email.key).child(firebase.auth().currentUser.uid)
                      .child(selectedTask.taskname)
                      .set(snapshot.val(), async (error) => {

                        await firebase.database().ref("Tasks").child(email.key).child(selectedTask.taskname).once("value", async snapshot => {

                          await firebase
                            .database()
                            .ref("Tasks")
                            .child(email.key).child(firebase.auth().currentUser.uid)
                            .child(selectedTask.taskname)
                            .update({
                              AssignPerson: firebase.auth().currentUser.uid,
                              name: email.name,
                              likeTeacher: false,
                              likeParent: false,
                              countEnterTask: 0,
                              idTeacher: firebase.auth().currentUser.uid,
                              idParent: '',
                              countViewVideo: 0,
                              taskname: selectedTask.taskname,
                              category: selectedTask.category,
                              Steps: selectedTask.Steps,
                              video: selectedTask.video,
                              countTaskDone: 0,
                              image: selectedTask.image
                            });






                          if (error) {
                            console.log(error);
                          } else {
                            this.props.updateCountAssign({ ...selectedTask, CountAssign: selectedTask.CountAssign + 1 });
                            console.log("this.props.tasls.tasks = ", this.props.tasks.tasks)
                            Alert.alert("", "המשימה נוספה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
      
                            const AssignRef = await firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid).child(selectedTask.taskname);
                            console.log('entreeeee')
                            AssignRef.once("value", (snapshot) => {
                              AssignRef.update({
                                CountAssign: snapshot.val().CountAssign + 1,
                              })

                            })

                          }


                        })

                      });

                  }
                  else {
                    console.log("ici")
                    if (typeof selectedTask.Steps !== "object" && selectedTask.video === "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף שלבים, תמונה וסרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video !== "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video === "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף סרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video !== "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף שלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video === "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף סרטון ושלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video !== "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה ושלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video === "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה וסרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }

                  }
                }
              });
          } catch (error) {
            console.log("catch => " + error);
          }



        } else if (snapshot.val() === "Parent") {
          console.log("parent")
          try {
            firebase
              .database()
              .ref("Tasks").child(email.key).child(firebase.auth().currentUser.uid)

              .child(selectedTask.taskname)
              .once("value", async  (snapshot) =>{
                if (snapshot.exists()) {
                  //console.log("selectedTask.Steps", selectedTask.Steps)
                  Alert.alert("", "משימה זו כבר הוקצתה לילד זה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                }
                else {

                  if (typeof selectedTask.Steps === "object" && selectedTask.video !== "" && selectedTask.image !== "") {

                    await firebase
                      .database()
                      .ref("Tasks")
                      .child(email.key).child(firebase.auth().currentUser.uid)
                      .child(selectedTask.taskname)
                      .set(snapshot.val(), async  (error) =>{

                        await firebase.database().ref("Tasks").child(email.key).child(firebase.auth().currentUser.uid).child(selectedTask.taskname).once("value", async  (snapshot) =>{

                          await firebase
                            .database()
                            .ref("Tasks")
                            .child(email.key).child(firebase.auth().currentUser.uid)
                            .child(selectedTask.taskname)
                            .update({
                              AssignPerson: firebase.auth().currentUser.uid,
                              name: email.name,
                              likeTeacher: false,
                              likeParent: false,
                              countEnterTask: 0,
                              idTeacher: '',
                              idParent: firebase.auth().currentUser.uid,
                              countViewVideo: 0,
                              taskname: selectedTask.taskname,
                              category: selectedTask.category,
                              Steps: selectedTask.Steps,
                              video: selectedTask.video,
                              countTaskDone: 0,
                              image: selectedTask.image
                            });
                          if (error) {
                            console.log(error);
                          } else {

                            Alert.alert("", "המשימה נוספה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
                             this.props.updateCountAssign({ ...selectedTask, CountAssign: selectedTask.CountAssign + 1 })
                            console.log("this.props.tasls.tasks = ", this.props.tasks.tasks)
                             const AssignRef = await firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid).child(selectedTask.taskname);
                            console.log('entreeeee')
                            AssignRef.once("value", (snapshot) => {
                              AssignRef.update({
                                CountAssign: snapshot.val().CountAssign + 1,
                              })

                            })


                          }


                        })

                      });

                  } else {
                    if (typeof selectedTask.Steps !== "object" && selectedTask.video === "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף שלבים, תמונה וסרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video !== "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video === "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף סרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video !== "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף שלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video === "" && selectedTask.image !== "") {
                      Alert.alert("", "חובה להוסיף סרטון ושלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps !== "object" && selectedTask.video !== "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה ושלבים על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }
                    else if (typeof selectedTask.Steps === "object" && selectedTask.video === "" && selectedTask.image === "") {
                      Alert.alert("", "חובה להוסיף תמונה וסרטון על מנת לשייך משימה לילד", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
                    }

                  }
                }
              });
          } catch (error) {
            console.log("catch => " + error);
          }

        };
      })
  }



  renderTodo = (item, index) => {
    return (
      <View
        style={styles.taskContainer}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            //backgroundColor: "green",
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: WIDTH / 50,
            justifyContent: 'flex-end'
          }}
          onPress={() => this.AddTaskToChildConfirmation(item)}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
            <Text style={styles.taskTitle}>{item.taskname}</Text>
            <Text style={styles.taskTitle}>{item.category}</Text>
          </View>

          {item.image ? (
            <NetworkImage
              source={{ uri: item.image }}
              style={styles.image}
              imageStyle={styles.ImageStyle}

              indicator={() => (
                <AnimatedCircularProgress
                  size={HEIGHT / 13}
                  width={5}
                  fill={100}
                  tintColor="black"
                  backgroundColor="white"
                />
              )}
            />
          ) : (
            <Image source={white} style={styles.imageWhite} />
          )}

        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const email = this.props.email;
    //console.log("tasklistmodal email = "+email.childEmail)
    return (
      <CustomBackground>
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ position: "absolute", top: HEIGHT / 17.2, left: WIDTH / 13.8, zIndex: 10 }}
              onPress={this.props.closeModal}
            >
              <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 13 }}>
            <Text style={{ textAlign: 'right', fontSize: WIDTH / 16.5, paddingTop: HEIGHT / 30 }}> ללחוץ על המשימה על מנת להוסיף אותה לילד : </Text>

            <FlatList
              data={this.props.tasks.tasks}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontSize: WIDTH / 21, fontWeight: "bold" }}>
                    אין משימה להוספה
                  </Text>
                </View>
              }
              keyboardShouldPersistTaps="always"
            />
          </View>
        </SafeAreaView>
      </CustomBackground>
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
    loadTasks: (tasks) =>
      dispatch({ type: "LOAD_TASKS_FROM_SERVER", payload: tasks }),
    updateCountAssign: (task) =>
      dispatch({ type: 'UPDATE_COUNT_ASSIGN', payload: task })
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(TasksListModal);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskContainer: {
    width: WIDTH,
    backgroundColor: '#efe8fd',
    borderWidth: 1,
  },


  section: {
    alignSelf: "stretch",
    marginTop: HEIGHT / 30,
  },

  taskTitle: {
    fontSize: WIDTH / 22,
    fontWeight: "600",
    color: colors.black,
    paddingVertical: HEIGHT / 224,
    marginRight: 20,
    textAlign: 'right'
  },

  imageWhite: {
    height: HEIGHT / 13,
    width: HEIGHT / 13,
    borderRadius: HEIGHT / 26,
    borderColor: colors.black,
    borderWidth: 1,
    margin: 5,

  },

  image: {
    height: HEIGHT / 13,
    width: HEIGHT / 13,
    borderRadius: HEIGHT / 26,
    borderColor: colors.black,
    margin: 5,

  },

  ImageStyle: {
    height: HEIGHT / 13,
    width: HEIGHT / 13,
    borderRadius: HEIGHT / 26,
    borderWidth: 1,
  },

});
