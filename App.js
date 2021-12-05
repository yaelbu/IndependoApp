import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Icon, Left } from "native-base";
import { Dimensions,View } from 'react-native';
import {
  MaterialIcons,
  MaterialCommunityIcons,
  FontAwesome5,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";
import firebase from "@firebase/app";


//redux libraries
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Provider } from "react-redux";
import store from "./Redux/store";

//screens
import WelcomeScreen from "./Screens/WelcomeScreen";
import LoginChild from "./Screens/LoginChild";
import LoginAdult from "./Screens/LoginAdult";


import SignUp from "./Screens/SignUp";

import ForgotPassword from "./Screens/ForgotPassword";

import LoadingScreen from "./Screens/LoadingScreen";

import HomeChild from "./Screens/HomeChild";
import HomeTeacher from "./Screens/HomeTeacher";
import HomeParent from "./Screens/HomeParent";



import GamesScreen from "./Screens/GamesScreen";

import SettingsScreen from "./Screens/SettingsScreen";
import SettingsScreenChild from "./Screens/SettingsScreenChild";


import AddTaskToChild from "./AddTaskToChild/AddTaskToChild";
import AddTask from "./AddDeleteTasks/AddTask";
import ChildProgression from "./ChildProgression/ChildProgression";
import DeleteTaskToChild from "./DeleteTaskToChild/DeleteTaskToChild";

import SignUpChild from "./Screens/SignUpChild";

import ChangePassword from "./Screens/ChangePassword";

import TodoList from "./AddDeleteTasks/TodoList";

import TasksChild from "./MyTasksChild/TasksChild";
import ConnectChildAdult from "./ConnectChild/ConnectChildAdult";
import DisconnectChild from "./Screens/DisconnectChild";
import GameData from './GameData/GameData';

import { CustomDrawerNavigator } from './CustomDrawerNavigator';
import VideoChild from "./MyTasksChild/VideoChild";
import TodoListChild from "./MyTasksChild/TodoListChild";



const { width: WIDTH } = Dimensions.get("window");
const { height: HEIGHT } = Dimensions.get("window");
/* 
const firebaseConfig={
    apiKey: "AIzaSyDpItzdC576r3-URn47dIoTotxl8rSqWUc",
    authDomain: "independotest-9c3b2.firebaseapp.com",
    databaseURL: "https://independotest-9c3b2-default-rtdb.firebaseio.com",
    projectId: "independotest-9c3b2",
    storageBucket: "independotest-9c3b2.appspot.com",
    messagingSenderId: "1044916856656",
    appId: "1:1044916856656:web:a12786beb81b196c07ee55"
  };
 */
 
 const firebaseConfig = {
  apiKey: "AIzaSyDYAVm7Rw5XxOV_NGj8jMGogh7-7AcoidI",
  authDomain: "independoapp.firebaseapp.com",
  databaseURL: "https://independoapp-default-rtdb.firebaseio.com",
  projectId: "independoapp",
  storageBucket: "independoapp.appspot.com",
  messagingSenderId: "241337078761",
  appId: "1:241337078761:web:a2809cecea1d940840f178",
};   

 /*  const firebaseConfig = {
  apiKey: "AIzaSyDDO_gcVy1KUuWuc8Li-sbRafg9JQRszB0",
  authDomain: "independo-70c81.firebaseapp.com",
  databaseURL: "https://independo-70c81-default-rtdb.firebaseio.com",
  projectId: "independo-70c81",
  storageBucket: "independo-70c81.appspot.com",
  messagingSenderId: "289821105771",
  appId: "1:289821105771:web:f6414d761c13f785e75b2e"
};  
 */
/*  const firebaseConfig = {
  apiKey: "AIzaSyD2Uttwpc2JfZxsjneiQ5fXnSc5RUWfKis",
  authDomain: "independodatabase.firebaseapp.com",
  databaseURL: "https://independodatabase-default-rtdb.firebaseio.com",
  projectId: "independodatabase",
  storageBucket: "independodatabase.appspot.com",
  messagingSenderId: "334046906267",
  appId: "1:334046906267:web:05c5843e0a58fe6cba033e"
};
  */
if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  render() {
    return (
      <Provider store={store}>
        <ActionSheetProvider>
          <AppContainer />
        </ActionSheetProvider>
      </Provider>
    );
  }
}

const AddDeleteStackNavigator = createStackNavigator({
  AddTask: {
    screen: AddTask,
    navigationOptions: { header: () => true },
  },
  TodoList: {
    screen: TodoList,
    navigationOptions: { header: () => true },
/*     navigationOptions: ({ navigation }) => ({
      title: '',
      headerStyle:{
        backgroundColor: '#efe8fd',
      },
       : (
        <View style={{marginLeft:10}}>
          <Icon name={'arrow-back-sharp'}
            onPress={() => { navigation.goBack() }} />
        </View>),
        


    }) */
  }
});

const LoginAdultStackNavigator = createStackNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen,
    navigationOptions: { header: () => true },
  },
  LoginAdult: { screen: LoginAdult, navigationOptions: { header: () => true } },
  SignUp: { screen: SignUp, navigationOptions: { header: () => true } },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: { header: () => true },
  },
});

const LoginChildStackNavigator = createStackNavigator({
  WelcomeScreen: {
    screen: WelcomeScreen,
    navigationOptions: { header: () => true },
  },
  LoginChild: { screen: LoginChild, navigationOptions: { header: () => true } },
  ForgotPassword: {
    screen: ForgotPassword,
    navigationOptions: { header: () => true },
  },
});

const TaskChildStackNavigator = createStackNavigator({
  TasksChild: {
    screen: TasksChild,
    navigationOptions: {
      header: () => true,
      headerShown: false,
      headerTransparent: true,
      headerVisible: false,
    }
  },

  VideoChild: {
    screen: VideoChild,
    navigationOptions: ({ navigation }) => ({
      title: '',
      headerStyle:{
        backgroundColor: '#efe8fd',
      },
      headerLeft:()=> {
        <View style={{marginLeft:10}}>
          <Icon name={'arrow-back-sharp'}
            onPress={() => { navigation.goBack() }} />
        </View>},
        


    })
  },

  TodoListChild: {
    screen: TodoListChild,
    navigationOptions: ({ navigation }) => ({
      title: '',
      headerStyle:{
        backgroundColor: '#efe8fd',
      },
      headerLeft:()=>{ 
        <View style={{marginLeft:10}}>
          <Icon name={'arrow-back-sharp'}
            onPress={() => { navigation.goBack() }} />
        </View>},


    })
  }
});


const AppHomeParentDrawerNavigator = createDrawerNavigator({
  HomeParent: {
    screen: HomeParent,

    navigationOptions: {
      title: "תפריט ראשי ",
      headerStyle: {
        backgroundColor: "rgb(0, 145, 234)",
      },
      drawerIcon: () => <Icon name="home" size={25} />,
    },
  },

  SignUpChild: {
    screen: SignUpChild,
    navigationOptions: {
      title: "יצירת חשבון לילד",
      drawerIcon: () => <Icon name="add" size={25} />,
    },
  },


/*   ConnectChildAdult: {
    screen: ConnectChildAdult,
    navigationOptions: {
      title: "שיוך תלמיד למטופל",
      drawerIcon: () => <Icon name="add" size={25} />,
    },
  }, */

  AddTask: {
    screen: AddDeleteStackNavigator,
    navigationOptions: {
      title: "עריכת משימות",
      drawerIcon: () => <Entypo name="add-to-list" size={24} color="black" />,
    },
  },

  AddTaskToChild: {
    screen: AddTaskToChild,
    navigationOptions: {
      title: "הוספת משימות לילד",
      drawerIcon: () => <FontAwesome5 name="tasks" size={24} color="black" />,
    },
  },


  DeleteTaskToChild: {
    screen: DeleteTaskToChild,
    navigationOptions: {
      title: "מחיקת משימות לילד",
      drawerIcon: () => <AntDesign name="delete" size={24} color="black" />,
    },
  },


  ChildProgression: {
    screen: ChildProgression,
    navigationOptions: {
      title: "התקדמות ילד",
      drawerIcon: () => (
        <MaterialCommunityIcons name="progress-check" size={24} color="black" />
      ),
    },
  },


  GameData: {
    screen: GameData,
    navigationOptions: {
      title: "נתוני משחק",
      drawerIcon: () => (
        <FontAwesome5 name="gamepad" size={24} color="black" />
      ),
    },
  },

  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      title: "שינוי סיסמא",
      drawerIcon: () => <MaterialIcons name="lock" size={24} color="black" />,
    },
  },


  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: {
      title: "הגדרות",
      drawerIcon: () => <Icon name="settings" size={25} />,
      //contentComponent: props => <CustomLogOut {...props} />

    },



  },


}, {
  contentComponent: props => <CustomDrawerNavigator {...props} />

}, {

  contentOptions: {
    activeTintColor: '#ffff',
    itemsContainerStyle: {
      marginVertical: 0,
    },
    labelStyle: {
      fontSize: WIDTH / 27.6
    }
  },
  drawerBackgroundColor: '#efe8fd',
}, {
  initialRouteName: "Home"

});



const HomeParentStackContainer = createStackNavigator({
  AppHomeParentDrawerNavigator
}, {
  defaultNavigationOptions: ({ navigation }) => {
    return {
       headerTitle: "",
      headerLeft: () => (
        <Icon
          style={{ paddingLeft: WIDTH / 40 }}
          onPress={() => navigation.openDrawer()}
          name="menu"
          size={WIDTH / 13.8}
        />
      )
    }
  }
}
);

const AppHomeTeacherDrawerNavigator = createDrawerNavigator({

  HomeTeacher: {
    screen: HomeTeacher,
    navigationOptions: {
      title: "תפריט ראשי ",



      drawerIcon: () => <Icon name="home" size={25} />,
    },
  },

  SignUpChild: {

    screen: SignUpChild,
    navigationOptions: {
      title: "יצירת חשבון לתלמיד",
      drawerIcon: () => <Icon name="add" size={25} />,
    },

  },

/*   ConnectChildAdult: {
    screen: ConnectChildAdult,
    navigationOptions: {
      title: "שיוך תלמיד להורה",
      drawerIcon: () => <Icon name="add" size={25} />,
    },
  },

  DisconnectChild: {
    screen: DisconnectChild,
    navigationOptions: {
      title: "ניתוק חשבון ילד/מורה",
      drawerIcon: () => <FontAwesome5 name="unlink" size={25} />,
    },
  }, */
  AddTask: {
    screen:AddDeleteStackNavigator,
    navigationOptions: {
      title: "עריכת משימות",
      drawerIcon: () => <Entypo name="add-to-list" size={24} color="black" />,
    },
  },


  AddTaskToChild: {
    screen: AddTaskToChild,
    navigationOptions: {
      title: "הוספת משימות לילד",
      drawerIcon: () => <FontAwesome5 name="tasks" size={24} color="black" />,
    },
  },

  DeleteTaskToChild: {
    screen: DeleteTaskToChild,
    navigationOptions: {
      title: "מחיקת משימות לילד",
      drawerIcon: () => <AntDesign name="delete" size={24} color="black" />,
    },
  },




  ChildProgression: {
    screen: ChildProgression,
    navigationOptions: {
      title: "התקדמות ילד",
      drawerIcon: () => (
        <MaterialCommunityIcons name="progress-check" size={24} color="black" />
      ),
    },
  },


  GameData: {
    screen: GameData,
    navigationOptions: {
      title: "נתוני משחק",
      drawerIcon: () => (
        <FontAwesome5 name="gamepad" size={24} color="black" />
      ),
    },
  },


  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      title: "שינוי סיסמא",
      drawerIcon: () => <MaterialIcons name="lock" size={24} color="black" />,
    },
  },


  SettingsScreen: {
    screen: SettingsScreen,
    navigationOptions: {
      title: "הגדרות",
      drawerIcon: () => <Icon name="settings" size={25} />,
      //contentComponent: props => <CustomLogOut {...props} />
    },
  },
  /*   LogoutScreen: (props) => (
      <View style={{ flex: 1 }}>
        <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
          <DrawerItems {...props} />
          <Button title="Logout" onPress={async() => {
            try {
              await firebase.auth().signOut();
              this.props.navigation.navigate("WelcomeScreen");
            } catch (error) {
              Alert.alert("", "לא ניתן להתנתק כעת");
            }
          }}/>
        </SafeAreaView>
      </View>
    ),
  
   */

}, {
  contentComponent: props => <CustomDrawerNavigator {...props} />

}, {

  contentOptions: {
    activeTintColor: '#ffff',
    itemsContainerStyle: {
      marginVertical: 0,
    },
    iconContainerStyle: {
      opacity: 1,
    },
    labelStyle: {
      fontSize: WIDTH / 27.6
    }
  },
  drawerBackgroundColor: '#efe8fd',
}, {
  initialRouteName: "Home"

});

const HomeTeacherStackContainer = createStackNavigator({
  AppHomeTeacherDrawerNavigator
}, {
  defaultNavigationOptions: ({ navigation }) => {
    return {
       headerTitle: "",
      headerLeft: () => (
        <Icon
          style={{ paddingLeft: WIDTH / 40 }}
          onPress={() => navigation.openDrawer()}
          name="menu"
          size={WIDTH / 13.8}
        />
      )
    }
  }
}
);

const HomeChildTabNavigator = createBottomTabNavigator({
  HomeChild: {
    screen: HomeChild,
    navigationOptions: {
      tabBarLabel: "דף הראשי",
      tabBarOptions: {
        style: { height: HEIGHT / 16, fontSize: 40 },
        labelStyle: {
          fontSize: WIDTH / 25,
          justifyContent: 'center',
          alignContent: 'center',
        },
      }


    },
  },

  GamesScreen: {
    screen: GamesScreen,
    navigationOptions: {
      tabBarLabel: "משחקים",
      tabBarOptions: {
        style: { height: HEIGHT / 16, fontSize: 40 },
        labelStyle: {
          fontSize: WIDTH / 25,
          justifyContent: 'center',
          alignContent: 'center',
        },
      }
    },
  },


  TasksChild: {
    screen: TaskChildStackNavigator,
    navigationOptions: {
      tabBarLabel: "המשימות שלי",
      //tabBarVisible:false,
      tabBarOptions: {
        style: { height: HEIGHT / 16, fontSize: 40 },
        labelStyle: {
          fontSize: WIDTH / 25,
          justifyContent: 'center',
          alignContent: 'center',
        },
        
      }
    },
  },


  SettingsScreen: {
    screen: SettingsScreenChild,
    navigationOptions: {
      tabBarLabel: "הגדרות",
      tabBarOptions: {
        style: { height: HEIGHT / 16, fontSize: 40 },
        labelStyle: {
          fontSize: WIDTH / 25,
          justifyContent: 'center',
          alignContent: 'center',
        },
      }
    },
  },
});




const AppSwitchNavigator = createSwitchNavigator({
  LoadingScreen,
  HomeChildTabNavigator,
  LoginAdultStackNavigator,
  LoginChildStackNavigator,
  HomeParentStackContainer,
  HomeTeacherStackContainer,
  AddDeleteStackNavigator,
  TaskChildStackNavigator
});

const AppContainer = createAppContainer(AppSwitchNavigator);


