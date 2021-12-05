import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
  Alert
} from "react-native";

import NetworkImage from "react-native-image-progress";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import white from "../Images/white.png";
import firebase from "firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import colors from "../Colors";
import CustomBackground from "../Components/CustomBackground";
import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import "firebase/storage";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class TasksListModalDelete extends React.Component {
  state = {};

  componentDidMount = async () => {
    //enter to the task with list of todo list
    const childID = this.props.email.key;
    const tasksChildren = await firebase
      .database()
      .ref("Tasks")
      .child(childID)
      .once("value"); //check if the task with this name is already exist
    const tasksChildrenArray = snapshotToArray2(tasksChildren);
    this.props.loadChildTasks(tasksChildrenArray);

    const tasks = await firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).once('value');//check if the task with this name is already exist
    const taskArray = snapshotToArray2(tasks);
    this.props.loadTasks(taskArray);
  };


  DeleteTaskToChildConfirmation = (selectedTask) => {
    Alert.alert(
      '', 'האם אתה בטוח שברצונך להסיר משימה זו מהילד?',
      [
        { text: 'ביטול', style: { fontSize: WIDTH / 41 } },
        { text: 'מחק', style: { fontSize: WIDTH / 41 }, onPress: () => this.DeleteTaskToChild(selectedTask) },

      ],
      {
        cancelable: false
      }
    );
  }

  DeleteTaskToChild = async (selectedTask) => {
    const childID = this.props.email.key;
    const taskid = selectedTask.key;

    firebase.database().ref("Tasks").child(childID).child(firebase.auth().currentUser.uid).child(taskid).remove();
    this.props.deleteTaskToChild(selectedTask);

    const AssignRef = await firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid).child(taskid);
    AssignRef.once("value", (snapshot) => {
      console.log("snapshot.val().CountAssign = ",snapshot.val().CountAssign)
       AssignRef.update({
        CountAssign: snapshot.val().CountAssign - 1,
      }) 
    })
    console.log("this.props.tasls.tasks avant = ", this.props.tasks.tasks) 
     this.props.updateCountAssign({ ...selectedTask, CountAssign: selectedTask.CountAssign - 1 })
    console.log("this.props.tasls.tasks = ", this.props.tasks.tasks) 

    Alert.alert("", 'משימה זו נמחקה מחשבון הילד', [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])


  };

  renderTodo = (task, index) => {
    return (
      <View
        style={styles.taskContainer}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginHorizontal: WIDTH / 50,

          }}
        >
          <View style={{ flexDirection: 'row' }}>
            <View style={{ justifyContent: 'center', flex: 1, paddingLeft: WIDTH / 150 }}>
              <TouchableOpacity onPress={() => this.DeleteTaskToChildConfirmation(task)}>
                <Ionicons name="ios-trash" size={WIDTH / 20} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignSelf: 'flex-end' }}>
              <View style={{ flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
                <Text style={styles.taskTitle}>{task.taskname}</Text>
                <Text style={styles.taskTitle}>{task.category}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>


                <NetworkImage
                  source={{ uri: task.image }}
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

              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const email = this.props.email;
    return (
      <CustomBackground>
        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={this.props.closeModal} style={{ position: "absolute", top: HEIGHT / 20, left: WIDTH / 15, zIndex: 10 }}
            >
              <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 7 }}>
            <FlatList
              data={this.props.tasksChildren.tasksChildren}
              renderItem={({ item, index }) => this.renderTodo(item, index)}
              keyExtractor={(item, index) => index.toString()}
              showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              ListEmptyComponent={
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={{ fontSize: WIDTH / 21, fontWeight: "600" }}>
                    אין משימה למחיקה
                  </Text>
                </View>
              }
            />
          </View>

        </SafeAreaView>
      </CustomBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasksChildren: state.tasksChildren,
    tasks:state.tasks
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadChildTasks: (tasksChildren) =>
      dispatch({
        type: "LOAD_CHILD_TASKS_FROM_SERVER",
        payload: tasksChildren,
      }),
      loadTasks: (tasks) =>
      dispatch({ type: "LOAD_TASKS_FROM_SERVER", payload: tasks }),
    updateCountAssign: (task) =>
      dispatch({ type: 'UPDATE_COUNT_ASSIGN', payload: task }),
    deleteTaskToChild: (taskChildren) =>
      dispatch({ type: "DELETE_TASK_CHILD", payload: taskChildren }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(TasksListModalDelete);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:'blue'
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
    borderWidth: 2,
  },


  taskTitle: {
    fontSize: WIDTH / 22,
    fontWeight: "600",
    color: colors.black,
    paddingVertical: HEIGHT / 224,
    marginRight: 20,
    textAlign: 'right'
  },

  taskContainer: {
    width: WIDTH,
    backgroundColor: '#efe8fd',
    borderWidth: 1,
    flex: 1
  },






});
