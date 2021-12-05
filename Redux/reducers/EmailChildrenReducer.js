const initialState = {
    emails: [],
  };
  
  const emails = (state = initialState, action) => {
    switch (action.type) {
      case "LOAD_EMAILS_FROM_SERVER":
        return {
          ...state,
          emails: action.payload,
        };
      case "ADD_EMAIL":
        return {
          ...state,
          emails: [action.payload, ...state.emails],
        };
      case "DELETE_EMAIL":
        return {
          emails: state.emails.filter(
            (email) => email.childEmail !== action.payload.childEmail
          ),
        };
      default:
        return state;
    }
  };
  
  export default emails;
  