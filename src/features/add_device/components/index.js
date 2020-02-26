import React, {Component} from 'react';
import {View, Text, Picker} from 'react-native';
import styles from './styles';
import {Button} from '../../../components';

export default class AddDeviceApp extends Component {
  componentDidMount() {
    this.props.getDevices();
  }

  renderPickerItems() {
    return this.props.feeds.map(item => {
      return <Picker.Item label={item.deviceName} value={item.id} />;
    });
  }

  onValueChange(value) {
    this.props.setSelectedDevice(value);
  }

  renderPicker() {
    if (!this.props.loading) {
      return (
        <Picker
          selectedValue={this.props.selectedDevice}
          onValueChange={(value, index) => this.onValueChange(value)}>
          {this.renderPickerItems()}
        </Picker>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.biggerContainer}>
          <Text>Add Device</Text>
        </View>
      </View>
    );
  }
}
