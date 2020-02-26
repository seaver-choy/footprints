import * as actionTypes from './actionTypes';
import firebase from 'react-native-firebase';
import * as screenNames from '../../../navigation/screen_names';
import * as geofenceActionTypes from '../../geofence/actions/actionTypes';

export const login = (username, password, navigation) => {
  return dispatch => {
    dispatch({type: actionTypes.LOGGING_IN, payload: true});
    firebase
      .auth()
      .signInWithEmailAndPassword(username, password)
      .then(
        user => {
          firebase
            .firestore()
            .collection('users')
            .doc(user.user.uid)
            .get()
            .then(userDoc => {
              if (!userDoc.exists) {
                firebase
                  .firestore()
                  .collection('users')
                  .doc(user.user.uid)
                  .set();
              } else {
                dispatch({
                  type: geofenceActionTypes.ADD_MARKER,
                  payload: userDoc.data().geoMarker,
                });
                dispatch({
                  type: geofenceActionTypes.ADD_DEVICE,
                  device: userDoc.data().device,
                });
                console.log(userDoc.data());
              }
            });

          dispatch({
            type: actionTypes.LOGIN,
            user: user.user,
          });
          navigation.navigate(screenNames.HOME);
        },
        error => {
          dispatch({
            type: actionTypes.LOGGING_IN,
            payload: false,
          });
          console.log(error);
        },
      );
  };
};
