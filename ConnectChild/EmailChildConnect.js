import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Modal,
} from "react-native";
import colors from "../Colors";
import ConnectModal from "./ConnectModal";

//components
import RenderListEmail from '../Components/RenderListEmail'

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class EmailChildConnect extends React.Component {
  state = {
    showTaskVisible: false,
  };

  toggleisModal() {
    this.setState({ showTaskVisible: !this.state.showTaskVisible });
  }

  render() {
    const email = this.props.email;
    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showTaskVisible}
          onRequestClose={() => this.toggleisModal()}
        >
          <ConnectModal email={email} closeModal={() => this.toggleisModal()} />
        </Modal>

        <RenderListEmail
          onPress={() => this.toggleisModal()}
          children1={email.name}
          children2={email.childEmail}
        />
      </View>
    );
  }
}

export default EmailChildConnect;

const styles = StyleSheet.create({
  taskContainer: {
    borderRadius: 0,
    alignItems: "center",
    width: WIDTH,
    height: HEIGHT/18,
    flexDirection: "row",
    backgroundColor: '#efe8fd',
    //marginRight:15,
    justifyContent:'flex-end',
    borderWidth: 0.7,
    borderColor: colors.black,
    paddingRight:5
  },


  taskTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.black,
    padding: 3,
  },

});
