/* console.disableYellowBox = true;
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
 */
import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Dimensions,
  Image,
  Text,
} from "react-native";
import CustomBackground from "../Components/CustomBackground";
import NetworkImage from "react-native-image-progress";
import firebase from "firebase/app";

import crocodile from '../Images/croco.jpg';
import treasure from "../Images/treasure.png";
import white from '../Images/white.png';
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { snapshotToArray2 } from "../helpers/firebaseHelpers2";
import independo from "../Images/Independo.png";

import colors from "../Colors";
import { ImageBackground } from "react-native";
require("firebase/auth");


const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class HomeChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount = async () => {


    const pointsRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).orderByChild("Points").once('value', (snapshot) => {
      const points = snapshot.val().Points
      this.props.loadPoints(points)
    });



    const tasks = await firebase
      .database()
      .ref("Tasks")
      .child(firebase.auth().currentUser.uid)
      .once("value"); //check if the task with this name is already exist
    const taskArray = snapshotToArray2(tasks);
    this.props.loadTasks(taskArray);

  };

  renderItem = (item, index) => {
    return (
      <View style={styles.listItemContainer}>
        <View style={styles.imageContainer}>
          <View style={{ justifyContent: 'center', alignContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
            {item.image ? ( <NetworkImage
              source={{ uri: item.image }}
              style={styles.image}
              imageStyle={styles.ImageStyle}
            />):(
              <Image source={white} style={styles.image} />
            )}
           

          </View>
          <Text style={{ fontSize: WIDTH / 32, alignSelf: 'center',paddingBottom:HEIGHT/60 }}>{item.taskname}</Text>
        </View>

      </View>
    );
  };

  render() {
    return (
      <CustomBackground>
        <View style={{ flex: 1, backgroundColor: 'transparent', marginTop: 30 }}>
          <View style={{ flex: 1.2, backgroundColor: 'transparent' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                <Image source={independo} style={styles.logo} />
              </View>
              <View style={{ flex: 3, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'flex-end', marginRight: WIDTH / 40 }}>
                <ImageBackground source={treasure} style={styles.treasure} imageStyle={{ borderRadius: HEIGHT / 10.8 }}>
                  <Text style={styles.score}>{this.props.points.points}</Text>
                </ImageBackground>
              </View>
            </View>
          </View>
          <View style={{ flex: 4, backgroundColor: 'transparent' }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 1, backgroundColor: 'transparent' }}>
                <View style={styles.containerTask}>
                  <View style={{ flex: 2, backgroundColor: 'transparent', alignContent: 'center', alignSelf: 'center', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: WIDTH / 17, textAlign: 'center' }}>המשימות שלי :</Text>
                  </View>
                  <View style={{ flex: 10,borderColor: 'transparent', justifyContent: 'center', alignItems: 'stretch', alignContent: 'center', alignSelf: 'center', paddingVertical: 5, marginHorizontal: WIDTH / 83, display: 'flex' }}>
                    <FlatList
                      data={this.props.tasks.tasks}
                      horizontal={false}
                      renderItem={({ item }, index) => this.renderItem(item, index)}
                      keyExtractor={(item, index) => index.toString()}
                      ListEmptyComponent={
                        <View
                          style={{ justifyContent: "center", alignItems: "center" }}
                        >
                          <Text style={{ fontSize: WIDTH / 21, fontWeight: "bold" }}>
                            אין משימות
                          </Text>
                        </View>
                      }
                    />
                  </View>
                </View>
              </View>
              <View style={{ flex: 2, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={crocodile} style={{ height: HEIGHT / 1.5, width: WIDTH / 1.45 }} />
              </View>
            </View>
          </View>
        </View>
      </CustomBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    points: state.points
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadTasks: (tasks) =>
      dispatch({ type: "LOAD_TASKS_FROM_SERVER", payload: tasks }),
    loadPoints: (points) =>
      dispatch({ type: "LOAD_POINTS", payload: points }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(HomeChild);

const styles = StyleSheet.create({
  containerTask: {
    flex: 1,
    borderColor: colors.black,
    borderRadius: 35,
    borderWidth: 5,
    margin: WIDTH/41,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: 'column',
  },

  logoContainer: {
    marginTop: 30,
    flexDirection: "row",
  },
  
  listItemContainer: {

    justifyContent: 'center',
    alignItems: 'stretch',
    display: 'flex',

  },
  logo: {
    width: HEIGHT / 3.6,
    height: HEIGHT / 3.6,
    marginLeft: WIDTH / 8.3,
    marginTop: HEIGHT / 11.2,
 },

  treasure: {
    width: HEIGHT / 5.4,
    height: HEIGHT / 5.4,
    borderWidth: 0.5,
    borderRadius: HEIGHT / 10.8,
    borderColor: "#2780B3",
    justifyContent: 'center',
  },
  score: {
    alignItems: 'center',
    marginTop: HEIGHT / 7.5,
    fontSize: WIDTH / 14.8,
    fontWeight: 'bold'
  },

  image: {

    height: HEIGHT / 11,
    width: HEIGHT / 11,
    borderRadius: HEIGHT / 25,
    borderColor: "black",
  },
  ImageStyle: {
    borderWidth: 1,
    height: HEIGHT / 11,
    width: HEIGHT / 11,
    borderRadius: HEIGHT / 21,

  },

  imageContainer: {
    justifyContent: 'center',
    display: 'flex',
    alignItems: 'stretch',
    //backgroundColor: "green",
  },
});
