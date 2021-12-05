import React from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,Dimensions
} from "react-native";
import firebase from "firebase/app";
import "firebase/storage";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import EmailChildList from "./EmailChildList";

const { height: HEIGHT } = Dimensions.get("window");

import { snapshotToArray } from "../helpers/firebaseHelpers";
import colors from "../Colors";
require("firebase/auth");


//components
import CustomBackground from "../Components/CustomBackground";
import HeaderActions from "../Components/HeaderActions";
import ListEmail from "../Components/ListEmail";

class AddTaskToChild extends React.Component {
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
    //console.log("emaaaaaaaaaail = ",email);
    return <EmailChildList email={email} />;
  };


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

          <HeaderActions children1={"הוספת "} children2={"משימות לילד "} />



          <View style={{ flex: 9,marginTop:HEIGHT/41  }}>
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

export default wrapper(AddTaskToChild);

const styles = StyleSheet.create({


  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 40,
  },


});
