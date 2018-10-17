import React, { Component } from 'react';
import { LayoutAnimation, AlertIOS } from 'react-native';
import { BarCodeScanner, Permissions } from 'expo';
import {
    Text,
    TouchableOpacity,
    View,
    Vibration,
  } from 'react-native';
  
  export default class QRScaner extends React.Component {
      
    _handleBarCodeScanned = ({ type, data }) => {
        Vibration.vibrate();
        AlertIOS.alert(`Bar code with type ${type}`, `and data ${data} has been scanned!`, [{
          text: 'Cancel',
          onPress: () => null,
          style: 'cancel',
        }]);
      }

    render() {
        return (        
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <BarCodeScanner
                    type={BarCodeScanner.Constants.Type.back}
                    onBarCodeScanned={this._handleBarCodeScanned}
                    style={{ flex: 1 }}
                    />
            </View>
        );
    }
}
