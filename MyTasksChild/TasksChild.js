
import React from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    View,
    Dimensions,
    ActivityIndicator, TouchableOpacity
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import CustomBackground from "../Components/CustomBackground";
import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import colors from "../Colors";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";
require("firebase/auth");
require("firebase/database");
/* 
import VideoTaskChild from "./VideoTaskChild"; */
import HeaderActions from "../Components/HeaderActions";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class TasksChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            tasks: [],
        };
    }

    componentDidMount = async () => {
        var useruid = firebase.auth().currentUser.uid;
        const tasks = await firebase
            .database()
            .ref("Tasks")
            .child(useruid)
            .once("value"); //check if the task with this name is already exist
        const taskArray = snapshotToArray2(tasks);
        this.props.loadTasks(taskArray);
        console.log("taskArray.length = ", taskArray.length)
    };


    renderTask = (task) => {
        return(
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
                onPress={() => this.props.navigation.navigate("VideoChild",{task})}



            >
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
                    <Text style={styles.taskTitle}>{task.taskname}</Text>
                    <Text style={styles.taskTitle}>{task.category}</Text>
                </View>

                {task.image ? (
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
                ) : (
                    <Image source={white} style={styles.ImageWhite} />
                )}

            </TouchableOpacity>
        </View>
        )
    };

    render() {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={colors.blueLogo} />
                </View>
            );
        }
        return (

            <CustomBackground>

                <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center' }}>
                    <HeaderActions children1={"המשימות "} children2={" שלי "} />
                </View>

                <View style={{ flex: 5, backgroundColor: 'transparent' }}>
                    <FlatList
                        data={this.props.tasks.tasks}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps="always"
                        renderItem={({ item }) => this.renderTask(item)}
                        ListEmptyComponent={
                            <View
                                style={{ justifyContent: "center", alignItems: "center" }}
                            >
                                <Text style={{ fontSize: WIDTH / 21, fontWeight: "bold" }}>
                                    אין לך אף משימה
                                </Text>
                            </View>
                        }
                    />
                </View>

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
    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(TasksChild);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 0,
    },
    taskContainer: {
        width: WIDTH,
        backgroundColor: '#efe8fd',
        borderWidth: 1,
    },
    taskTitle: {
        fontSize: WIDTH / 22,
        fontWeight: "600",
        color: colors.black,
        paddingVertical: HEIGHT / 224,
        marginRight: 20,
        textAlign: 'right'
    },

    ImageStyle: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderWidth: 1,
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



});
