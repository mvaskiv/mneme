import React from 'react';
import { Platform, Animated,
  Easing, Text, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import Expo, { AppLoading, Asset, Font, Icon, Permissions, SQLite, Ionicons } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import PouchDB from 'pouchdb-react-native'
PouchDB.plugin(require('pouchdb-find'));
const db = new PouchDB('mydb')
// .on('change', function (change) {
//   console.log('change')
// }).on('paused', function (info) {
//   console.log('pause')
// }).on('active', function (info) {
//   console.log('resume')
// }).on('error', function (err) {
//   console.log('fucked')
// });

// const db = SQLite.openDatabase('mneme.db');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      lock: false,
      authorised: false,
      spin: new Animated.Value(0),
      syncing: false,
    }
    this._bootstrapAsync();
  }

  _animationLoop = () => {
    this.state.spin.setValue(0);
    Animated.timing(this.state.spin, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      this.setState({weatherLoad: this.state.weatherLoad + 1});
      if (this.state.weatherLoad < 5) {
        this._animationLoop()
      }
    });
  }

  // componentDidMount() {
  
  // }

  // _newUuid = async () => {
  //   this._bootstrapAsync().then(() => {
  //     this._fullSync()
  //   })
  // }

  _fullSync = () => {
    db.changes({
      since: 0,
      include_docs: true
    }).on('change', () => this.setState({syncing: false}))
    .on('error', function (err) {
      console.error(err);
    });
  }

  _dbSync = (uuid) => {
    const remoteDB = new PouchDB('https://mneme-app.herokuapp.com/db/' + uuid)
    db.sync(remoteDB, {
      live: true,
      retry: true
    })
    db.changes({
      since: 'now',
      live: true,
      include_docs: true
    }).on('change', () => this.forceUpdate())
    .on('error', function (err) {
      console.error(err);
    });
  }

  _bootstrapAsync = async () => {
    // await AsyncStorage.setItem('uuid', '2ce029af-4452-493e-9f06-98d2a4e46675');
    await AsyncStorage.getItem('uuid').then((uuid) => {
      if (!uuid) {
        fetch('https://mneme-app.herokuapp.com/init', {method: 'GET'})
        .then((response) => response.json())
        .then((res) => {
          if (res.uuid) {
            AsyncStorage.setItem('uuid', res.uuid)
            this._dbSync(res.uuid)
          }
        })
      } else {
        console.log(uuid)
        this._dbSync(uuid.toString())
      }
    })
    
    
    // setTimeout(() => db.transaction(tx => {
    //   tx.executeSql(
    //     `create table if not exists tasks (id integer primary key not null, text text, hours int, minutes int, day int, date int, month int, due int, completed int default 0, reminder text, tag text);`
    //   );
    // }), 0);
    
    AsyncStorage.getItem('biometry')
      .then((res) => {
        if (res && res === '1') {
          this._biometrics();
          this.setState({lock: true});
        }
      })
      .catch((error) => {
        console.log(error);
    });
  }

  _biometrics = async () => {
    // let navigate = this.props.navigation;
    if (Expo.Fingerprint.isEnrolledAsync() && !this.state.authorised) {
    Expo.Fingerprint.authenticateAsync()
        .then(async (res) => {
            if (res.success) {
              console.log(res);
                await this.setState({ authorised: true });
                // this.props.navigation.navigate('App');
            }
        })
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen 
      || this.state.lock ? !this.state.authorised : 0) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <AppNavigator auth={this.state.authorised} zaza={'zaza'} />
        </View>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
