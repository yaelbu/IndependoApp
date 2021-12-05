const initialState = {
    dataGame: [],
  };
  
  const dataGame = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_DATA_GAME_FROM_SERVER":
        return {
          ...state,
          dataGame: action.payload,
        };

      default:
        return state;
    }
  };
  
  export default dataGame;
  