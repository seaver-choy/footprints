import * as actions from '../actions/actionTypes';

const INITIAL_STATE = {
  region: {
    latitude: 14.5647294,
    longitude: 120.9931816,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  },
  markers: [
    {
      latlng: {
        latitude: 14.5647294,
        longitude: 120.9931816,
      },
      title: 'meh',
      description: 'meh',
    },
  ],
  isConnected: false,
  feeds: [],
  loading: false,
  selectedDevice: '',
  currentLocation: null,
  geofenceMarker: null,
  battery: 0,
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actions.IS_CONNECTED:
      return {
        ...state,
        isConnected: action.isConnected,
      };
    case actions.CHANGE_REGION:
      return {
        ...state,
        region: action.region,
      };
    case actions.UPDATE_CURRENT_LOCATION:
      return {
        ...state,
        currentLocation: action.payload,
      };
    case actions.UPDATE_GEOFENCE:
      return {
        ...state,
        geofenceMarker: action.payload,
      };
    case actions.UPDATE_BATTERY:
      return {
        ...state,
        battery: action.battery,
      };
    case actions.SET_FEEDS:
      return {
        ...state,
        feeds: action.payload,
      };

    case actions.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case actions.SET_SELECTED_DEVICE:
      return {
        ...state,
        selectedDevice: action.payload,
      };
    default:
      return state;
  }
};
