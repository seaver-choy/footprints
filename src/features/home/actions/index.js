import * as actionTypes from './actionTypes';
import axios from '../../../utils/adafruit-axios-instance';
import MQTTService from '../../../utils/mqtt/service';
import firebase from 'react-native-firebase';

export const onRegionChange = region => {
  return {
    type: actionTypes.CHANGE_REGION,
    region: region,
  };
};

export const setLoading = loading => {
  return {
    type: actionTypes.SET_LOADING,
    payload: loading,
  };
};

export const setSelectedDevice = device => {
  return {
    type: actionTypes.SET_SELECTED_DEVICE,
    payload: device,
  };
};

export const subscribeToMQTT = () => {
  return (dispatch, getState) => {
    if (!MQTTService.isConnected) {
      MQTTService.connectClient(
        () => MQTTSuccessHandler(dispatch, getState),
        MQTTConnectionLostHandler,
      );
    } else {
      MQTTSuccessHandler(dispatch, getState);
      dispatch({
        type: actionTypes.IS_CONNECTED,
        isConnected: true,
      });
    }
  };
};

export const unsubscribeToMQTT = () => {
  return (dispatch, getState) => {
    MQTTService.unsubscribe(
      `jessiesalvador/feeds/${getState().geofence.device.locationKey}/csv`,
    );
    MQTTService.unsubscribe(
      `jessiesalvador/feeds/${getState().geofence.device.batteryKey}`,
    );
    dispatch({
      type: actionTypes.IS_CONNECTED,
      isConnected: false,
    });
  };
};

export const setRegion = region => {
  return {
    type: actionTypes.CHANGE_REGION,
    region: region,
  };
};

const MQTTSuccessHandler = (dispatch, getState) => {
  console.info('connected to mqtt');
  console.log(getState().geofence.device.locationKey);
  console.log(getState().geofence.device.batteryKey);
  MQTTService.subscribe(
    `jessiesalvador/feeds/${getState().geofence.device.locationKey}/csv`,
    message => onLocation(message, dispatch, getState),
  );
  MQTTService.subscribe(
    `jessiesalvador/feeds/${getState().geofence.device.batteryKey}`,
    message => onBattery(message, dispatch, getState),
  );
  dispatch({
    type: actionTypes.IS_CONNECTED,
    isConnected: true,
  });
};

const onBattery = (message, dispatch, getState) => {
  const batteryPercentage = parseInt(message);
  console.log(batteryPercentage);
  dispatch({
    type: actionTypes.UPDATE_BATTERY,
    battery: batteryPercentage,
  });
};

const onLocation = (message, dispatch, getState) => {
  const stringArray = message.split(',');
  const parsedLat = parseFloat(stringArray[1].split('e')[0]);
  const parsedLon = parseFloat(stringArray[2].split('e')[0]);
  console.log(parsedLat);
  console.log(parsedLon);
  if (
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLon >= -180 &&
    parsedLon <= 180
  ) {
    const latlng = {
      latitude: parsedLat,
      longitude: parsedLon,
    };
    console.log(latlng);
    dispatch({
      type: actionTypes.UPDATE_CURRENT_LOCATION,
      payload: latlng,
    });
    const geofenceMarker = getState().geofence.geofenceMarker;
    const distanceFromCenter = Haversine(
      geofenceMarker.latlng.latitude,
      geofenceMarker.latlng.longitude,
      parsedLat,
      parsedLon,
    );

    if (distanceFromCenter > geofenceMarker.radius) {
      const notification = new firebase.notifications.Notification()
        .setNotificationId('notificationId')
        .setTitle('GEOFENCE ALERT')
        .setBody('Current Registered Device is out of geofence bounds');
      notification.android.setChannelId('Alert');
      firebase.notifications().displayNotification(notification);
    }
  }
};

const MQTTConnectionLostHandler = () => {
  console.info('disconnected from mqtt');
  return {
    type: actionTypes.IS_CONNECTED,
    isConnected: false,
  };
};

Number.prototype.toRad = function() {
  return (this * Math.PI) / 180;
};

const Haversine = (lat1, lon1, lat2, lon2) => {
  var R = 6371 * 1000; // km * 1000 = m
  //has a problem with the .toRad() method below.
  var x1 = lat2 - lat1;
  var dLat = x1.toRad();
  var x2 = lon2 - lon1;
  var dLon = x2.toRad();
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1.toRad()) *
      Math.cos(lat2.toRad()) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
};
