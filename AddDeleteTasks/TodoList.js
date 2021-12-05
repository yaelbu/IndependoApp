import React from "react";
import { View, StyleSheet, TextInput, SafeAreaView, KeyboardAvoidingView, Dimensions, Text, Image, TouchableOpacity, FlatList, Alert, Keyboard } from 'react-native';
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { compose } from "redux";
import { connect } from "react-redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import firebase from "firebase/app";
import * as ImageHelpers from "../helpers/ImageHelpers";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";

//images
import white from '../Images/white.png';
import addImage from '../Images/addimage.png';
import CustomBackground from "../Components/CustomBackground";


const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newStep: "",
        };

    }

    componentDidMount = async () => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        console.log("task todolist - check countAssign= ", task);
        const steps = await firebase
            .database()
            .ref("Tasks")
            .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
            .child(task.taskname)
            .child("Steps")
            .orderByChild("dateAdd")
            .once("value"); //check if the task with this name is already exist
        //console.log("steps = ", steps);

        const stepArray = snapshotToArray(steps);
        //console.log("stepArray.lenght = ", stepArray.length)
        this.props.loadSteps(stepArray.reverse());
    };

    
  deleteToDoConfirmation = async (step) => {
    Alert.alert(
      '', 'האם אתה בטוח שברצונך למחוק משימה זו?',
      [
        { text: 'ביטול', style: { fontSize: WIDTH / 41 } },
        { text: 'מחק', style: { fontSize: WIDTH / 41 }, onPress: () => this.deleteTodo(step) },

      ],
      {
        cancelable: false
      }
    );
  }


  deleteTodo = (step, index) => {
    const { navigation } = this.props
    const task = navigation.getParam('task')
    try {
      firebase
        .database()
        .ref("Tasks")
        .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
        .child(task.taskname)
        .child("Steps")
        .child(step.title)
        .remove();
      this.props.deleteStep(step); //add new step to the store (Redux)
      Alert.alert("", "השלב נמחק", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
    } catch (error) {
      console.log(error);
    }
  };


    addStepImage = (step) => {
        const options = ["Select from Photos", "Camera", "Cancel"];
        const cancelButtonIndex = 2;
        this.props.showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            (buttonIndex) => {
                if (buttonIndex == 0) {
                    this.openImageLibrary(step);
                } else if (buttonIndex == 1) {
                    this.openCamera(step);
                }
            }
        );
    };


    openImageLibrary = async (step) => {
        const result = await ImageHelpers.openImageLibrary();
        if (result) {
            //this.props.toggleIsLoadingTasks(true);
            const downloadUrl = await this.uploadImage(result, step);
            //this.props.toggleIsLoadingTasks(false);
            this.props.updateStepImage({ ...step, uri: downloadUrl });
            //ici verifier si la mise a jour se fait pour le meme objet
        }
    };

    openCamera = async (step) => {
        const result = await ImageHelpers.openCamera();
        if (result) {
            const downloadUrl = await this.uploadImage(result, step);
            this.props.updateStepImage({ ...step, uri: downloadUrl });
        }
    };

    uploadImage = async (image, selectedStep) => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        const taskRef = firebase
            .storage()
            .ref(firebase.auth().currentUser.uid)
            .child("Tasks")
            .child(task.taskname)
            .child("Steps")
            .child(selectedStep.title);
        try {
            const blob = await ImageHelpers.prepareBlob(image.uri);
            const snapshot = await taskRef.put(blob);
            let downloadUrl = await taskRef.getDownloadURL();
            await firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                .child(task.taskname)
                .child("Steps")
                .child(selectedStep.title)
                .update({ image: downloadUrl }); //check if the task with this name is already exist

            blob.close();
            return downloadUrl;
        } catch (error) {
            console.log(error);
        }
    };


    addTodo = () => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        //console.log("test");
        var today = new Date();
        var date;
        const hours = today.getHours();
        const minutes = today.getMinutes();
        const seconds = today.getSeconds();
        if (hours >= 0 && hours <= 9 && minutes >= 0 && minutes <= 9 && seconds >= 0 && seconds <= 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + "0" + minutes + ":" + "0" + seconds;
            console.log("date1 = ", date)
        }
        if (hours >= 0 && hours <= 9 && minutes >= 0 && minutes <= 9 && seconds > 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + "0" + minutes + ":" + seconds;
            console.log("date2 = ", date)
        }
        if (hours >= 0 && hours <= 9 && minutes > 9 && seconds >= 0 && seconds <= 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + minutes + ":" + "0" + seconds;
            console.log("date3 = ", date)
        }
        if (hours > 9 && minutes >= 0 && minutes <= 9 && seconds >= 0 && seconds <= 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + "0" + minutes + ":" + "0" + seconds;
            console.log("date4 = ", date)
        }
        if (hours >= 0 && hours <= 9 && minutes > 9 && seconds > 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + minutes + ":" + seconds;
            console.log("date5 = ", date)
        }
        if (hours > 9 && minutes >= 0 && minutes <= 9 && seconds > 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + "0" + minutes + ":" + seconds;
            console.log("date6 = ", date)
        }
        if (hours > 9 && minutes > 9 && seconds >= 0 && seconds <= 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + minutes + ":" + "0" + seconds;
            console.log("date7 = ", date)
        }
        if (hours > 9 && minutes > 9 && seconds > 9) {
            date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + minutes + ":" + seconds;
            console.log("date8 = ", date)
        }
        //let task = this.props.task;
        const NewStepp = this.state.newStep;//'this.state.newStep'
        if (NewStepp !== "") {
            try {

                firebase
                    .database()
                    .ref("Tasks")
                    .child(firebase.auth().currentUser.uid).child(firebase.auth().currentUser.uid)
                    .child(task.taskname)
                    .child("Steps")
                    .child(NewStepp)
                    .update({ title: NewStepp, status: false, dateAdd: date });
                this.setState({ newStep: "" });//to reinitialize the newStep field
                //Alert.alert("", "השלב הוסף", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]
                //);
                console.log("NewStep = ",NewStepp);
                const step = {
                    title: NewStepp,
                    status: false,
                    dateAdd: date
                 }
                this.props.addStep(step); //add new step to the store (Redux)
            } catch (error) {
                console.log("error =", error);
            }
        } else {
            Alert.alert("", "השדה הוא שדה חובה", [{ text: "אוקיי", style: { fontSize: WIDTH / 41 } }]);
        }


    };




    renderTodo = (step, index) => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        //console.log("task.countAssign = ",task.CountAssign)
        return (
            <View style={{ backgroundColor: 'transparent', flexDirection: 'row' }}>
                 <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.deleteToDoConfirmation(step, index)}>
                        <Ionicons name="ios-trash" size={WIDTH / 20} color="black" />
                    </TouchableOpacity>
                </View> 
                <View style={styles.todoContainer}>
                    <Text style={{ color: "black", marginRight: 30, fontSize: WIDTH / 25 }}>
                        {step.title}
                    </Text>
                    {task.CountAssign > 0 ? (<TouchableOpacity onPress={() => this.addStepImage(step)} disabled>
                        {step.image ? (
                            <NetworkImage
                                source={{ uri: step.image }}
                                style={styles.imageStep}
                                indicator={() => (
                                    <AnimatedCircularProgress
                                        size={HEIGHT / 20}
                                        width={5}
                                        fill={100}
                                        tintColor="black"
                                        backgroundColor="white"
                                    />
                                )}
                                imageStyle={{ height: HEIGHT / 20, width: HEIGHT / 20, borderRadius: HEIGHT / 40, margin: 0, paddingRight: 0, backgroundColor: 'transparent' }}
                            />
                        ) : (
                            <Image source={white} style={styles.imageStep} />
                        )}
                    </TouchableOpacity>
                    ) : (
                        <TouchableOpacity onPress={() => this.addStepImage(step)}>
                            {step.image ? (
                                <NetworkImage
                                    source={{ uri: step.image }}
                                    style={styles.imageStep}
                                    indicator={() => (
                                        <AnimatedCircularProgress
                                            size={HEIGHT / 20}
                                            width={5}
                                            fill={100}
                                            tintColor="black"
                                            backgroundColor="white"
                                        />
                                    )}
                                    imageStyle={{ height: HEIGHT / 20, width: HEIGHT / 20, margin: 0, paddingRight: 0, backgroundColor: 'transparent' }}
                                />
                            ) : (
                                <Image source={addImage} style={styles.imageStep} />
                            )}
                        </TouchableOpacity>)}

                </View>
            </View>
        )
    }

    render() {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        return (
            <CustomBackground>
                <KeyboardAvoidingView style={{ flex: 1 }} behavior={(Platform.OS === 'ios') ? "padding" : null}>
                    <SafeAreaView style={styles.container}>
                        
                        <View
                            style={[
                                styles.section,
                                styles.header,
                                { borderBottomColor: "black", flexDirection: "row" },
                            ]}
                        >
                            <View>
                                <Text style={[styles.title, { textAlign: 'right' }]}>{task.taskname}</Text>

                            </View>

                            {task.image ? (
                                <NetworkImage
                                    source={{ uri: task.image }}
                                    style={styles.image}
                                    imageStyle={styles.ImageStyle}
                                    indicator={() => (
                                        <AnimatedCircularProgress
                                            size={HEIGHT / 11}
                                            width={5}
                                            fill={100}
                                            tintColor="black"
                                            backgroundColor="white"
                                        />
                                    )}
                                />
                            ) : (
                                <Image source={white} style={styles.image} />
                            )}

                        </View>

                        <View style={[styles.section, { flex: 3, marginVertical: 16 }]}>
                            <FlatList
                                data={this.props.steps.steps}
                                renderItem={({ item, index }) => this.renderTodo(item, index)}
                                keyExtractor={(item, index) => index.toString()}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ flexDirection: 'column-reverse' }}
                            />
                        </View>
                        {task.CountAssign > 0 ? (<View>
                            <Text style={{ fontSize: WIDTH / 25, color: 'red', fontWeight: '600' }}>לא ניתן לשנות משימה שכבר מקושרת לילד</Text>
                        </View>
                        ) : (null)}



                        {task.CountAssign > 0 ? (
                            <View style={[styles.section, styles.footer]}>
                                <TextInput
                                    style={[styles.input, { borderColor: "black" }]}
                                    onChangeText={(text) => this.setState({ newStep: text })}
                                    value={this.state.newStep}
                                    editable={false}
                                />
                                <TouchableOpacity
                                    style={[styles.addTodo, { backgroundColor: "black" }]}
                                    onPress={() => this.addTodo()} disabled
                                >
                                    <AntDesign name="plus" size={16} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <View style={[styles.section, styles.footer]}>
                                <TextInput
                                    style={[styles.input, { borderColor: "black" }]}
                                    onChangeText={(text) => this.setState({ newStep: text })}
                                    value={this.state.newStep}
                                    onSubmitEditing={Keyboard.dismiss}


                                />
                                <TouchableOpacity
                                    style={[styles.addTodo, { backgroundColor: "black" }]}
                                    onPress={() => this.addTodo()}
                                >
                                    <AntDesign name="plus" size={16} color={colors.white} />
                                </TouchableOpacity>
                            </View>
                        )}

                    </SafeAreaView>
                </KeyboardAvoidingView>
            </CustomBackground>
        )
    }

}




const mapStateToProps = (state) => {
    return {
        steps: state.steps,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        addStep: (step) => dispatch({ type: "ADD_STEP", payload: step }),
        loadSteps: (steps) =>
            dispatch({ type: "LOAD_STEPS_FROM_SERVER", payload: steps }),
        updateStepImage: (step) =>
            dispatch({ type: "UPDATE_STEP_IMAGE", payload: step }),
        deleteStep: (step) => dispatch({ type: "DELETE_STEP", payload: step }),
    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(TodoList);


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

    footer: {
        paddingHorizontal: WIDTH / 13,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: HEIGHT / 50,
    },

    input: {
        flex: 1,
        height: HEIGHT / 19,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 6,
        fontSize: WIDTH / 25,
        marginRight: WIDTH / 52,
        paddingHorizontal: HEIGHT / 112,
    },

    addTodo: {
        borderRadius: 4,
        padding: 16,
        alignItems: "center",
        justifyContent: "center",
    },

    imageStep: {
        height: HEIGHT / 20,
        width: HEIGHT / 20,
        marginRight: WIDTH / 12,
        borderColor: colors.black,
        borderWidth: 0.3,
        backgroundColor: colors.white,
    },

    todoContainer: {
        paddingVertical: HEIGHT / 150,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: WIDTH / 10,
        alignSelf: "flex-end",
        justifyContent: 'flex-end',
        flex: 3
    },

    title: {
        fontSize: WIDTH / 14,
        fontWeight: "700",
        color: colors.black,
        paddingTop: HEIGHT / 22.5,
        marginRight: WIDTH / 40,
        flexDirection: "row",
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
})