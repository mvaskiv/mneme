import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage } from 'react-native';
import Expo, { AppLoading, Asset, Font, Icon, Permissions, SQLite } from 'expo';
import AppNavigator from './navigation/AppNavigator';

const db = SQLite.openDatabase('mneme.db');

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
      lock: false,
      authorised: false,
    }
    this._bootstrapAsync();
  }

  // componentDidMount() {
  
  // }

  _bootstrapAsync = async () => {
    await db.transaction(tx => {
      tx.executeSql(
        `create table if not exists tasks (id integer primary key not null, text text, hours int, minutes int, day int, date int, month int, due int, completed int default 0, archive int default 0);`
        // `drop table notes;`
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        // `drop table tasks;`
        `create table if not exists notes (id integer primary key not null, header text, text text, hours int, minutes int, day int, date int, month int, due int, folder int, deleted int default 0, archive int default 0);`
        // `create table if not exists img (id integer primary key not null, src text, note int);`
      );
    });
    db.transaction(tx => {
      tx.executeSql(
        // `drop table folders;`
        `create table if not exists folders (id integer primary key not null, name text, type int, route text, size int);`
      );
    });
    await AsyncStorage.getItem('biometry')
      .then((res) => {
        if (res && res === '1') {
          console.log('biometry: ' + res);
          this._biometrics();
          this.setState({lock: true});
        }
      })
      .catch((error) => {
        console.log(error);
    });
    this._setBadge();
  }

  _setBadge = () => {
    let today = new Date().getDay();
    
    db.transaction(async tx => {
      tx.executeSql(`select count(*) from tasks where completed = 0 and due = ?`, [today],
        (_, { rows: { _array } }) => {
          if (_array[0]['count(*)'] && _array[0]['count(*)'] > 0) {
            Expo.Notifications.setBadgeNumberAsync(_array[0]['count(*)']);
          } else {
            Expo.Notifications.setBadgeNumberAsync(0);
          }
        }
      );
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

  // async componentWillMount() {
  //   console.log(this.state.authorised);
  //   this.state.lock ?  : null;
  // }

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
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator auth={this.state.authorised} />
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
