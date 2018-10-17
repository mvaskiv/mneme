import React from 'react';
import {TouchableHighlight, Text} from 'react-native';
import { Icon } from 'expo';
import { MaterialIcons, SimpleLineIcons, Ionicons } from '@expo/vector-icons';
import { createSwitchNavigator, createDrawerNavigator, createMaterialTopTabNavigator, createStackNavigator, NavigationActions } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
import Todos from '../screens/HomeScreen';
import NotesList from '../screens/LinksScreen';
import AuthStack from '../screens/authScreen';
import History from '../screens/History';
import Menu from '../screens/Menu';
import NoteView from '../screens/NoteView';
import NewNote from '../screens/NewNote';
import Settings from '../screens/SettingsScreen';
import Subfolder from '../screens/SubfolderScreen';
import SmartTags from '../screens/SmartTags';
import QRScaner from '../screens/QRScaner'; 


// const SubfolderStack = createStackNavigator({
//   Subfolder: {
//     screen: Subfolder,
//     navigationOptions: {
//       headerStyle: {
//         borderBottomWidth: 0,
//         backgroundColor: '#fff',
//       },
//     },
//   },
// },
// {
//   headerMode: 'float',
//   mode: 'modal',
//   headerTransitionPreset: 'uikit',
//   navigationOptions: {
//     gestureResponseDistance: {
//       horizontal: 10,
//     },
//     headerTintColor: '#c43131',
//     headerStyle: {
//       backgroundColor: '#fff',
//     }
//   },
// });


const NotesStack = createStackNavigator({
  Notes: {
    screen: NotesList,
    navigationOptions: ({ navigation }) => ({
      title: navigation.state.params.caption,
      headerBackTitleVisible: true,
      headerTruncatedBackTitle: 'All Notes',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
      
    }),
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
  },
  Subfolder: {
    screen: Subfolder,
    navigationOptions: {
      headerTitle: 'Trash',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
    }
  },
},
{
  headerMode: 'float',
  // mode: 'modal',
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

const MenuN = createMaterialTopTabNavigator({
   SmartTagsS: {
      screen: SmartTags,
      navigationOptions: {
        tabBarVisible: false,
      },
    },
    MenuS: {
      screen: Menu,
      navigationOptions: {
      // headerLeft: <Text style={{ color: '#c43131', fontWeight: 'bold', fontSize: 28, paddingHorizontal: 12, paddingTop: 12 }}>Folders</Text>,
      // headerRight: <SettingsBtn />,
        tabBarVisible: false,
      },
    },
    SettingsS: {
      screen: Settings,
      navigationOptions: {
      // headerLeft: <Text style={{ color: '#c43131', fontWeight: 'bold', fontSize: 28, paddingHorizontal: 12, paddingTop: 12 }}>Folders</Text>,
      // headerRight: <SettingsBtn />,
        tabBarVisible: false,
      },
    },
   
  },
  {
    initialRouteName: 'MenuS',
    lazy: true
  }
);


export default createStackNavigator({
  Menu: {
    screen: MenuN,
    navigationOptions: {
      // headerLeft: <Text style={{ color: '#c43131', fontWeight: 'bold', fontSize: 28, paddingHorizontal: 12, paddingTop: 12 }}>Folders</Text>,
      // headerRight: <SettingsBtn />,
      // headerBackTitle: null,
      // headerTintColor: '#c43131',
      // headerStyle: {
        // height: 57,
        // borderBottomWidth: 0,        
        // backgroundColor: '#fff'
      // },
      header: null,
    }
  },
  tasks: {
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
  NewNoteM: {
    screen: NewNote,
    navigationOptions: {
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
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
  },
  Scanner: {
    screen: QRScaner,
    navigationOptions: {
      title: 'Sync',
      headerTintColor: '#c43131',
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