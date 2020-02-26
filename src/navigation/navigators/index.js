import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import AuthNavigator from './authentication';
import {MainNav} from './main';
import * as screenNames from '../screen_names';

export const createRootNavigator = (signedIn = false) => {
  const switchNav = createSwitchNavigator(
    {
      [screenNames.AUTHENTICATION]: {
        screen: AuthNavigator,
      },

      [screenNames.MAIN]: {
        screen: MainNav,
      },
    },
    {
      headerMode: 'none',
      initialRouteName: signedIn
        ? screenNames.MAIN
        : screenNames.AUTHENTICATION,
    },
  );

  return createAppContainer(switchNav);
};
