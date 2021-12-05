/* console.disableYellowBox = true;
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]);
LogBox.ignoreAllLogs();
 */
import React from "react";
import { StyleSheet, View,Alert,Dimensions } from "react-native";
import Header from "../Components/Header.js";
import Score from "../Components/Score";
import Card from "../Components/Card";
import firebase from "firebase/app";
import { connect } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import ConfettiCanoon from "react-native-confetti-cannon";
import helpers from '../helpers/helpers';
/* import tasksChildren from '../Redux/reducers/TasksChildReducer'; */
require("firebase/auth");
require("firebase/database");
import "firebase/database";

const { width: WIDTH } = Dimensions.get("window");

class GamesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.renderCards = this.renderCards.bind(this);

    let cards = [
       {
        Image_name: require("../Images/TasksImage/bed.png"),
      }, 

      {
        Image_name: require("../Images/TasksImage/teeth.png"),
      },

      {
        Image_name: require("../Images/TasksImage/tooth-cleaning.png"),
      },

      {
        Image_name: require("../Images/TasksImage/tooth-brush.png"),
      },

      {
        Image_name: require("../Images/TasksImage/water-tap.png"),
      },

      {
        Image_name: require("../Images/TasksImage/water.png"),
      },

      {
        Image_name: require("../Images/TasksImage/rag.png"),
      },

      {
        Image_name: require("../Images/TasksImage/table.png"),
      },

      {
        Image_name: require("../Images/TasksImage/sink.png"),
      },

      {
        Image_name: require("../Images/TasksImage/pillow.png"),
      },
    ];

    let clone = JSON.parse(JSON.stringify(cards));

    this.cards = cards.concat(clone);
    this.cards.map((obj) => {
      let id = Math.random().toString(36).substring(7);
      obj.id = id;
      obj.is_open = false;
    });

    this.cards=this.cards.shuffle();
    this.state = {
      current_selection: [],
      selected_pairs: [],
      score: 0,
      cards: this.cards,
      shoot: false,
    };
  }  


  render() {
    return (
      <View style={styles.container}>
        <Header />
        <Score score={this.state.score} />

        <View style={styles.body}>{this.renderRows.call(this)}</View>

     {/*    {this.state.shoot ? (
          <ConfettiCanoon
            count={500}
            explosionSpeed={250}
            origin={{ x: -10, y: 10 }}
          />
        ) : null} */}
      </View>
    );
  }

  renderRows() {
    let contents = this.getRowContents(this.state.cards);
    return contents.map((cards, index) => {
      return (
        <View key={index} style={styles.row}>
          {this.renderCards(cards)}
        </View>
      );
    });
  }

  renderCards(cards) {
    return cards.map((card, index) => {
      return (
        <Card
          key={index}
          Image_name={card.Image_name}
          is_open={card.is_open}
          clickCard={this.clickCard.bind(this, card.id)}
        />
      );
    });
  }

  clickCard = (id) => {
    let selected_pairs = this.state.selected_pairs;
    let current_selection = this.state.current_selection;
    let score = this.state.score;

    let index = this.state.cards.findIndex((card) => {
      return card.id == id;
    });

    let cards = this.state.cards;

    if (
      cards[index].is_open == false &&
      selected_pairs.indexOf(cards[index].Image_name) === -1
    ) {
      cards[index].is_open = true;

      current_selection.push({
        index: index,
        Image_name: cards[index].Image_name,
      });

      if (current_selection.length == 2) {
        if (current_selection[0].Image_name == current_selection[1].Image_name)
        {
          score += 10;
          if (score == 100) 
          {
            Alert.alert("", "ניצחת!", [{ text: "אוקיי",  style: { fontSize: WIDTH / 41 } }]);

            setTimeout(() => {
              let cards = this.cards.map((obj) => {
                obj.is_open = false;
                return obj;
              });

              cards = cards.shuffle();
               

              this.setState({
                current_selection: [],
                selected_pairs: [],
                cards: cards,
                score: 0,
                shoot: false,
              });
            }, 4000);
            const pointsRef =firebase.database().ref("Users").child(firebase.auth().currentUser.uid);
      
              pointsRef.once("value",(snapshot) =>{
               pointsRef.update({
                 Points: snapshot.val().Points + score,
                 CountGame: snapshot.val().CountGame + 1,     
           })
           
           const points=(snapshot.val().Points)+score
               this.props.updatePoints({points:points})
               
         }) 


         var today = new Date();
         var date;
         const hours = today.getHours();
         const minutes = today.getMinutes();
         const seconds = today.getSeconds();
         if (hours >= 0 && hours <= 9 && minutes >= 0 && minutes <= 9 && seconds >= 0 && seconds <= 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + "0" + minutes + ":" + "0" + seconds;
           console.log("date1 = ", date)
         }
         if (hours >= 0 && hours <= 9 && minutes >= 0 && minutes <= 9 && seconds > 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + "0" + minutes + ":" + seconds;
           console.log("date2 = ", date)
         }
         if (hours >= 0 && hours <= 9 && minutes > 9 && seconds >= 0 && seconds <= 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + minutes + ":" + "0" + seconds;
           console.log("date3 = ", date)
         }
         if (hours > 9 && minutes >= 0 && minutes <= 9 && seconds >= 0 && seconds <= 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + "0" + minutes + ":" + "0" + seconds;
           console.log("date4 = ", date)
         }
         if (hours >= 0 && hours <= 9 && minutes > 9 && seconds > 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + "0" + hours + ":" + minutes + ":" + seconds;
           console.log("date5 = ", date)
         }
         if (hours > 9 && minutes >= 0 && minutes <= 9 && seconds > 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + "0" + minutes + ":" + seconds;
           console.log("date6 = ", date)
         }
         if (hours > 9 && minutes > 9 && seconds >= 0 && seconds <= 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + minutes + ":" + "0" + seconds;
           console.log("date7 = ", date)
         }
         if (hours > 9 && minutes > 9 && seconds > 9) {
           date = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "  " + hours + ":" + minutes + ":" + seconds;
           console.log("date8 = ", date)
         }
         var dateWithoutHour = today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
           
          /*   const key = firebase
              .database()
              .ref("GamesData")
              .child(firebase.auth().currentUser.uid)
              .push().key; */
            const CountPlay=firebase
              .database()
              .ref("GamesData")
              .child(firebase.auth().currentUser.uid).child(dateWithoutHour);
                  CountPlay.once("value", (snapshot) => {
                    if(snapshot.exists())
                    {
                      console.log('exist')
                    CountPlay.update({
                      countPlay: snapshot.val().countPlay + 1,
                    })
                    }
                  })
                
              
             /*  .set({
                PlayDate: dateWithoutHour,
                countPlay:1
              });  */
/* 
              firebase
              .database()
              .ref("GamesDataaaaa")
              .child(firebase.auth().currentUser.uid)
              .push({
                PlayDate: date,
              });  */

         /*      const key = firebase
              .database()
              .ref("GamesDataaa")
              .child(firebase.auth().currentUser.uid)
              .push().key;
            firebase
              .database()
              .ref("GamesDataaa")
              .child(firebase.auth().currentUser.uid)
              .child(key)
              .set({
                PlayDate: date,
              });  */

          }


          selected_pairs.push(cards[index].Image_name);
          //this.props.navigate("GamesScreen")
        } 
        
        else {
          cards[current_selection[0].index].is_open = false;

          setTimeout(() => {
            
            cards[index].is_open = false;
            this.setState({
              cards: cards,
            });
          }, 800);
        }

        current_selection = [];
      }

      this.setState({
        score: score,
        cards: cards,
        current_selection: current_selection,
      });
    }
  };

  getRowContents(cards) {
    let contents_r = [];
    let contents = [];
    let count = 0;
    cards.forEach((item) => {
      count += 1;
      contents.push(item);
      if (count == 4) {
        contents_r.push(contents);
        count = 0;
        contents = [];
      }
    });

    return contents_r;
  }
}

const mapStateToProps = (state) => {
  return {
    points: state.points,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updatePoints: (points) =>
      dispatch({ type: "UPDATE_POINTS", payload: points }),

  };
};

const wrapper = compose(
  connect(mapStateToProps, mapDispatchToProps),
  connectActionSheet
);

export default wrapper(GamesScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: "#fff",
  },
  row: {
    flex: 1,
    flexDirection: "row",
  },
  body: {
    flex: 18,
    justifyContent: "space-between",
    padding: 10,
    marginTop: 20,
  },
});
