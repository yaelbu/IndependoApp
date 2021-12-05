
import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert
} from "react-native";
import firebase from "@firebase/app";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import { connect } from "react-redux";
import colors from "../Colors";
import { Ionicons } from "@expo/vector-icons";

require("firebase/database");
require("firebase/auth");

import CustomBackground from "../Components/CustomBackground";
import HeaderActions from "../Components/HeaderActions";
import ListEmail from '../Components/ListEmail';

const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");

class DisconnectChild extends React.Component {
  constructor() {
    super();
    this.state = {
      emails: [],
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


  deleteEmailConfirmation = async (item) => {
    console.log("selectedEmail = ", item)
    Alert.alert(
      '', 'האם אתה בטוח שברצונך להתנתק מהילד זו?',
      [
        { text: 'ביטול', style: { fontSize: WIDTH / 41 } },
        { text: 'ניתוק', style: { fontSize: WIDTH / 41 }, onPress: () => this.deleteEmail(item) },

      ],
      {
        cancelable: false
      }
    );
  }




  deleteEmail = async (selectedEmail, index) => {
    if (selectedEmail !== null) {
      const currUser = firebase.auth().currentUser.uid;

      /*   firebase
          .database()
          .ref("AdultList")
          .child(currUser)
          .child(selectedEmail.key)
          .remove();
  
        firebase.database().ref("Tasks").child(selectedEmail.key).child(currUser).remove();
        firebase.database().ref("Feedback").child(currUser).child(selectedEmail.key).remove();
   */

      const response = await firebase
        .database()
        .ref("Users")
        .child(selectedEmail.key);
      if (response) {
        response.on("value", async (snapshot) => {
          if (snapshot.val().creatorParent === currUser) //Parent is connected (cannot disconnect form child)
          {
            const test = await firebase.database().ref("Users").child(selectedEmail.key).once("value");
            const valueAdult = test.val();
            console.log("valueAdult = ", valueAdult)
          }
          else if (snapshot.val().creatorTeacher === currUser) {
            const test = await firebase.database().ref("Users").child(selectedEmail.key).once("value");
            const valueParent = test.val().creatorParent;
            console.log("test.val() = ", test.val())
            console.log("valueParent = ", valueParent)

            if (valueParent !== "") {
              firebase.database().ref("Users").child(selectedEmail.key).update({ creatorTeacher: "" });
              firebase.database().ref("Tasks").child(selectedEmail.key).child(firebase.auth().currentUser.uid).remove();
              firebase.database().ref("AdultList").child(firebase.auth().currentUser.uid).child(selectedEmail.key).remove();
              
              
              const UpdateFeedback = await firebase.database().ref("Feedback").child(firebase.auth().currentUser.uid).child(selectedEmail.key).once("value");
              const updatefeed=UpdateFeedback.val();
              console.log("updatefeed = ",updatefeed);
             
              //firebase.database().ref("Feedback").child(valueParent).child(selectedEmail.key).remove();
             
            }
            else {
              Alert.alert(
                '', 'לא ניתן להתנתק מילד שאינו מחובר לאף אחד', [{ text: 'אוקיי', style: { fontSize: WIDTH / 41 } }]
              );
            }
          }
        })

      }
    }
    /* firebase.database()
      .ref("Users/" + selectedEmail.key).on('value', snapshot => {
        if (snapshot.val().creatorTeacher === "") {
          Alert.alert(
            '', 'לא ניתן להתנתק מילד שאינו מחובר לאף אחד', [{ text: 'אוקיי', style: { fontSize: WIDTH / 41 } }]
          );
        }
        else {//disconnect Parent from child
          firebase
            .database()
            .ref("Users")
            .child(selectedEmail.key)
            .update({ creatorParent: "" });
          Alert.alert(
            '', 'הניתוק בוצע', [{ text: 'אוקיי', style: { fontSize: WIDTH / 41 } }]
          );
          this.props.DeleteEmail(selectedEmail);
        }
      }) */
    /*          } else if (snapshot.val().creatorTeacher === currUser) {
               firebase.database()
                 .ref("Users/" + selectedEmail.key).on('value', async (snapshot) => {
                   if (snapshot.val().creatorParent === "") {
                     Alert.alert(
                       '', 'לא יתן להתנתק מילד שאינו מחובר לאף אחד', [{ text: 'אוקיי', style: { fontSize: WIDTH / 41 } }]
                     );
                   }
   
                   else {//disconnect teacher
                     console.log("snapshot.val().creatorParent = ", snapshot.val().creatorParent);
                     firebase
                       .database()
                       .ref("Users")
                       .child(selectedEmail.key)
                       .update({ creatorTeacher: "" });
   
    */

    /*     const IdTeacherFeedback = await firebase.database()
          .ref("Feedback")
          .child(snapshot.val().creatorParent)
          .child(selectedEmail.key).once("value"); */
    //console.log(IdTeacherFeedback)
    /*   await firebase
        .database()
        .ref("Feedback")
        .child(snapshot.val().creatorParent)
        .child(selectedEmail.key).once("value", async (snaaaapshot) => {
          snaaaapshot.forEach(childSnapshot => {
            firebase
              .database()
              .ref("Feedback")
              .child(snapshot.val().creatorParent).child(selectedEmail.key).child(childSnapshot.key)
              .update({ idTeacher: "" });
          })
        }); */


    /*  await UpdateIdTeacherFeedback.once("value", async(snapshot1) => {
       snapshot1.forEach(async(childSnapshot)=>{
         console.log("childSnapshot = ",childSnapshot)
         console.log("childSnapshot.key = ",childSnapshot.key)
         console.log("childSnapshot.val().idTeacher = ",childSnapshot.val().idTeacher) */
    /*  const updateid= firebase
     .database()
     .ref("Feedback")
     .child(firebase.auth().currentUser.uid)
     .child(email.key).child(childSnapshot.key)

     await updateid.once("value",async(snapshot3)=>{
       updateid.update({idParent:data.key})
         }) */
    //  })

    //});


    //console.log("snapshoot = ",snapshoot);
    //console.log("snapshoot.key = ",snapshoot.key);

    /*        Alert.alert(
             '', 'הניתוק בוצע', [{ text: 'אוקיי', style: { fontSize: WIDTH / 41 } }]
           );
           this.props.DeleteEmail(selectedEmail);

         }
       })
   } */
    //  });
    //     }
    //  }
  };

  renderEmail = (item, index) => {
    return (

      <View
        style={styles.taskContainer}
      >
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1.5, backgroundColor: 'transparent', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => this.deleteEmailConfirmation(item)} style={{ backgroundColor: 'transparent', padding: 5 }}>
            <Ionicons name="ios-trash" size={WIDTH / 15} color="black" />
          </TouchableOpacity>
        </View>

        <View style={{ flex: 8, alignItems: 'flex-end' }}>
          <Text style={styles.taskTitle}>
            {item.childEmail} - {item.name}
          </Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <CustomBackground>

        <HeaderActions children1={"לנתק "} children2={"ילד "} />



        <View style={{ flex: 9, marginTop: HEIGHT / 41 }}>
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
    DeleteEmail: (email) => dispatch({ type: "DELETE_EMAIL", payload: email }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DisconnectChild);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: 40,
  },
  taskContainer: {
    alignItems: "center",
    height: HEIGHT / 16,
    backgroundColor: '#efe8fd',
    justifyContent: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.black,
    paddingRight: WIDTH / 40
  },

  taskTitle: {
    fontSize: WIDTH / 21,
    fontWeight: "600",
    color: colors.black,
    padding: 3,
    marginRight: WIDTH / 30,
    fontFamily: Platform.OS === "ios" ? "Gill Sans" : "",

  },
});
