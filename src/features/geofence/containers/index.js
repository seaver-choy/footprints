import {connect} from 'react-redux';
import Component from '../components';
import {setMarker} from '../actions';

const mapStateToProps = state => {
  return {
    geofenceMarker: state.geofence.geofenceMarker,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setMarker: (latitude, longitude, radius, navigation) =>
      dispatch(setMarker(latitude, longitude, radius, navigation)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
