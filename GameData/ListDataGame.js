
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import firebase from "firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import colors from "../Colors";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import CustomBackground from "../Components/CustomBackground";
import "firebase/storage";
import { VictoryChart, VictoryGroup, VictoryBar, VictoryAxis } from 'victory-native';

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class ListDataGame extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      DataGameArr: []
    };
  }

  componentDidMount = async () => {

    const email = this.props.email;
    const currentUserData = await firebase
      .database()
      .ref("Users")
      .child(firebase.auth().currentUser.uid)
      .once("value");
    this.setState({ currentUser: currentUserData.val() });
    const data = await firebase
      .database()
      .ref("GamesData")
      .child(email.key)
      .orderByChild("PlayDate")
      .once("value"); //check if the task with this name is already exist
    //check if the task with this name is already exist
    const dataArray = snapshotToArray(data);
    this.props.loadDataGame(dataArray.reverse());

    const arrData = new Array();
    firebase.database().ref("GamesData").child(email.key).on("value", function (snapshot1) {
      snapshot1.forEach((childSnapshot) => {
        arrData.push({ x: childSnapshot.val().PlayDate, y: childSnapshot.val().countPlay })
      })

    })

    this.setState({ DataGameArr: arrData })

  };

  renderData = (item, index) => {
    return (
      <View
        style={styles.taskContainer}>
        <Text style={styles.taskTitle}>{item.PlayDate} - {item.countPlay} פעמיים</Text>

      </View>
    );
  };

  render() {
    
    return (
      <CustomBackground>
        <SafeAreaView style={styles.container}>
          <TouchableOpacity
            style={{ position: "absolute", top: HEIGHT / 17.2, left: WIDTH / 13.8, zIndex: 10 }}
            onPress={this.props.closeModal}
          >
            <AntDesign name="close" size={WIDTH / 17.2} color={colors.black} />
          </TouchableOpacity>




          <View style={[styles.section, { flex: 1, marginVertical: 0, backgroundColor: 'transparent', }]}>
            <View style={{ justifyContent: 'flex-end', alignSelf: "flex-end", marginRight: WIDTH / 16.5, marginTop: HEIGHT / 36, marginBottom: HEIGHT / 90 }}>
              <Text style={{ fontSize: WIDTH / 14, fontStyle: 'italic', fontWeight: '500', textDecorationLine: 'underline' }}>משחק זכרון :</Text>
            </View>

           {/*  <View style={{ backgroundColor: 'transparent', flex: 2, justifyContent: 'center', alignItems: 'center' }}>
              <View style={{ flex: 1, borderWidth: 2 }}>
                <VictoryChart width={WIDTH - 60} height={HEIGHT / 2.5} style={{ fontSize: 10 }}>
                  <VictoryGroup style={{ background: { fill: "yellow" } }}>
                    <VictoryBar data={this.state.DataGameArr} style={{ data: { fill: "#7e40f0", width: 10 } }} />
                  </VictoryGroup>
                </VictoryChart>
              </View>
            </View> */}

            <View style={{ marginTop: HEIGHT / 60, backgroundColor: 'transparent', flex: 2 }}>
              <FlatList
                data={this.props.dataGame.dataGame}
                renderItem={({ item, index }) => this.renderData(item, index)}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                  >
                    <Text style={{ fontSize: WIDTH / 21, fontWeight: "bold" }}>
                      לא קיים מידע אודות המשחק                    </Text>
                  </View>
                }
                keyboardShouldPersistTaps="always"
              />
            </View>
          </View>
        </SafeAreaView>
      </CustomBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    tasks: state.tasks,
    dataGame: state.dataGame,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadDataGame: (dataGame) =>
      dispatch({ type: "LOAD_DATA_GAME_FROM_SERVER", payload: dataGame }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(ListDataGame);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskContainer: {
    borderRadius: 0,
    alignItems: 'center',
    width: WIDTH,
    height: HEIGHT / 16,
    flexDirection: "row",
    borderWidth: 2,
    backgroundColor: "#efe8fd",
    borderRadius: 0,
    borderWidth: 0.5,
    borderColor: colors.black,
    justifyContent:'flex-end',
    paddingRight:30

  },


  section: {
    alignSelf: "stretch",
    marginTop: HEIGHT / 35,
  },

  taskTitle: {
    fontSize: WIDTH / 23,
    fontWeight: "600",
    color: colors.black,
    padding: 3,
    paddingLeft: 20,
    fontFamily: Platform.OS === "ios" ? "Gill Sans" : "",
  },

  image: {
    height: 80,
    width: 80,
    borderRadius: 39,
    borderColor: colors.black,
    borderWidth: 0.3,
  },

  title: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.black,
    paddingTop: 40,
    marginLeft: 30,
  },

  todo: {
    color: colors.black,
    fontWeight: "700",
    fontSize: 16,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: colors.red,
    justifyContent: "center",
    alignItems: "center",
    width: 80,
  },
});
