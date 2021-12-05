import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Dimensions, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import Colors from '../Colors';
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { compose } from "redux";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import firebase from "firebase/app";
import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import addimage from '../Images/addimage.png';
import * as ImageHelpers from "../helpers/ImageHelpers";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Video } from "expo-av";
import colors from "../Colors";


//Components
import CustomBackground from '../Components/CustomBackground';
import HeaderActionsNewTask from '../Components/HeaderActionsNewTask';
import AddTaskModal from './AddTaskModal';

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class AddTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addTaskVisible: false,
            loading: false,
            opacity: 0,
            showVisibleIndicatorVideo: false
        };
    }


    componentDidMount = async () => {
        const tasks = await firebase
            .database()
            .ref("Tasks")
            .child(firebase.auth().currentUser.uid)
            .once("value"); //check if the task with this name is already exist
        const taskArray = snapshotToArray2(tasks);
        this.props.loadTasks(taskArray);
        console.log("taskArray = ", taskArray);
    };


    deleteTaskConfirmation = async (task) => {
        Alert.alert(
            '', 'האם אתה בטוח שברצונך למחוק משימה זו?',
            [
                { text: 'ביטול', style: { fontSize: WIDTH / 41 } },
                { text: 'מחק', style: { fontSize: WIDTH / 41 }, onPress: () => this.deleteTask(task) },

            ],
            {
                cancelable: false
            }
        );
    }

    deleteTask = async (task) => {
        try {
            //Alert.alert("", "המשימה נמחקה!", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
            //pass over all the tasks and check name task to delete it
            firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                .child(task.taskname)
                .remove();
            firebase
                .database()
                .ref("Tasks")
                .orderByKey()
                .once("child_added", function (snapshot) {
                    firebase
                        .database()
                        .ref("Tasks")
                        .child(snapshot.key).child(firebase.auth().currentUser.uid)
                        .child(task.taskname)
                        .remove();



                });

            this.props.DeleteTask(task);


        } catch (error) {
            console.log(error);
        }
    };

    addTaskImage = (selectedTask) => {
        //function to display the option for the photos(gallery or camera or cancel)
        const options = ["Select from Photos", "Camera", "Cancel"];
        const cancelButtonIndex = 2;
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },

            (buttonIndex) => {
                if (buttonIndex == 0) {
                    //select the library option
                    this.openImageLibrary(selectedTask);
                } else if (buttonIndex == 1) {
                    //select the camera option
                    this.openCamera(selectedTask);
                }
            }
        );
    };

    openImageLibrary = async (task) => {
        const result = await ImageHelpers.openImageLibrary();
        if (result) {
            const downloadUrl = await this.uploadImage(result, task);
            this.props.UpdateTaskImage({ ...task, uri: downloadUrl });
            //ici verifier si la mise a jour se fait pour le meme objet
        }
    };

    openCamera = async (task) => {
        const result = await ImageHelpers.openCamera();
        if (result) {
            const downloadUrl = await this.uploadImage(result, task);
            this.props.UpdateTaskImage({ ...task, uri: downloadUrl });
        }
    };

    uploadImage = async (image, selectedTask) => {
        const taskRef = firebase
            .storage()
            .ref(firebase.auth().currentUser.uid)
            .child("Tasks")
            .child(selectedTask.taskname)
            .child("Image");
        try {
            const blob = await ImageHelpers.prepareBlob(image.uri);
            const snapshot = await taskRef.put(blob);
            let downloadUrl = await taskRef.getDownloadURL();
            await firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                .child(selectedTask.taskname)
                .update({ image: downloadUrl }); //check if the task with this name is already exist
            //image:downloadUrl le champ qu'on ajoute a l'image
            blob.close();
            return downloadUrl;
        } catch (error) {
            console.log(error);
        }
    };

    addTaskVideo = (selectedTask) => {
        const options = ["Select from Videos", "Cancel"];
        const cancelButtonIndex = 2;
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },

            (buttonIndex) => {
                if (buttonIndex == 0) {
                    this.openVideoLibrary(selectedTask);
                }
            }
        );
    };

    openVideoLibrary = async (task) => {
        const result = await ImageHelpers.openImageLibrary();
        this.setState({ showVisibleIndicatorVideo: !this.state.showVisibleIndicatorVideo });
        //console.log("this.state.showVisibleIndicatorVideo = ",this.state.showVisibleIndicatorVideo )

        if (result) {
            const downloadUrl = await this.uploadVideo(result, task);
            this.props.UpdateTaskVideo({ ...task, uri: downloadUrl });
            //ici verifier si la mise a jour se fait pour le meme objet
        }
    };

    uploadVideo = async (video, selectedTask) => {
        const taskRef = firebase
            .storage()
            .ref(firebase.auth().currentUser.uid)
            .child("Tasks")
            .child(selectedTask.taskname)
            .child("Video");
        try {
            const blob = await ImageHelpers.prepareBlob(video.uri);
            const snapshot = await taskRef.put(blob);
            let downloadUrl = await taskRef.getDownloadURL();
            await firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                .child(selectedTask.taskname)
                .update({ video: downloadUrl }); //check if the task with this name is already exist
            blob.close();
            this.setState({ showVisibleIndicatorVideo: !this.state.showVisibleIndicatorVideo });
            console.log("this.state.showVisibleIndicatorVideo2 = ", this.state.showVisibleIndicatorVideo)

            return downloadUrl;

        } catch (error) {
            console.log(error);
        }
    };

    openImageLibrary = async (task) => {
        const result = await ImageHelpers.openImageLibrary();
        if (result) {
            const downloadUrl = await this.uploadImage(result, task);
            this.props.UpdateTaskImage({ ...task, uri: downloadUrl });
            //ici verifier si la mise a jour se fait pour le meme objet
        }
    };

    onLoadStart = () => {
        this.setState({ opacity: 1 });
    }

    onLoad = () => {
        this.setState({ opacity: 0 });
    }

    onBuffer = ({ isBuffering }) => {
        this.setState({ opacity: isBuffering ? 1 : 0 });
    }

    toggleAddTodoModal() {
        this.setState({ addTaskVisible: !this.state.addTaskVisible });
    }

    renderTask = (task) => {
        if (this.state.loading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color={"#5515d4"} />
                </View>
            );
        }



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
                            <TouchableOpacity onPress={() => this.deleteTaskConfirmation(task)}>
                                <Ionicons name="ios-trash" size={WIDTH / 24} color="black" />
                            </TouchableOpacity>
                          
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignContent: 'flex-end', alignSelf: 'flex-end' }}>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate("TodoList", { task })} style={{ flexDirection: 'column', justifyContent: 'center', alignSelf: 'center' }}>
                                <Text style={styles.taskTitle}>{task.taskname}</Text>
                                <Text style={styles.taskTitle}>{task.category}</Text>
                            </TouchableOpacity>




                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>



                                {task.video ? (

                                    <View style={{}}>

                                        <Video
                                            source={{ uri: task.video }}
                                            shouldPlay
                                            repeat={true}
                                            resizeMode={"cover"}
                                            onBuffer={this.onBuffer}
                                            onLoadStart={this.onLoadStart}
                                            onLoad={this.onLoad}
                                            rate={1.0}
                                            indicator={() => (
                                                <AnimatedCircularProgress
                                                    size={HEIGHT / 13}
                                                    width={5}
                                                    fill={100}
                                                    tintColor="black"
                                                    backgroundColor="white"
                                                />

                                            )}
                                            style={{ height: HEIGHT / 13, width: HEIGHT / 13, borderRadius: HEIGHT / 26, borderWidth: 0.3, margin: 5 }}
                                        />
                                        <ActivityIndicator
                                            animating
                                            size="large"
                                            color="black"
                                            style={{ opacity: this.state.opacity, backgroundColor: 'transparent', position: 'absolute', width: '100%', height: '100%' }}
                                        />


                                    </View>




                                ) : (
                                    <TouchableOpacity
                                        style={{
                                            alignItems: "center",
                                            justifyContent: "center",
                                            backgroundColor: "transparent",
                                            margin: 5,
                                            borderRadius: HEIGHT / 26,
                                            borderWidth: 0.3,
                                            height: HEIGHT / 13,
                                            width: HEIGHT / 13,
                                        }}
                                        onPress={() => this.addTaskVideo(task)}
                                    >
                                        <AntDesign
                                            name="upload"
                                            style={{ color: colors.gray, padding: HEIGHT / 180 }}
                                            size={HEIGHT / 30}
                                            color={colors.black}
                                        />
                                        <Text style={{ fontSize: HEIGHT / 120 }}>Upload Video</Text>
                                    </TouchableOpacity>
                                )}


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
                                    <TouchableOpacity
                                        onPress={() => this.addTaskImage(task)}
                                    >
                                        <Image source={addimage} style={styles.imageAdd} />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    </View>


                </View>

            </View>
        )
    }

    render() {
        return (
            

            <CustomBackground>
                <Modal
                    animationType="slide"
                    visible={this.state.addTaskVisible}
                    onRequestClose={() => this.toggleAddTodoModal()}
                >
                    <AddTaskModal
                        closeModal={() => this.toggleAddTodoModal()}
                    />
                </Modal>


                <HeaderActionsNewTask children1={'עריכת '} children2={'משימות '} />
                <View style={{ flex: 2, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        style={styles.addTask}
                        onPress={() => this.toggleAddTodoModal()}
                    >
                        <AntDesign name="plus" size={HEIGHT / 56} color={"#5515d4"} />
                    </TouchableOpacity>
                    <Text style={styles.add}>משימה</Text>
                </View>
                {this.state.showVisibleIndicatorVideo ? (
                                <ActivityIndicator
                                    size="large"
                                    color={"#5515d4"} 

                                />
                            ) : (null)}
                <View style={{ flex: 10 }}>
                    <FlatList
                        data={this.props.tasks.tasks}
                        keyExtractor={(item, index) => index.toString()}
                        showsHorizontalScrollIndicator={false}
                        renderItem={({ item }) => this.renderTask(item)}
                        keyboardShouldPersistTaps="always"
                    />
                </View>


            </CustomBackground>

        )
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
        DeleteTask: (task) => dispatch({ type: "DELETE_TASK", payload: task }),
        UpdateTaskImage: (task) =>
            dispatch({ type: "UPDATE_TASK_IMAGE", payload: task }),
        UpdateTaskVideo: (task) =>
            dispatch({ type: "UPDATE_TASK_VIDEO", payload: task }),

    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(AddTask);





const styles = StyleSheet.create({

    container: {
        alignItems: "center",
        justifyContent: "center",
    },

    addTask: {
        borderWidth: 2,
        height: HEIGHT / 14,
        width: HEIGHT / 14,
        borderColor: Colors.strongViolet,
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    taskContainer: {
        width: WIDTH,
        backgroundColor: '#efe8fd',
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


    add: {
        color: Colors.strongViolet,
        fontWeight: "600",
        fontSize: WIDTH / 28,
        marginTop: 8,
    },
    image: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderColor: colors.black,
        borderWidth: 0,

    },
    imageAdd: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderColor: colors.black,
        borderWidth: 1,

    },

    ImageStyle: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderWidth: 1,
    },



})