import React from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import firebase from "@firebase/app";
require("firebase/auth");
require("firebase/database");
import CustomBackground from "../Components/CustomBackground";

export default class LoadingScreen extends React.Component {
  componentDidMount() {
    console.log("usereeer")
    this.checkIfLoggedIn();
  }

  checkIfLoggedIn = async () => {
    this.unsubscribe = firebase.app().auth().onAuthStateChanged((user) => {
      if (user) {
        //if there is a connected user
        const response = firebase.database().ref("Users").child(user.uid);
        if(response){
          response.on("value",(snapshot)=>{
            const status = snapshot.val().status;
            console.log("status =A ",status);
            if (status === "Parent") {
              this.props.navigation.navigate("HomeParent", { user });
            } else if (status === "Teacher") {
              this.props.navigation.navigate("HomeTeacher", { user });
            } else {
              this.props.navigation.navigate("HomeChild", { user });
            }

          })
        }
       
      }
      else {
        //navigate the user the login screen
        this.props.navigation.navigate("WelcomeScreen");
      }
    })
      
  };

  componentWillUnmount = () => {
    this.unsubscribe();
  };

  render() {
    return (
      <CustomBackground>
        <ActivityIndicator size="large" color="black" />
      </CustomBackground>
    );
  }
}

const styles = StyleSheet.create({});
