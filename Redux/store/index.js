import { createStore, combineReducers } from "redux";
import tasksReducer from "../reducers/TasksReducer";
import FeedbackReducer from "../reducers/FeedbackReducer";
import EmailChildrenReducer from "../reducers/EmailChildrenReducer";
import stepsReducer from "../reducers/StepsReducer";

import TasksChildReducer from "../reducers/TasksChildReducer";
import GameDataReducer from '../reducers/GameDataReducer';
import PointReducer from '../reducers/PointReducer';
 


const store = createStore(
  combineReducers({
    tasks: tasksReducer,
    feedbacks: FeedbackReducer,
    emails: EmailChildrenReducer,
     steps: stepsReducer,


    tasksChildren: TasksChildReducer,
    dataGame:GameDataReducer,
    points:PointReducer 
  })
);

export default store;

