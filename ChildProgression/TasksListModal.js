
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableOpacity,Dimensions
} from "react-native";
import colors from "../Colors";
import StepsModal from "./StepsModal";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";

import NetworkImage from "react-native-image-progress";
import { AnimatedCircularProgress } from "react-native-circular-progress";

//components
const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");




class TasksListModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStepsVisible: false,
    };
  }

  toggleisModalSteps() {
    console.log("toggleisModal")
    this.setState({ showStepsVisible: !this.state.showStepsVisible });
  }

  render() {
    const taskChildren = this.props.task;
    const email = this.props.email;
    console.log("Task TasksListModal = ",taskChildren);
    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showStepsVisible}
          onRequestClose={() => this.toggleisModalSteps()}
        >
           <StepsModal
            email={email} taskChildren={taskChildren}
            closeModal={() => this.toggleisModalSteps()}
          />  
        </Modal>

        <View
          style={styles.taskContainer}
        >
          <View
            style={{
              width: WIDTH - 20,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: 'flex-end'
            }}
          >


            <TouchableOpacity onPress={() => this.toggleisModalSteps()}>
              <View style={{ flexDirection: 'row',justifyContent:'center',alignItems:'center' }}>
                <View style={{ alignSelf: 'center' }}>
                  <Text style={styles.taskTitle}>{taskChildren.taskname}</Text>
                  <Text style={styles.taskTitle}>{taskChildren.category}</Text>
                </View>
                <View>
                  

                {taskChildren.image ? (
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
                ) : (
                  <Image source={white} style={styles.imageWhite} />

                )}
              
                </View>


              </View>
            </TouchableOpacity>

          </View>

        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    emails: state.emails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(TasksListModal);

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      taskContainer: {
        width: WIDTH,
        backgroundColor: '#efe8fd',
        borderWidth: 1,
        alignContent:'center',
        justifyContent:'center'
      },
    
    
      section: {
        alignSelf: "stretch",
        marginTop: HEIGHT / 30,
      },
    
      taskTitle: {
        fontSize: WIDTH / 22,
        fontWeight: "600",
        color: colors.black,
        paddingVertical: HEIGHT / 224,
        marginRight: 20,
        textAlign: 'right'
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
    
      ImageStyle: {
        height: HEIGHT / 13,
        width: HEIGHT / 13,
        borderRadius: HEIGHT / 26,
        borderWidth: 1,
      },
    
    
});
