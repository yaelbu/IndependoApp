const initialState = {
    steps: [],
    image: null,
    status: false,
    stepsDone:[],
    stepsUndone:[]
  };
  
  const steps = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_STEPS_FROM_SERVER":
        return {
          ...state,
          steps: action.payload,
          stepsUndone:action.payload.filter(step=>!step.status),
          stepsDone:action.payload.filter(step=>step.status)
        };

      case "ADD_STEP":
        return {
          ...state,
          steps: [action.payload, ...state.steps],
          //[...state.steps,action.payload],
        };
      case "DELETE_STEP":
        return {
          steps: state.steps.filter(
            (step) => step.title !== action.payload.title
          ),
        };
  
      case "UPDATE_STEP_IMAGE":
        return {
          ...state,
          steps: state.steps.map((step) => {
            if (step.title == action.payload.title) {
              return { ...step, image: action.payload.uri };
            }
            return step;
          }),
        };

        case "UPDATE_STEP_STATUS_DONE":
          return {
            ...state,
            steps: state.steps.map((step) => {
              if (step.title == action.payload.title) {
                return { ...step, status: true};
              }
              return step;
            }),
            stepsDone:[...state.stepsDone,action.payload],
            stepsUndone:state.stepsUndone.filter(step=>step.title!==action.payload.title)
          };

      case "UPDATE_STEP_STATUS_UNDONE":
        return {
          ...state,
          steps: state.steps.map((step) => {
            if (step.title == action.payload.title) {
              return { ...step, status: false };
            }
            return step;
          }),
          stepsUndone:[...state.stepsUndone,action.payload],
          stepsDone:state.stepsDone.filter(step=>step.title!==action.payload.title)
        };
      default:
        return state;
    }
  };
  
  export default steps;
  