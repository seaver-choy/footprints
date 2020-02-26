import * as actionTypes from '../actions/actionTypes';

const initialState = {
  loggedIn: false,
  loggingIn: false,
  user: null,
};

const authData = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOGGING_IN:
      return {
        ...state,
        loggingIn: action.payload,
      };
    case actionTypes.LOGIN:
      return {
        ...state,
        loggedIn: true,
        loggingIn: false,
        user: action.user,
      };

    case actionTypes.LOGOUT:
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
};

export default authData;
