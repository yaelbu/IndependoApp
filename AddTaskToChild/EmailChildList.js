import React from "react";
import {View, Modal } from "react-native";
import TasksListModal from "./TasksListModal";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";

//component
import RenderListEmail from '../Components/RenderListEmail'


class EmailChildList extends React.Component {
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
          <TasksListModal
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

export default wrapper(EmailChildList);

