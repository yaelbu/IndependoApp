const initialState = {
    points: 0,

  };
  
  const points = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_POINTS":
        return {
        ...state,
        points: action.payload,
    };


        case "UPDATE_POINTS":
            return {
            ...state,
            points: action.payload.points,
        };


        default:
            return state;
    }
  };
  
  export default points;
  