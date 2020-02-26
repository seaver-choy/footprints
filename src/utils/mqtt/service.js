import {Alert} from 'react-native';

import init from './index';

init();

class MqttService {
  static instance = null;

  static getInstance() {
    if (!MqttService.instance) {
      MqttService.instance = new MqttService();
    }

    return MqttService.instance;
  }

  constructor() {
    const clientId = '';

    this.client = new Paho.MQTT.Client(
      'ws://io.adafruit.com:80/jessiesalvador/feeds',
      clientId,
    );

    this.client.onMessageArrived = this.onMessageArrived;

    this.callbacks = {};

    this.onSuccessHandler = undefined;

    this.onConnectionLostHandler = undefined;

    this.isConnected = false;
  }

  connectClient = (onSuccessHandler, onConnectionLostHandler) => {
    this.onSuccessHandler = onSuccessHandler;

    this.onConnectionLostHandler = onConnectionLostHandler;

    this.client.onConnectionLost = () => {
      this.isConnected = false;

      onConnectionLostHandler();
    };

    this.client.connect({
      timeout: 10,

      onSuccess: () => {
        this.isConnected = true;

        onSuccessHandler();
      },

      useSSL: false,

      onFailure: this.onFailure,

      reconnect: true,

      keepAliveInterval: 60,

      cleanSession: true,

      userName: 'jessiesalvador',

      password: 'b018410f9a0b4934abe1c0dd1089f3ea',
    });
  };

  onFailure = ({errorMessage}) => {
    console.info(errorMessage);

    this.isConnected = false;

    Alert.alert(
      'MQTT Connetion Failed',
      'Could not connect to MQTT',
      [
        {
          text: 'TRY AGAIN',
          onPress: () =>
            this.connectClient(
              this.onSuccessHandler,
              this.onConnectionLostHandler,
            ),
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  onMessageArrived = message => {
    const {payloadString, topic} = message;
    console.log(message.topic);
    console.log(message.payloadString);
    console.log(message.payloadBytes);
    console.log(message.qos);
    console.log(message.retained);
    console.log(message.duplicate);
    console.log(message);
    this.callbacks[topic](payloadString);
  };

  publishMessage = (topic, message) => {
    if (!this.isConnected) {
      console.info('not connected');

      return;
    }

    this.client.publish(topic, message);
  };

  subscribe = (topic, callback) => {
    if (!this.isConnected) {
      console.info('not connected');

      return;
    }
    console.log(topic);
    this.callbacks[topic] = callback;

    this.client.subscribe(topic);
  };

  unsubscribe = topic => {
    if (!this.isConnected) {
      console.info('not connected');

      return;
    }

    delete this.callbacks[topic];

    this.client.unsubscribe(topic);
  };
}

export default MqttService.getInstance();
