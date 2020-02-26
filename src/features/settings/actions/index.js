import * as actionTypes from './actionTypes';
import firebase from 'react-native-firebase';
import {LOGIN} from '../../../navigation/screen_names';
import * as loginActionTypes from '../../login/actions/actionTypes';

export const logOut = navigation => {
  return dispatch => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        navigation.navigate(LOGIN);
        dispatch({
          type: loginActionTypes.LOGOUT,
        });
      });
  };
};
