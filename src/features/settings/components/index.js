import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles.js';
import {Button} from '../../../components';
import {ADD_DEVICE} from '../../../navigation/screen_names';

export default class SettingsApp extends Component {
  onLogOutPress = () => {
    this.props.logOut(this.props.navigation);
  };

  onAddDevicePress = () => {
    this.props.navigation.navigate(ADD_DEVICE);
  };

  render() {
    console.log(this.props);
    return (
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <Button onPress={() => this.onAddDevicePress()}>ADD DEVICE</Button>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={() => this.onLogOutPress()}>LOG OUT</Button>
        </View>
        <View style={styles.biggerContainer} />
      </View>
    );
  }
}
