import React from "react";
import { View, Text, Alert, Image, ActivityIndicator, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";
import firebase from "firebase";
import white from '../Images/white.png';
import { snapshotToArray } from "../helpers/firebaseHelpers";
import * as ImageHelpers from "../helpers/ImageHelpers";

//Components
import CustomBackground from "../Components/CustomBackground";
import StepsCountContainer from "../Redux/containers/StepsCountContainer";
import CustomValidationButton from "../Components/CustomValidationButton";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class TodoListChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showVisibleIndicator: false
        };
    }

    componentDidMount = async () => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        //console.log("task-TodoListChild = ", task);

        const steps = await firebase
            .database()
            .ref("Tasks")
            .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
            .child(task.taskname)
            .child("Steps")
            .once("value"); //check if the task with this name is already exist
        const stepArray = snapshotToArray(steps);
        this.props.loadSteps(stepArray);
        //console.log("stepArray.length = ", stepArray.length)
    };

    toggleTodoCompleted = async (index, step) => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        await firebase
            .database()
            .ref("Tasks")
            .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
            .child(task.taskname)
            .child("Steps")
            .child(step.title)
            .update({ status: !step.status });

        if (step.status === false) {
            this.props.markStepAsDone({ ...step })
        }
        else {
            this.props.markStepAsUndone({ ...step })
        }

      /*   step.status = !step.status;
        this.props.updateStepStatus({ ...step, status: step.status });
     */  };

    addFeedbackImage = (selectedTask) => {
        //function to display the option for the photos(gallery or camera or cancel)
        const options = ["Camera", "Cancel"];
        const cancelButtonIndex = 2;
        if ((this.props.steps.stepsDone).length === (this.props.steps.steps).length) {
            this.props.showActionSheetWithOptions(
                {
                    options,
                    cancelButtonIndex,
                },

                (buttonIndex) => {
                    if (buttonIndex == 0) {
                        //select the library option
                        this.openCamera(selectedTask);
                    }
                }
            );
        }
        else {
            Alert.alert("", "אתה חייב לבצע את כל השלבים כדי להמשיך", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }])
        }
    };

    openCamera = async (task) => {
        const result = await ImageHelpers.openCamera();
        if (result) {
            const downloadUrl = await this.uploadImage(result, task);

            //console.log("3 this.showVisiblEiNdicator = ", this.state.showVisibleIndicator)
            this.props.updateFeedBackImage({ ...task, uri: downloadUrl }); //revoir cette mise a jour
        }
    };

    uploadImage = async (ImageFeedback, selectedTask) => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        this.setState({ showVisibleIndicator: !this.state.showVisibleIndicator });
        // console.log("1 this.showVisiblEiNdicator = ", this.state.showVisibleIndicator)
        const taskRef = firebase
            .storage()
            .ref(firebase.auth().currentUser.uid)
            .child("Tasks")
            .child(selectedTask.taskname)
            .child("FeedbackImage");
        try {
            const blob = await ImageHelpers.prepareBlob(ImageFeedback.uri);
            const snapshot = await taskRef.put(blob);
            let downloadUrl = await taskRef.getDownloadURL();

            const response = firebase
                .database()
                .ref("Users")
                .child(firebase.auth().currentUser.uid);

            if (response) {

                this.setState({ showVisibleIndicator: !this.state.showVisibleIndicator });
                response.on("value", (snapshot) => {


                    if (
                        snapshot.val().creatorParent !== "" &&
                        snapshot.val().creatorTeacher !== ""
                    ) {
                        firebase
                            .database()
                            .ref("Users")
                            .child(firebase.auth().currentUser.uid)
                            .on("value", (snapshot) => {
                                const name =
                                    snapshot.val().firstname + " " + snapshot.val().lastname;
                                firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(snapshot.val().creatorParent)
                                    .child(firebase.auth().currentUser.uid)
                                    .child(selectedTask.taskname)
                                    .update({
                                        name: name,
                                        ImageFeedback: downloadUrl,
                                        ChildID: firebase.auth().currentUser.uid,
                                        likeParent: false,
                                        likeTeacher: false,
                                        countLike: 0,
                                        idTeacher: snapshot.val().creatorTeacher,
                                        idParent: snapshot.val().creatorParent,
                                        taskname: selectedTask.taskname
                                    });
                                firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(snapshot.val().creatorTeacher)
                                    .child(firebase.auth().currentUser.uid)
                                    .child(selectedTask.taskname)
                                    .update({
                                        name: name,
                                        ImageFeedback: downloadUrl,
                                        ChildID: firebase.auth().currentUser.uid,
                                        likeParent: false,
                                        likeTeacher: false,
                                        countLike: 0,
                                        idTeacher: snapshot.val().creatorTeacher,
                                        idParent: snapshot.val().creatorParent,
                                        taskname: selectedTask.taskname
                                    });
                                firebase
                                    .database()
                                    .ref("Tasks")
                                    .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
                                    .child(selectedTask.taskname)
                                    .update({ countTaskDone: selectedTask.countTaskDone + 1 });
                            });
                    }

                    else if (
                        snapshot.val().creatorParent !== "" &&
                        snapshot.val().creatorTeacher === ""
                    ) {
                        firebase
                            .database()
                            .ref("Users")
                            .child(firebase.auth().currentUser.uid)
                            .on("value", (snapshot) => {
                                const name =
                                    snapshot.val().firstname + " " + snapshot.val().lastname;
                                firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(snapshot.val().creatorParent)
                                    .child(firebase.auth().currentUser.uid)
                                    .child(selectedTask.taskname)
                                    .update({
                                        name: name,
                                        ImageFeedback: downloadUrl,
                                        ChildID: firebase.auth().currentUser.uid,
                                        likeParent: false,
                                        likeTeacher: false,
                                        countLike: 0,
                                        idTeacher: "",
                                        idParent: snapshot.val().creatorParent,
                                        taskname: selectedTask.taskname
                                    });
                                firebase
                                    .database()
                                    .ref("Tasks")
                                    .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
                                    .child(selectedTask.taskname)
                                    .update({ countTaskDone: selectedTask.countTaskDone + 1 });
                            });
                    }

                    else if (
                        snapshot.val().creatorParent === "" &&
                        snapshot.val().creatorTeacher !== ""
                    ) {
                        firebase
                            .database()
                            .ref("Users")
                            .child(firebase.auth().currentUser.uid)
                            .on("value", (snapshot) => {
                                const name =
                                    snapshot.val().firstname + " " + snapshot.val().lastname;
                                firebase
                                    .database()
                                    .ref("Feedback")
                                    .child(snapshot.val().creatorTeacher)
                                    .child(firebase.auth().currentUser.uid)
                                    .child(selectedTask.taskname)
                                    .update({
                                        name: name,
                                        ImageFeedback: downloadUrl,
                                        ChildID: firebase.auth().currentUser.uid,
                                        likeParent: false,
                                        likeTeacher: false,
                                        countLike: 0,
                                        idTeacher: snapshot.val().creatorTeacher,
                                        idParent: "",
                                        taskname: selectedTask.taskname
                                    });
                                firebase
                                    .database()
                                    .ref("Tasks")
                                    .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
                                    .child(selectedTask.taskname)
                                    .update({ countTaskDone: selectedTask.countTaskDone + 1 });
                            });
                    }




                });
            }
            const PointEndTaskRef = firebase
                .database().ref("Users").child(firebase.auth().currentUser.uid);

            await PointEndTaskRef.once("value").then((snapshot) => {
                PointEndTaskRef.update({
                    Points: snapshot.val().Points + 50,
                });

                const points = (snapshot.val().Points) + 50
                this.props.updatePoints({ points: points })
                //console.log("points = ", points)
            })



            const RefStatus = firebase.database().ref("Tasks").child(firebase.auth().currentUser.uid).child(task.AssignPerson).child(task.key).child("Steps");
            RefStatus.once("value", (snapshot) => {
                if (snapshot.exists()) {
                    snapshot.forEach(function (data) {

                        const StatusStep = firebase
                            .database()
                            .ref("Tasks")
                            .child(firebase.auth().currentUser.uid).child(task.AssignPerson).child(task.key).child("Steps").child(data.key).update({ status: false });

                    })
                }
            })





            blob.close();
            return downloadUrl;


        } catch (error) {
            console.log(error);
        }
    };



    renderTodo = (step, index) => {
        return (
            <View style={styles.todoContainer}>
                <Text
                    style={[
                        styles.todo,
                        {
                            textDecorationLine: step.completed ? "line-through" : "none",
                            color: step.completed ? colors.gray : colors.black,
                            marginRight: 20,
                        },
                    ]}
                >
                    {step.title}
                </Text>

                {step.image ? (
                    <NetworkImage
                        source={{ uri: step.image }}
                        style={styles.imageStep}
                        imageStyle={styles.ImageStyleStep}
                        indicator={() => (
                            <AnimatedCircularProgress
                                size={HEIGHT / 20}
                                width={5}
                                fill={100}
                                tintColor="black"
                                backgroundColor="white"
                            />
                        )}

                    />
                ) : (
                    <Image source={white} style={styles.imageStep} />
                )}

                <TouchableOpacity onPress={() => this.toggleTodoCompleted(index, step)}>
                    <Ionicons
                        name={step.status ? "checkbox-outline" : "ios-square-outline"}
                        size={24}
                        color={colors.black}
                        style={{ width: WIDTH / 13, marginLeft: HEIGHT / 45, marginRight: HEIGHT / 50 }}
                    />
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        return (
            <CustomBackground>
                <SafeAreaView style={styles.container}>
                    <View
                        style={[
                            styles.section,
                            styles.header,
                            { borderBottomColor: "black", flexDirection: "row" },
                        ]}
                    >

                        <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.title}>{task.taskname}</Text>

                            <View style={{ flexDirection: 'row' }}>
                                <StepsCountContainer type="steps" />
                                <Text style={{ fontSize: WIDTH / 27.6 }}> שלבים מתוך </Text>
                                <StepsCountContainer type="stepsDone" />
                            </View>
                        </View>


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
                    <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>

                        <FlatList
                            data={this.props.steps.steps}
                            renderItem={({ item, index }) => this.renderTodo(item, index)}
                            keyExtractor={(item, index) => index.toString()}
                            showsVerticalScrollIndicator={false}
                        />


                        {this.state.showVisibleIndicator ? (
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <ActivityIndicator size="large" color="black" />
                            </View>



                        ) : null}







                    </View>


                    {!this.state.showVisibleIndicator ? (
                        <CustomValidationButton onPress={() => this.addFeedbackImage(task)} disabled={false}>
                            <Text style={{ fontWeight: "600", color: "white" }}>סלפי</Text>
                        </CustomValidationButton>) : (<CustomValidationButton disabled={true}>
                            <Text style={{ fontWeight: "600", color: "white" }}>סלפי</Text>
                        </CustomValidationButton>)}
                </SafeAreaView>
            </CustomBackground>
        );
    }
}




const mapStateToProps = (state) => {
    return {
        steps: state.steps,
        points: state.points
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSteps: (steps) =>
            dispatch({ type: "LOAD_STEPS_FROM_SERVER", payload: steps }),
        updateStepStatus: (step) =>
            dispatch({ type: "UPDATE_STEP_STATUS", payload: step }),
        updateFeedBackImage: (task) =>
            dispatch({ type: "UPDATE_FEEDBACK_IMAGE", payload: task }),
        markStepAsDone: (step) => dispatch({ type: "UPDATE_STEP_STATUS_DONE", payload: step }),
        markStepAsUndone: (step) =>
            dispatch({ type: "UPDATE_STEP_STATUS_UNDONE", payload: step }),
        updatePoints: (Points) =>
            dispatch({ type: "INCREMENT_POINTS", payload: Points }),

    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(TodoListChild);



const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    section: {
        alignSelf: "stretch",
    },

    header: {
        marginLeft: WIDTH / 6,
        borderBottomWidth: 3,
        paddingTop: HEIGHT / 30,
        justifyContent: 'flex-end',
    },

    image: {
        height: HEIGHT / 10,
        width: HEIGHT / 10,
        borderRadius: HEIGHT / 20,
        borderColor: colors.black,
        borderWidth: 0.3,
        justifyContent: 'space-around',
        alignSelf: 'flex-start',
        alignContent: 'space-around',
        marginRight: WIDTH / 18,
        marginBottom: HEIGHT / 90
    },

    ImageStyle: {
        height: HEIGHT / 10,
        width: HEIGHT / 10,
        borderRadius: HEIGHT / 20,
        borderWidth: 1,
    },

    ImageStyleStep: {
        height: HEIGHT / 20,
        width: HEIGHT / 20,
        //borderRadius: HEIGHT / 40,
        borderWidth: 0.2,
    },



    imageStep: {
        height: HEIGHT / 20,
        width: HEIGHT / 20,
        marginRight: WIDTH / 12,
        borderColor: colors.black,
        borderWidth: 0.3,
        backgroundColor: colors.white,
    },


    title: {
        fontSize: WIDTH / 14,
        fontWeight: "700",
        color: colors.black,
        paddingTop: HEIGHT / 22.5,
        marginRight: WIDTH / 40,
        flexDirection: "row",
    },

    todoContainer: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 42,
        alignSelf: "flex-end",
    },
});
