
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  ActivityIndicator,FlatList,TouchableOpacity,Text,SafeAreaView
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
 import TasksListModal from "./TasksListModal";
 import { AntDesign } from "@expo/vector-icons";

import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import colors from "../Colors";
require("firebase/auth");


//components
import CustomBackground from "../Components/CustomBackground";
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class TasksModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount = async () => {
      const email=this.props.email;
      console.log("email.key = ",email.key);
      const tasksChildren = await firebase
      .database()
      .ref("Tasks")
      .child(email.key)
      .once("value"); //check if the task with this name is already exist
      //console.log("componentDidMount tasksChildren = ",tasksChildren);
    const tasksChildrenArray = snapshotToArray2(tasksChildren);
    this.props.loadChildTasks(tasksChildrenArray);
  };



   renderTask = (task) => {
       const email=this.props.email;
    return <TasksListModal email={email} task={task} />;
  }; 



  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      );
    }
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
              <Text style={{ textAlign: 'right', fontSize: WIDTH / 16.5, paddingTop: HEIGHT / 30 }}> ללחוץ על המשימה על מנת לראות את ההתקדמות הילד : </Text>


        <FlatList
          data={this.props.tasksChildren.tasksChildren}
          renderItem={({ item }, index) => this.renderTask(item, index)}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Text style={{ fontSize: WIDTH/21, fontWeight: "600" }}>
                אין משימה עבור הילד
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
      emails: state.emails,
    };
  };
  
  const mapDispatchToProps = (dispatch) => {
    return {
      loadChildTasks: (tasksChildren) =>
        dispatch({
          type: "LOAD_CHILD_TASKS_FROM_SERVER",
          payload: tasksChildren,
        }),
      deleteTaskToChild: (taskChildren) =>
        dispatch({ type: "DELETE_TASK_CHILD", payload: taskChildren }),
    };
  };
  
  const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
  );

export default wrapper(TasksModal);

const styles = StyleSheet.create({
  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },

  addTask: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
  },
});
