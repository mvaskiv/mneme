import React, { Component } from 'react';
import { LayoutAnimation, AlertIOS } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import PouchDB from 'pouchdb-react-native'
import {
    Text,
    TouchableOpacity,
    View,
    Vibration,
    AsyncStorage,
  } from 'react-native';
  const db = new PouchDB('mydb')
  
  export default class QRScaner extends React.Component {
    constructor() {
        super();
        this.state = {
            scanned: false,
        }
    }
    _handleBarCodeScanned = async ({ type, data }) => {
        this.setState({scanned: true});
        Vibration.vibrate();
        await AsyncStorage.setItem('uuid', data).then(() => {
            this.props.navigation.navigatie('MenuS', { refresh: true });
            // const remoteDB = new PouchDB('https://mneme-app.herokuapp.com/db/' + data)
            // db.sync(remoteDB, {
            // retry: true
            // }).then(() => {
            //     db.changes({
            //         since: 0,
            //         live: true,
            //         include_docs: true
            //     });
                
            // })
        })
      }

    render() {
        return (        
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                {!this.state.scanned && <BarCodeScanner
                    type={BarCodeScanner.Constants.Type.back}
                    onBarCodeScanned={this._handleBarCodeScanned}
                    style={{ flex: 1 }}
                /> }
            </View>
        );
    }
}
