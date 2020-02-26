import {createStackNavigator} from 'react-navigation-stack';
import HOME from '../../features/home/containers';
import SETTINGS from '../../features/settings/containers';
import GEOFENCE from '../../features/geofence/containers';
import ADD_DEVICE from '../../features/add_device/containers';
import * as screenNames from '../screen_names';

export const MainNav = createStackNavigator(
  {
    [screenNames.HOME]: {screen: HOME},
    [screenNames.SETTINGS]: {screen: SETTINGS},
    [screenNames.GEOFENCE]: {screen: GEOFENCE},
    [screenNames.ADD_DEVICE]: {screen: ADD_DEVICE},
  },
  {
    initialRouteName: screenNames.HOME,
  },
);
