import React, {Component} from 'react';
import {View} from 'react-native';
import {connect} from 'react-redux';
import {createRootNavigator} from '../navigators';

const mapStateToProps = state => ({
  loggedIn: state.auth.loggedIn,
});

const mapDispatchToProps = dispatch => {
  return {};
};

class ApplicationNavigatorContainer extends Component {
  render() {
    const Navigator = createRootNavigator(this.props.loggedIn);

    return (
      <View style={{width: '100%', height: '100%'}}>
        <Navigator />
      </View>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ApplicationNavigatorContainer);
