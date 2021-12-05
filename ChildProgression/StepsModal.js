import React from "react";


import { View, StyleSheet, Dimensions, Text,SafeAreaView,ScrollView, FlatList, Image, TouchableOpacity } from "react-native";
import white from "../Images/white.png";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";

import firebase from "firebase/app";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";

import CustomBackground from "../Components/CustomBackground";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");


class StepsModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }


    componentDidMount = async () => {
        const email = this.props.email;
        const taskChildren = this.props.taskChildren;
        console.log("aaaaaaaaaa email.key ", email.key)
        console.log("aaaaaaaaaa taskChildren.AssignPerson ", taskChildren.AssignPerson)
        const steps = await firebase
            .database()
            .ref("Tasks")
            .child(email.key).child(taskChildren.AssignPerson)
            .child(this.props.taskChildren.taskname)
            .child("Steps")
            .once("value"); //check if the task with this name is already exist
        const stepArray = snapshotToArray(steps);
        this.props.loadSteps(stepArray);
    };


    renderTodo = (step, index) => {
        return (
            <ScrollView>

          
            <View style={styles.todoContainer}>
                <Text
                    style={[
                        styles.todo,
                        {
                            textDecorationLine: step.completed ? "line-through" : "none",
                            color: step.completed ? colors.gray : colors.black,
                            marginRight: WIDTH/15,
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
                                size={HEIGHT / 18}
                                width={4}
                                fill={100}
                                tintColor="black"
                                backgroundColor="white"
                            />
                        )}
                    />
                ) : (
                    <Image source={white} style={styles.imageStep} />
                )}

                <Ionicons
                    name={step.status ? "checkbox-outline" : "ios-square-outline"}
                    size={24}
                    color={colors.black}
                    style={{ width: WIDTH/13, marginLeft: WIDTH/21, marginRight: 10 }}
                />
            </View>
            </ScrollView>
        );
    };




    render() {
        const taskChildren = this.props.taskChildren;
        const email = this.props.email;
        console.log("HEIGHT = ",HEIGHT)
        return (


<CustomBackground>
          <SafeAreaView style={styles.container}>
          <TouchableOpacity
                    style={{ position: "absolute", top: HEIGHT / 17.2, left: WIDTH / 13.8, zIndex: 10 }}
                    onPress={this.props.closeModal}
                >
                    <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
                </TouchableOpacity>
                <View
                    style={[
                        styles.section,
                        styles.header,
                        { borderBottomColor: "black", flexDirection: "row" },
                    ]}
                >

              <View style={{ flexDirection: 'column' }}>
                <Text style={styles.title}>{taskChildren.taskname}</Text>
              </View>


              <NetworkImage
                source={{ uri: taskChildren.image }}
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
            <View style={[styles.section, { flex: 3,marginTop:HEIGHT/31, marginBottom: HEIGHT/76 }]}>

              <FlatList
                data={this.props.steps.steps}
                renderItem={({ item, index }) => this.renderTodo(item, index)}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
              />

<View style={{ paddingBottom: 120, alignSelf: 'flex-end', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>


<Text style={styles.count}> מספר הפעמים שהילד נכנס למשימה :    {taskChildren.countEnterTask}</Text>
<Text style={styles.count}> מספר הפעמים שהילד ראה את הסרטון :    {taskChildren.countViewVideo}</Text>
<Text style={styles.count}> מספר הפעמים שהילד ביצע את המשימה :    {taskChildren.countTaskDone}</Text>

</View>


            
            </View>
          </SafeAreaView>
</CustomBackground>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        tasks: state.tasks,
        steps: state.steps,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        loadSteps: (steps) =>
            dispatch({ type: "LOAD_STEPS_FROM_SERVER", payload: steps }),
    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(StepsModal);


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

    imageWhite: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderColor: colors.black,
        borderWidth: 1,
        margin: 5,

    },

    todo:{
        fontSize:WIDTH/30
    },


    image: {
        height: HEIGHT / 8,
        width: HEIGHT / 8,
        borderRadius: HEIGHT / 16,
        justifyContent: 'space-around',
        alignSelf: 'flex-start',
        alignContent: 'space-around',
        marginRight: WIDTH / 18,
        marginBottom: HEIGHT / 90
    },
    ImageStyle: {
        height: HEIGHT / 8,
        width: HEIGHT / 8,
        borderRadius: HEIGHT / 16,
        borderWidth: 1,
    },



    imageStep: {
        height: HEIGHT / 18,
        width: HEIGHT / 18,
        marginRight: WIDTH / 12,
        borderColor: colors.black,
        borderWidth: 1,
        backgroundColor: colors.white,
    },
    ImageStyleStep: {
        height: HEIGHT / 18,
        width: HEIGHT / 18,
        marginRight: WIDTH / 12,
        borderWidth: 1,
    },


    title: {
        fontSize: WIDTH / 14,
        fontWeight: "700",
        color: colors.black,
        paddingTop: HEIGHT / 22.5,
        marginRight: WIDTH / 40,
        flexDirection: "row",
      },

    count: {
        fontSize: WIDTH/28,
        fontWeight: "700",
        color: colors.black,
        paddingTop: 10,
        marginRight: 30,
        flexDirection: "row",
    },

    todoContainer: {
        paddingVertical: HEIGHT/90,
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-end",

      },
});
