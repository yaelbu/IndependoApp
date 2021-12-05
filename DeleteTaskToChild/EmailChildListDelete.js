
import React from "react";
import {StyleSheet,View,Dimensions,Modal} from "react-native";
import colors from "../Colors";

//Components
import TasksListModalDelete from "./TasksListModalDelete";
import RenderListEmail from "../Components/RenderListEmail";

const { width: WIDTH } = Dimensions.get("window");

class EmailChildListDelete extends React.Component {
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
          <TasksListModalDelete
            email={email}
            closeModal={() => this.toggleisModal()}
          />
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


export default EmailChildListDelete;

const styles = StyleSheet.create({
 
  taskTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    padding: 3,
  },

  image: {
    height: 65,
    width: 65,
    borderRadius: 35,
    margin: 4,
    borderColor: colors.black,
    borderWidth: 0.3,
  },
});
