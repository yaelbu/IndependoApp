const initialState = {
    tasksChildren: [],
  };
  
  const tasksChildren = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_CHILD_TASKS_FROM_SERVER":
        return {
          ...state,
          tasksChildren: action.payload,
        };
  
      case "DELETE_TASK_CHILD":
        return {
          tasksChildren: state.tasksChildren.filter(
            (tasksChildren) => tasksChildren.taskname !== action.payload.taskname
          ),
        };
  
      default:
        return state;
    }
  };
  
  export default tasksChildren;
  