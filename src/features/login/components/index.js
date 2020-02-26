import React, {Component} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {Input, Button, Spinner} from '../../../components';
import styles from './styles';

export default class LoginApp extends Component {
  state = {
    username: '',
    password: '',
  };

  onButtonPress() {
    this.props.login(
      this.state.username,
      this.state.password,
      this.props.navigation,
    );
  }

  onRegisterPress() {
    this.props.navigation.navigate('Register');
  }

  onUsernameChange(username) {
    this.setState({username: username});
  }

  onPasswordChange(password) {
    this.setState({password: password});
  }

  renderButton() {
    if (this.props.loggingIn) {
      return <Spinner />;
    } else {
      return <Button onPress={this.onButtonPress.bind(this)}>LOGIN</Button>;
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{flex: 5}} />
        <View style={styles.input}>
          <Input
            name="email"
            style={styles.inputStyle}
            placeholder="Email Address"
            keyboardType="email-address"
            autoCapitalize="none"
            value={this.state.username}
            onChangeText={text => this.onUsernameChange(text)}
            multiline={false}
          />
        </View>
        <View style={styles.input}>
          <Input
            name="pass"
            style={styles.inputStyle}
            placeholder="Password"
            onChangeText={text => this.onPasswordChange(text)}
            value={this.state.password}
            secureTextEntry
            multiline={false}
          />
        </View>
        <View style={styles.input}>{this.renderButton()}</View>
        <View>
          <TouchableOpacity onPress={this.onRegisterPress.bind(this)}>
            <Text style={styles.textStyle}>
              {' '}
              Don't have an account? Click here.{' '}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flex: 5}} />
      </View>
    );
  }
}
