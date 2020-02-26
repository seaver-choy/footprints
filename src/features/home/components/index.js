import React, {Component} from 'react';
import {View, Text, Picker, Alert} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import {Spinner, Button} from '../../../components';
import styles from './styles';
import {SETTINGS, GEOFENCE} from '../../../navigation/screen_names';
import firebase from 'react-native-firebase';

export default class HomeApp extends Component {
  componentDidMount() {
    this.props.subscribeToMQTT();
    this.checkPermission();
    this.setNotificationChannel();
  }

  checkPermission = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      this.notificationListener = firebase
        .notifications()
        .onNotification(async notification => {
          // Display your notification
          await firebase.notifications().displayNotification(notification);
        });
    } else {
      // user doesn't have permission
      try {
        await firebase.messaging().requestPermission();
      } catch (error) {
        Alert.alert(
          'Unable to access the Notification permission. Please enable the Notification Permission from the settings',
        );
      }
    }
  };

  setNotificationChannel = () => {
    const channel = new firebase.notifications.Android.Channel(
      'Alert',
      'Alert Channel',
      firebase.notifications.Android.Importance.High,
    ).setDescription('Used for setting geofence');

    firebase.notifications().android.createChannel(channel);
  };

  onSettingsPress() {
    this.props.navigation.navigate(SETTINGS);
  }

  onGeofencePress() {
    this.props.navigation.navigate(GEOFENCE);
  }

  renderCircleMarker() {
    if (this.props.geofenceMarker) {
      return (
        <Circle
          center={this.props.geofenceMarker.latlng}
          radius={this.props.geofenceMarker.radius}
          tracksViewChanges={false}
        />
      );
    }
  }

  renderCurrentLocationMarker() {
    if (this.props.currentLocation) {
      const latlng = {
        latitude: this.props.currentLocation.latitude,
        longitude: this.props.currentLocation.longitude,
      };
      return <Marker coordinate={latlng} tracksViewChanges={false} />;
    }
  }

  renderMainView() {
    var region = null;
    if (this.props.geofenceMarker) {
      region = {
        latitude: this.props.geofenceMarker.latlng.latitude,
        longitude: this.props.geofenceMarker.latlng.longitude,
        latitudeDelta: this.props.geofenceMarker.radius / 40000,
        longitudeDelta: 0.0001,
      };
    }
    if (this.props.currentLocation) {
      region = {
        latitude: this.props.currentLocation.latitude,
        longitude: this.props.currentLocation.longitude,
        latitudeDelta: 0.001,
        longitudeDelta: 0.001,
      };
    }

    if (region) {
      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={region}
          style={styles.biggerContainer}>
          {this.renderCurrentLocationMarker()}
          {this.renderCircleMarker()}
        </MapView>
      );
    } else {
      return <View style={styles.biggerContainer} />;
    }
  }

  renderStatusText() {
    if (!this.props.isConnected) {
      return (
        <View style={styles.biggerContainer}>
          <View style={styles.centered}>
            <Text style={styles.textAlignCenter}>
              Not yet connected to feed.
            </Text>
          </View>
        </View>
      );
    } else if (!this.props.currentLocation) {
      return (
        <View style={styles.biggerContainer}>
          <View style={styles.centered}>
            <Text style={styles.textAlignCenter}>
              Connected to feed, but no valid GPS has been received.
            </Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.biggerContainer}>
          <View style={styles.centered}>
            <Text>Connected to feed.</Text>
          </View>
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderMainView()}
        <View style={styles.horizontalContainer}>
          {this.renderStatusText()}
          <View style={styles.centered}>
            <Text>{this.props.battery}%</Text>
          </View>
        </View>
        <View style={styles.containerHorizontal}>
          <View style={styles.buttonContainer}>
            <Button onPress={() => this.onGeofencePress()}>Set Geofence</Button>
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={() => this.onSettingsPress()}>Settings</Button>
          </View>
        </View>
      </View>
    );
  }
}
