import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
import {Button} from '../../../components';
import MapView, {Marker, PROVIDER_GOOGLE, Circle} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';

export default class GeoFenceApp extends Component {
  state = {
    region: this.props.geofenceMarker
      ? {
          latitude: this.props.geofenceMarker.latlng.latitude,
          longitude: this.props.geofenceMarker.latlng.longitude,
          latitudeDelta: this.props.geofenceMarker.radius / 40000,
          longitudeDelta: 0.0001,
        }
      : null,
    radius: 0,
  };

  onSetMarkerPress = (latitude, longitude, radius) => {
    this.props.setMarker(latitude, longitude, radius, this.props.navigation);
  };
  onRegionChange = (region, radius) => {
    this.setState({region: region, radius: radius});
  };

  renderMapView() {
    if (this.state.region) {
      const latlng = {
        latitude:
          this.state.region.latitude ||
          this.props.geofenceMarker.latlng.latitude,
        longitude:
          this.state.region.longitude ||
          this.props.geofenceMarker.latlng.longitude,
      };
      const radius = this.state.region.latitudeDelta * 40000;

      return (
        <MapView
          provider={PROVIDER_GOOGLE}
          region={this.state.region}
          onRegionChangeComplete={region => this.onRegionChange(region, radius)}
          style={styles.mapContainer}>
          <Circle center={latlng} radius={radius} tracksViewChanges={false} />
        </MapView>
      );
    } else {
      return <View style={styles.mapContainer} />;
    }
  }

  renderButton() {
    if (!this.props.geofenceMarker) {
      return (
        <Button
          onPress={() =>
            this.onSetMarkerPress(
              this.state.region.latitude,
              this.state.region.longitude,
              this.state.radius,
            )
          }>
          Add Geofence
        </Button>
      );
    } else {
      return (
        <Button
          onPress={() =>
            this.onSetMarkerPress(
              this.state.region.latitude,
              this.state.region.longitude,
              this.state.radius,
            )
          }>
          Change Geofence
        </Button>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.biggerContainer}>
          <GooglePlacesAutocomplete
            placeholder="Search for a location"
            minLength={2}
            autoFocus={false}
            returnKeyType={'search'}
            keyboardAppearance={'light'}
            listViewDisplayed="auto"
            fetchDetails={true}
            currentLocation={false}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              console.log(data, details);
              const region = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001,
              };
              this.setState({region: region});
            }}
            query={{
              key: 'AIzaSyB0xScHzJIdVc8RceHSbJeGzCbQAeKSg4s',
              language: 'en',
            }}
            nearbyPlacesAPI="GooglePlacesSearch"
            styles={{
              textInputContainer: {
                backgroundColor: 'rgba(0,0,0,0)',
                borderTopWidth: 0,
                borderBottomWidth: 0,
              },
              textInput: {
                marginLeft: 0,
                marginRight: 0,
                height: 38,
                color: '#5d5d5d',
                fontSize: 16,
              },
              predefinedPlacesDescription: {
                color: '#1faadb',
              },
            }}
          />
        </View>
        {this.renderMapView()}
        <View style={styles.buttonContainer}>{this.renderButton()}</View>
      </View>
    );
  }
}
