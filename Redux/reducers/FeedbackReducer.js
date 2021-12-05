const initialState = {
    feedbacks: [],
    countLike: 0,
  };
  
  const feedbacks = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_FEEDBACKS_FROM_SERVER":
        return {
          ...state,
          feedbacks: action.payload,
        };
  
      case "UPDATE_LIKE":
        return {
          ...state,
          feedbacks: state.feedbacks.map((feedback) => {
            if (feedback.taskname == action.payload.taskname) {
              return { ...feedback, countLike: action.payload.countLike };
            }
            return feedback;
          }),
        };
      case "UPDATE_PARENT_LIKE":
        return {
          ...state,
          feedbacks: state.feedbacks.map((feedback) => {
            if (feedback.taskname == action.payload.taskname) {
              return { ...feedback, likeParent: action.payload.likeParent };
            }
            return feedback;
          }),
        };
      case "UPDATE_TEACHER_LIKE":
        return {
          ...state,
          feedbacks: state.feedbacks.map((feedback) => {
            if (feedback.taskname == action.payload.taskname) {
              return { ...feedback, likeTeacher: action.payload.likeTeacher };
            }
            return feedback;
          }),
        };
  
      default:
        return state;
    }
  };
  
  export default feedbacks;
  