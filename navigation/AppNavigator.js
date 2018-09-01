import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import { Icon } from 'expo';
import { MaterialIcons, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { createSwitchNavigator, createMaterialTopTabNavigator, createStackNavigator, NavigationActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Todos from '../screens/HomeScreen';
import NotesList from '../screens/LinksScreen';
import AuthStack from '../screens/authScreen';
import History from '../screens/History';
import Menu from '../screens/Menu';
import NoteView from '../screens/NoteView';
import NewNote from '../screens/NewNote';
import Settings from '../screens/SettingsScreen';

const NotesStack = createStackNavigator({
  Notes: {
    screen: NotesList,
    navigationOptions:{
      // headerBackTitle: null,
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
      title: 'All Notes',
      
    }
  },
  Note: {
    screen: NoteView,
    navigationOptions: {
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
    }
  },
  NewNote: {
    screen: NewNote,
    navigationOptions: {
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
    }
  }
},
{
  headerMode: 'float',
  headerTransitionPreset: 'uikit',
  navigationOptions: {
    gestureResponseDistance: {
      horizontal: 10,
    },
    headerTintColor: '#c43131',
    headerStyle: {
      backgroundColor: '#fff',
    }
  },
});

export default createStackNavigator({
  Menu: {
    screen: Menu,
    navigationOptions: {
      headerLeft: <Text style={{ color: '#c43131', fontWeight: 'bold', fontSize: 28, paddingHorizontal: 12, paddingTop: 12 }}>Folders</Text>,
      // headerRight: <SettingsBtn />,
      headerBackTitle: null,
      headerTintColor: '#c43131',
      headerStyle: {
        // height: 57,
        borderBottomWidth: 0,        
        backgroundColor: '#fff'
      },
    }
  },
  todos: {
    screen: Todos,
    navigationOptions:{
      headerTintColor: '#c43131',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
      title: 'Tasks',
    }
  },
  notes: {
    screen: NotesStack,
    navigationOptions: {
      header: null,
    }
  },
    // navigationOptions:{
    //   title: '',
    //   headerTintColor: '#c43131',
    //   headerStyle: {
    //     backgroundColor: '#fff'
    //   }
      // path: 
    
  History: {
    screen: History,
  },
  Settings: {
    screen: Settings,
    title: 'Settings',
    navigationOptions: {
      headerBackTitle: null,
    }
  }
},
{
  // initialRouteName: 'Notes',
  headerMode: 'screen',
  // headerTransitionPreset: 'uikit',
  navigationOptions: {
    gestureResponseDistance: {
      horizontal: 10,
    },
    headerTintColor: '#c43131',
    headerStyle: {
      backgroundColor: '#fff',
    }
  },
})