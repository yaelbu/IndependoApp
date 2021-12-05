import React from "react";
import {
    Text,
    View,
    ActivityIndicator, SafeAreaView, StyleSheet, Dimensions
} from "react-native";
import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";
import firebase from "firebase";
import { Video } from "expo-av";

import CustomBackground from '../Components/CustomBackground';
import CustomValidationButton from "../Components/CustomValidationButton";

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class VideoChild extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showButtonVisible: false,
            opacity: 0
        };
    }

    componentDidMount = async () => {
    };



    statusPlayback = async (status) => {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        //console.log("task = ", task);



        //to check if we arrived to the end of the
        if (status.didJustFinish) {

            const CountVideoRef = firebase
                .database()
                .ref("Tasks")
                .child(firebase.auth().currentUser.uid).child(task.AssignPerson)
                .child(task.taskname);

            CountVideoRef.once("value").then((snapshot) => {
                CountVideoRef.update({
                    countViewVideo: snapshot.val().countViewVideo + 1,
                });

            })

           /*  const PointEndVideoRef = firebase
                .database()
                .ref("Users")
                .child(firebase.auth().currentUser.uid);

            PointEndVideoRef.once("value").then((snapshot1) => {
                PointEndVideoRef.update({
                    Points: snapshot1.val().Points + 10,
                });

                const points = (snapshot1.val().Points) + 10
                //console.log("points = ", points)
                this.props.updatePoints({ points: points })
            }) */




            this.setState({ showButtonVisible: true });
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

    render() {
        const { navigation } = this.props
        const task = navigation.getParam('task')
        return (
            <CustomBackground>
                <SafeAreaView style={styles.container}>
                    <ActivityIndicator
                        animating
                        size="large"
                        color="black"
                        style={[styles.activityIndicator, { opacity: this.state.opacity }]}
                    />

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

                    <View
                        style={{
                            flex: 1,
                            alignContent: "center",
                            justifyContent: "center"
                        }}
                    >
                        <Video
                            source={{ uri: task.video }}
                            shouldPlay={true}
                            muted={true}
                            repeat={true}
                            //isLooping={true}
                            resizeMode={"cover"}
                            rate={1.0}
                            //useNativeControls
                            ignoreSilentSwitch={"obey"}
                            onPlaybackStatusUpdate={this.statusPlayback}
                            onBuffer={this.onBuffer}
                            onLoadStart={this.onLoadStart}
                            onLoad={this.onLoad}
                            style={styles.video}

                        />
                    </View>

                    {this.state.showButtonVisible && (
                        <CustomValidationButton onPress={() => this.props.navigation.navigate("TodoListChild", { task })}>
                            <Text style={{ fontWeight: "600", color: "white", fontSize: WIDTH / 30 }}>
                                המשך
                            </Text>
                        </CustomValidationButton>
                    )}
                </SafeAreaView>
            </CustomBackground>
        )
    }
}




const mapStateToProps = (state) => {
    return {
        points: state.points
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updatePoints: (Points) =>
            dispatch({ type: "INCREMENT_POINTS", payload: Points }),

    };
};

const wrapper = compose(
    connect(mapStateToProps, mapDispatchToProps),
    connectActionSheet
);

export default wrapper(VideoChild);





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

    activityIndicator: {
        position: 'absolute',
        flex: 1
    },

    video: {
        width: WIDTH,
        height: HEIGHT / 3,
        borderWidth: 0.5,
        borderRadius: 2,

    },

    NoVideo: {
        width: WIDTH,
        height: HEIGHT / 3,
        borderWidth: 2,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: WIDTH / 14,
        fontWeight: "700",
        color: colors.black,
        paddingTop: HEIGHT / 22.5,
        marginRight: WIDTH / 40,
        flexDirection: "row",
    },
});
