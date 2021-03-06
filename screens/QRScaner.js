import React, { Component } from 'react';
import { LayoutAnimation, AlertIOS, Animated, Easing} from 'react-native';
import { BarCodeScanner, Permissions, Icon, Ionicons } from 'expo';
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
            spin: new Animated.Value(0),
            syncing: false,
        }
    }
    _handleBarCodeScanned = async ({ type, data }) => {
        await this.setState({scanned: true});
        Vibration.vibrate();
        AsyncStorage.setItem('uuid', data).then(() => {
            this._newUuid(data)
        })
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

    _newUuid = (uuid) => {
        this.setState({syncing: true}, () => this._dbSync(uuid));
    }

    // _fullSync = async () => {
    //     await db.changes({
    //         since: 0,
    //         include_docs: true
    //     }).on('complete', () => {
    //         this.props.navigation.state.params.refresh()
    //     })
    // }

    _dbSync = async (uuid) => {
        const remoteDB = await new PouchDB('https://mneme-app.herokuapp.com/db/' + uuid)
        await db.sync(remoteDB, {
            // live: true,
            live: false,
            retry: true
        }).on('complete', () => {
            db.changes({
                since: 0,
                live: false,
                include_docs: true
            }).on('complete', () => {
                this.props.navigation.state.params.refresh()
            })
        })
        return true
    }

    render() {
        if (this.state.syncing) {
            const spin = this.state.spin.interpolate({
              inputRange: [0, 1],
              outputRange: ['0deg', '360deg']
            });
            this._animationLoop()
            return (
              <View style={{flex: 1, backgroundColor: '#fff'}}>
                <View style={{flex: 1}}>
                    <Text style={{position: 'relative', width: 150, height: 100, marginLeft: 'auto', marginRight: 'auto', marginBottom: 'auto', marginTop: 'auto', color: '#c41313', fontSize: 32, textAlign: 'center'}}>Syncing...</Text>
                    <Animated.View style={{transform: [{rotate: spin}], position: 'relative', width: 50, height: 50, marginLeft: 'auto', marginRight: 'auto', marginBottom: 'auto', marginTop: 'auto'}}>
                      <Icon.Ionicons style={{position: 'absolute', color: '#c41313', top: 0, textAlign: 'center', fontSize: 50}} name="ios-sync" />
                    </Animated.View>
                </View>
              </View>
            )
        } else {
            return (        
                <View style={{flex: 1, backgroundColor: '#fff'}}>
                    {/* <TouchableOpacity onPress={() => this._handleBarCodeScanned({ type: 'qwe', data: '2ce029af-4452-493e-9f06-98d2a4e46675'})}>
                        <Text style={{color: '#000'}}>back</Text>
                    </TouchableOpacity> */}
                    {!this.state.scanned && <BarCodeScanner
                        type={BarCodeScanner.Constants.Type.back}
                        onBarCodeScanned={this._handleBarCodeScanned}
                        style={{ flex: 1 }}
                    /> }
                </View>
            );
        }
    }
}
