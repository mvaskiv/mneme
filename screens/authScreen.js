import React, { Component } from 'react';
import { View, Text } from 'react-native'; 
import { createSwitchNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';

class AuthScreen extends React.Component {
    constructor() {
        super();
        this.state = {
            authorised: false,
        };
    };

    componentDidMount() {
        this._biometrics();
    }

    _biometrics = async () => {
        // let navigate = this.props.navigation;
        console.log(this.props);
        if (Expo.Fingerprint.isEnrolledAsync() && !this.state.authorised) {
        Expo.Fingerprint.authenticateAsync()
            .then(async (res) => {
                if (res) {
                    await this.setState({ authorised: true });
                    this.props.navigation.navigate('App');
                }
            })
        }
    }

    render() {
        return <View><Text></Text></View>
    }
}

const AuthStack = createStackNavigator({
    Settings: AuthScreen,
  });
  
  AuthStack.navigationOptions = {
    tabBarLabel: 'Auth',
    tabBarIcon: ({ focused }) => (
      <TabBarIcon
        focused={focused}
        name={Platform.OS === 'ios' ? `ios-options${focused ? '' : '-outline'}` : 'md-options'}
      />
    ),
  };


export default AuthStack