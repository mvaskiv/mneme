import React from 'react';
import { Platform, StatusBar, StyleSheet } from 'react-native';
import { AppLoading, Asset, Font, Icon } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaView } from 'react-navigation';

import PouchDB from 'pouchdb-react-native'
PouchDB.plugin(require('pouchdb-find'));

export default class App extends React.Component {
  constructor() {
    super();
    this.state = {
      isLoadingComplete: false,
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      )
    } else {
      return (
        <SafeAreaView style={styles.container} forceInset={{ bottom: 'always' }}>
          {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
          <AppNavigator />
        </SafeAreaView>
      )
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Font.loadAsync({
        ...Icon.Ionicons.font,
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(250,250,253,0.95)',
  },
});
