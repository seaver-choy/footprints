import {connect} from 'react-redux';
import Component from '../components';
import {
  onRegionChange,
  subscribeToMQTT,
  getDevices,
  setRegion,
  setSelectedDevice,
} from '../actions';

const mapStateToProps = state => {
  return {
    region: state.home.region,
    markers: state.home.markers,
    isConnected: state.home.isConnected,
    feeds: state.home.feeds,
    loading: state.home.loading,
    currentLocation: state.home.currentLocation,
    geofenceMarker: state.geofence.geofenceMarker,
    battery: state.home.battery,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRegionChange: region => dispatch(onRegionChange(region)),
    subscribeToMQTT: () => dispatch(subscribeToMQTT()),
    getDevices: () => dispatch(getDevices()),
    setRegion: region => dispatch(setRegion(region)),
    setSelectedDevice: device => dispatch(setSelectedDevice(device)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
