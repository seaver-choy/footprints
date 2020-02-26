import {connect} from 'react-redux';
import Component from '../components';
import {login} from '../actions';

const mapStateToProps = state => {
  return {
    loggingIn: state.auth.loggingIn,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: (username, password, navigation) =>
      dispatch(login(username, password, navigation)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
