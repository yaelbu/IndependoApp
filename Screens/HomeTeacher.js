import React from 'react';
import { View, Text, Dimensions, Image, FlatList, StatusBar } from 'react-native';
import firebase from '@firebase/app';
import white from '../Images/white.png'
import CustomBackground from '../Components/CustomBackground';
import HeaderMenu from '../Components/HeaderMenu';
import NetworkImage from 'react-native-image-progress';
import colors from '../Colors';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import { snapshotToArray2 } from '../helpers/firebaseHelpers2';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { AntDesign } from '@expo/vector-icons';

import HomeStyle from '../Styles/Home.component.style';


const { width: WIDTH } = Dimensions.get("window");

require('firebase/database')
require('firebase/auth')


class HomeTeacher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      isAddNewBookVisible: false,
      addTaskVisible: false
    }
  }


  componentDidMount = async () => {
    const { navigation } = this.props
    const user = navigation.getParam('user')
    const currentUserData = await firebase.database().ref("Users").child(user.uid).once('value')
    this.setState({ currentUser: currentUserData.val() })
    const tasks = await firebase.database().ref("Tasks").child(user.uid).once('value');//check if the task with this name is already exist
    const taskArray = snapshotToArray2(tasks);
    this.props.loadTasks(taskArray);

    const feedbacks = await firebase.database().ref("Feedback").child(user.uid).once('value');//check if the task with this name is already exist
    //const feedbacks=await firebase.database().ref("Feedbacks").child(user.uid).once('value');//check if the task with this name is already exist

    const feedbackArray = snapshotToArray2(feedbacks);
    this.props.loadFeedbacks(feedbackArray);
  }

  toggleLikeCompleted = async (index, feedback) => {
    console.log("feedback = ", feedback)
    console.log("firebase.auth().currentUser.uid => ", firebase.auth().currentUser.uid);
    console.log("feedback.ChildID = ", feedback.ChildID)
    console.log("feedback.idTeacher = ", feedback.idTeacher)
    console.log("feedback.key = ", feedback.key)
    if (feedback.likeTeacher === false) {
      console.log("A")
      const UpdateTeacherCount =await firebase.database().ref("Feedback").child(feedback.idTeacher).child(feedback.ChildID).child(feedback.key);
      console.log("UpdateTeacherCount = ", UpdateTeacherCount)

      UpdateTeacherCount.once("value", snapshot => {
        UpdateTeacherCount.update({
          likeTeacher: true,
          countLike: snapshot.val().countLike + 1,
        })
      })
      if (feedback.idParent !== "") {
        console.log("B  feedback.idParent = ", feedback.idParent);
        const UpdateParentCount =await firebase.database().ref("Feedback").child(feedback.idParent).child(feedback.ChildID).child(feedback.key);
        console.log("UpdateParentCount = ", UpdateParentCount)
        

        UpdateParentCount.once("value", snapshot1 => {
          console.log("snapshot1.val().countLike = ",snapshot1.val().countLike)
          UpdateParentCount.update({
            likeTeacher: true,
            countLike: snapshot1.val().countLike + 1,
          })
        })

      }
      this.props.updateLike({ ...feedback, countLike: feedback.countLike + 1 });
    }

 /*      const pointChild = firebase.database().ref("Users").child(feedback.ChildID);
      pointChild.once("value", (snapshot) => {
        pointChild.update({
          Points: snapshot.val().Points + 150,
        })
      }) */
    

    else {
      console.log("D")
      const UpdateTeacherCount =await firebase.database().ref("Feedback").child(feedback.idTeacher).child(feedback.ChildID).child(feedback.key);
      console.log("UpdateTeacherCount = ", UpdateTeacherCount)

      UpdateTeacherCount.once("value", snapshot => {
        UpdateTeacherCount.update({
          likeTeacher: false,
          countLike: snapshot.val().countLike - 1,
        })
      })
      if (feedback.idParent !== "") {
        console.log("B  feedback.idParent = ", feedback.idParent);
        const UpdateParentCount =await firebase.database().ref("Feedback").child(feedback.idParent).child(feedback.ChildID).child(feedback.key);
        console.log("UpdateParentCount = ", UpdateParentCount)

        UpdateParentCount.once("value", snapshot => {
          UpdateParentCount.update({
            likeTeacher: false,
            countLike: snapshot.val().countLike - 1,
          })
        })

      }
      this.props.updateLike({ ...feedback, countLike: feedback.countLike - 1 });


   /*    const pointChild = firebase.database().ref("Users").child(feedback.ChildID);
      pointChild.once("value", (snapshot) => {
        pointChild.update({
          Points: snapshot.val().Points - 150,
        })
      }) */
    }

    feedback.likeTeacher = !feedback.likeTeacher;
    this.props.updateTeacherStatusLike({
      ...feedback,
      likeTeacher: feedback.likeTeacher,
    });
  };


  renderItem = (item, index) => {
    return (
      <View style={HomeStyle.listItemContainer}>
        <View style={HomeStyle.imageContainer}>
          {item.image ? (
            <NetworkImage
              source={{ uri: item.image }}
              style={HomeStyle.image}
              imageStyle={HomeStyle.ImageStyleTask}
            />
          ) : (
            <Image source={white} style={HomeStyle.ImageWhite} />
          )}
        </View>
        <Text style={HomeStyle.textTaskname}>{item.taskname}</Text>
      </View>
    );
  };


  renderItemFeedback = (item, index) => {
    return (
      <View style={HomeStyle.listItemContainerFeedback}>
        <Text
          style={HomeStyle.textChildName}
        >
          {item.name}
        </Text>
        <Text
          style={HomeStyle.textTasknameFeedback}
        >
          {item.key}
        </Text>
        <View style={HomeStyle.imageContainerFeedback}>
          {item.ImageFeedback ? (
            <NetworkImage
              source={{ uri: item.ImageFeedback }}
              style={HomeStyle.imageFeedback}
              imageStyle={HomeStyle.ImageStyleFeedback}
            />
          ) : (
            <Image source={white} style={HomeStyle.ImageWhite} />
          )}
        </View>

        <View style={HomeStyle.LikeView}>
          <Text style={HomeStyle.LikeStyleText}>{item.countLike}</Text>
          <TouchableOpacity
            onPress={() => this.toggleLikeCompleted(index, item)}
          >
            <AntDesign
              name={item.likeTeacher ? "like1" : "like2"}
              size={WIDTH / 13.8}
              color={colors.black}
              style={HomeStyle.LikeStyleDesign}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (

      <CustomBackground>
        <View>

          <StatusBar backgroundColor="black" hidden={false} />
        </View>
        <HeaderMenu> היי, {this.state.currentUser.firstname} {this.state.currentUser.lastname} !</HeaderMenu>


        <View style={HomeStyle.container}>
          <Text style={HomeStyle.TitleStyle}>בנק משימות</Text>
          <View style={{ flex: 1, paddingHorizontal: WIDTH / 69, paddingVertical: 5 }}>
            <FlatList
              data={this.props.tasks.tasks}
              horizontal={true}
              renderItem={({ item }, index) => this.renderItem(item, index)}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <Text style={HomeStyle.emptyListText}>
                    אין הוספת משימות
                  </Text>
                </View>
              }
            />
          </View>
        </View>

        <View style={HomeStyle.containerFeedback}>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={HomeStyle.TitleStyle}>חיזוקים חיוביים</Text>
          </View>
          <View style={{ flex: 8 }}>
            <FlatList
              data={this.props.feedbacks.feedbacks}
              numColumns={3}
              renderItem={({ item }, index) =>
                this.renderItemFeedback(item, index)
              }
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={
                <View
                  style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
                >
                  <Text style={HomeStyle.emptyListText}>
                    לא קיים סלפי
                  </Text>
                </View>
              }
            />

          </View>
        </View>


      </CustomBackground>
    );
  }
}









const mapStateToProps = state => {
  return {
    tasks: state.tasks,
    feedbacks: state.feedbacks
  };
}

const mapDispatchToProps = dispatch => {
  return {
    loadTasks: tasks => dispatch({ type: 'LOAD_TASKS_FROM_SERVER', payload: tasks }),
    loadFeedbacks: feedbacks => dispatch({ type: 'LOAD_FEEDBACKS_FROM_SERVER', payload: feedbacks }),
    updateTeacherStatusLike: feedback => dispatch({ type: 'UPDATE_TEACHER_LIKE', payload: feedback }),
    updateLike: feedback => dispatch({ type: 'UPDATE_LIKE', payload: feedback }),
  }
}


const wrapper = compose(
  connect
    (mapStateToProps, mapDispatchToProps),
  connectActionSheet
)


export default wrapper(HomeTeacher);
