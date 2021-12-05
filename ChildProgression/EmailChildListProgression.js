import React from "react";
import {
  StyleSheet,
  View,
  Modal,
} from "react-native";
import colors from "../Colors";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";

//components
import RenderListEmail from '../Components/RenderListEmail'
import TasksModal from "./TasksModal";


class EmailChildListProgression extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTasksVisible: false,
    };
  }

  toggleisModalTasks() {
    //console.log("toggleisModal")
    this.setState({ showTasksVisible: !this.state.showTasksVisible });
  }

  render() {
    const email = this.props.email;
    return (
      <View>
        <Modal
          animationType="slide"
          visible={this.state.showTasksVisible}
          onRequestClose={() => this.toggleisModalTasks()}
        >
          <TasksModal
            email={email}
            closeModal={() => this.toggleisModalTasks()}
          /> 
        </Modal>

        <RenderListEmail
          onPress={() => this.toggleisModalTasks()}
          children1={email.name}
          children2={email.childEmail}
        />
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

export default wrapper(EmailChildListProgression);

const styles = StyleSheet.create({

  image: {
    height: 65,
    width: 65,
    borderRadius: 35,
    margin: 4,
    borderColor: colors.black,
    borderWidth: 0.3,
  },
});
