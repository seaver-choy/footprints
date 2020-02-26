import * as actions from '../actions/actionTypes';

const INITIAL_STATE = {
  geofenceMarker: null,
  device: null,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.ADD_MARKER:
      return {
        ...state,
        geofenceMarker: action.payload,
      };
    case actions.ADD_DEVICE:
      console.log(action.device);
      return {
        ...state,
        device: action.device,
      };
    default:
      return state;
  }
};
