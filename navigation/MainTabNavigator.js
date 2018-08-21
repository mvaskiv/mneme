import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigatorm, createMaterialTopTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import LinksScreen from '../screens/LinksScreen';
import Archive from '../screens/SettingsScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'To Do',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const LinksStack = createStackNavigator({
  Links: LinksScreen,
});

LinksStack.navigationOptions = {
  tabBarLabel: 'notes',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-link${focused ? '' : '-outline'}` : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: Archive,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'History',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
    />
  ),
};

export default createMaterialTopTabNavigator({
  ToDO: {
    screen:HomeStack
  },
  Fuckery: {
    screen: LinksStack
  },
  ToForget: {
    screen: SettingsStack
  }
},
{
  tabBarOptions: {
    style: {
      paddingTop: Expo.Constants.statusBarHeight,
      backgroundColor: '#fff',
      // display: 'none',
    },
    labelStyle: {
      fontWeight: 'bold'
    },
    indicatorStyle: {
      backgroundColor: '#c43131',
      height: 1,
    },
    inactiveTintColor: '#333',
    activeTintColor: '#c43131',
  },
  swipeEnabled: true,
  animationEnabled: true,
});
