import React from 'react';
import { createSwitchNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import AuthStack from '../screens/authScreen';
import History from '../screens/History';
import NoteView from '../screens/NoteView';

export default createStackNavigator({
  // You could add another route here for authentication.
  // Read more at https://reactnavigation.org/docs/en/auth-flow.html
  // Main: AuthStack,
  Main: {
    screen: MainTabNavigator,
    navigationOptions:{tabBarVisible: false}
  },
  History: History,
  Note: NoteView,
},
{
  headerMode: 'none',
  navigationOptions: {
      headerVisible: false,
  },
  tabBarVisible: false
})