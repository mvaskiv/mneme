import { createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

import Todos from '../screens/HomeScreen';
import NotesList from '../screens/LinksScreen';
import History from '../screens/History';
import Menu from '../screens/Menu';
import NoteView from '../screens/NoteView';
import NewNote from '../screens/NewNote';
import Settings from '../screens/SettingsScreen';
import Subfolder from '../screens/SubfolderScreen';
import SmartTags from '../screens/SmartTags';

const NotesStack = createStackNavigator({
  Notes: {
    screen: NotesList,
    navigationOptions: ({ navigation }) => ({
      header: null,
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
      header: null,
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
      },
    }
  },
  NewNote: {
    screen: NewNote,
    navigationOptions: {
      header: null,
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
      horizontal: 100,
    },
    headerTintColor: '#c43131',
    headerStyle: {
      backgroundColor: '#fff',
    }
  },
});

const MenuN = createStackNavigator({
   SmartTagsS: {
      screen: SmartTags,
      navigationOptions: {
        tabBarVisible: false,
        header: null
      },
    },
    MenuS: {
      screen: Menu,
      navigationOptions: {
        tabBarVisible: false,
        header: null
      },
    },
    SettingsS: {
      screen: Settings,
      navigationOptions: {
        tabBarVisible: false,
        header: null
      },
    },
  },
  {
    // headerMode: 'float',
    mode: 'modal',
    headerTransitionPreset: 'uikit',
    initialRouteName: 'MenuS',
  }
);


export default createStackNavigator({
  Menu: {
    screen: MenuN,
    navigationOptions: {
      header: null,
    }
  },
  tasks: {
    screen: Todos,
    navigationOptions:{
      header: null,
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
      header: null,
    }
  },
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
  // Scanner: {
  //   screen: QRScaner,
  //   navigationOptions: {
  //     title: 'Sync',
  //     headerTintColor: '#c43131',
  //   }
  // }
},
{
  headerMode: 'screen',
  mode: 'modal',
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