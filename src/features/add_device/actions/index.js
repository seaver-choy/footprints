import * as actionTypes from './actionTypes';
import axios from '../../../utils/adafruit-axios-instance';

export const getDevices = () => {
  return dispatch => {
    dispatch({
      type: actionTypes.SET_LOADING,
      payload: true,
    });
    return axios.get('feeds').then(res => {
      const feeds = res.data.map(data => {
        return axios.get('feeds/' + data.id + '/data').then(feedData => {
          const filteredArray = feedData.data.filter(dirtyData => {
            if (dirtyData.lat && dirtyData.lon) {
              const parsedLat = parseFloat(dirtyData.lat);
              const parsedLon = parseFloat(dirtyData.lon);

              return (
                parsedLat >= -90 &&
                parsedLat <= 90 &&
                parsedLon >= -180 &&
                parsedLon <= 180
              );
            } else {
              return true;
            }
          });
          return {
            deviceName: data.name,
            id: data.id,
            data: filteredArray,
          };
        });
      });
      Promise.all(feeds).then(finishedFeeds => {
        dispatch({
          type: actionTypes.SET_FEEDS,
          payload: finishedFeeds,
        });
        dispatch({
          type: actionTypes.SET_SELECTED_DEVICE,
          payload: finishedFeeds[0].id,
        });
        dispatch({
          type: actionTypes.SET_LOADING,
          payload: false,
        });
      });
    });
  };
};
