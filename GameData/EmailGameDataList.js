
import React from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  Modal,
} from "react-native";
import ListDataGame from "./ListDataGame";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import { connect } from "react-redux";
import { compose } from "redux";

//components
import RenderListEmail from '../Components/RenderListEmail';

const { width: WIDTH } = Dimensions.get("window");

class EmailGameDataList extends React.Component {
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
          <ListDataGame
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

export default wrapper(EmailGameDataList);

const styles = StyleSheet.create({

});
