import {createStackNavigator} from 'react-navigation-stack';
import Login from '../../features/login/container';
import Register from '../../features/register/container';
import * as screenNames from '../screen_names';

export default createStackNavigator(
  {
    [screenNames.LOGIN]: {screen: Login},
    [screenNames.REGISTER]: {screen: Register},
  },
  {
    headerMode: 'screen',
    initialRouteName: screenNames.LOGIN,
  },
);
