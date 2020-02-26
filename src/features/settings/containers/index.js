import {connect} from 'react-redux';
import Component from '../components';
import {logOut} from '../actions';

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    logOut: navigation => dispatch(logOut(navigation)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
