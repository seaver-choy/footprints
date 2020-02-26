import * as actionTypes from './actionTypes';
import firebase from 'react-native-firebase';
import store from '../../../store';

export const setMarker = (latitude, longitude, radius, navigation) => {
  return (dispatch, getState) => {
    const latlng = {
      latitude: latitude,
      longitude: longitude,
    };
    const geoMarker = {
      latlng,
      radius: radius,
    };
    dispatch({
      type: actionTypes.ADD_MARKER,
      payload: geoMarker,
    });
    firebase
      .firestore()
      .collection('users')
      .doc(getState().auth.user.uid)
      .update({geoMarker: geoMarker})
      .then(() => {
        navigation.goBack();
      });
  };
};
