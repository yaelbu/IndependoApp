
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import EmailChildListDelete from "./EmailChildListDelete";

import { snapshotToArray } from "../helpers/firebaseHelpers";
import colors from "../Colors";

require("firebase/auth");

//components
import HeaderActions from "../Components/HeaderActions";
import CustomBackground from "../Components/CustomBackground";
import ListEmail from "../Components/ListEmail";

const { height: HEIGHT } = Dimensions.get("window");

const { width: WIDTH } = Dimensions.get("window");

class DeleteTaskToChild extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      addTaskVisible: false,
      //currentUser:{},
    };
  }

  componentDidMount = async () => {
    const emails = await firebase
      .database()
      .ref("AdultList")
      .child(firebase.auth().currentUser.uid)
      .once("value"); //check if the task with this name is already exist
    const emailArray = snapshotToArray(emails);
    this.props.loadEmails(emailArray);
  };

  renderEmail = (email) => {
    return <EmailChildListDelete email={email} />;
  };

  toggleAddTodoModal() {
    this.setState({ addTaskVisible: !this.state.addTaskVisible });
  }

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={colors.blueLogo} />
        </View>
      );
    }

    return (


      <CustomBackground>
          <HeaderActions children1={'מחיקת '} children2={'משימות לילד '} />

          <View style={{ flex: 9,marginTop:HEIGHT/41 }}>
          <ListEmail
            data={this.props.emails.emails}
            renderItem={({ item }, index) => this.renderEmail(item, index)}
            keyExtractor={(item, index) => index.toString()}
            children={"לא קיימים ילדים שקשורים אליך"}

          />
        </View>
      </CustomBackground>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    emails: state.emails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadEmails: (emails) =>
      dispatch({ type: "LOAD_EMAILS_FROM_SERVER", payload: emails }),
  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(DeleteTaskToChild);

const styles = StyleSheet.create({
  text: {
    width: WIDTH - 140,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },

  divider: {
    backgroundColor: colors.blueLogo,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },

  title: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.black,
    paddingHorizontal: 20,
  },

  add: {
    color: colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },

  addTask: {
    borderWidth: 2,
    borderColor: colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 40,
  },

});
