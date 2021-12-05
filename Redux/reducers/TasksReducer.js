const initialState = {
    tasks: [],
    image: null,
    video: null,
    ImageFeedback: null,
  };
  
  const tasks = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_TASKS_FROM_SERVER":
        return {
          ...state,
          tasks: action.payload,
        };
  
      case "ADD_TASK":
        return {
          ...state,
          tasks: [action.payload, ...state.tasks],
        };
      case "DELETE_TASK":
        return {
          tasks: state.tasks.filter(
            (task) => task.taskname !== action.payload.taskname
          ),
        };
  
      case "UPDATE_TASK_IMAGE":
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.taskname == action.payload.taskname) {
              return { ...task, image: action.payload.uri };
            }
            return task;
          }),
        };
      case "UPDATE_FEEDBACK_IMAGE":
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.taskname == action.payload.taskname) {
              return { ...task, ImageFeedback: action.payload.uri };
            }
            return task;
          }),
        };
        case "UPDATE_COUNT_ASSIGN":
          return {
            ...state,
            tasks: state.tasks.map((task) => {
              if (task.taskname == action.payload.taskname) {
                return { ...task, CountAssign: action.payload.CountAssign };
              }
              return task;
            }),
          };
  
      case "UPDATE_TASK_VIDEO":
        return {
          ...state,
          tasks: state.tasks.map((task) => {
            if (task.taskname == action.payload.taskname) {
              return { ...task, video: action.payload.uri };
            }
            return task;
          }),
        };
  
      default:
        return state;
    }
  };
  
  export default tasks;
  