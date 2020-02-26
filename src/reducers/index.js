import {combineReducers} from 'redux';
import authData from '../features/login/reducers';
import homeData from '../features/home/reducers';
import geofenceData from '../features/geofence/reducers';
import * as loginActionTypes from '../features/login/actions/actionTypes';
const appReducer = combineReducers({
  auth: authData,
  home: homeData,
  geofence: geofenceData,
});

export default (state, action) => {
  if (action.type == loginActionTypes.LOGOUT) {
    state = undefined;
  }
  return appReducer(state, action);
};
