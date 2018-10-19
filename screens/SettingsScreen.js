import React, { Component } from 'react';
import { LayoutAnimation, AlertIOS } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon, Updates, BarCodeScanner, Permissions, Camera } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, FontAwesome, Foundation } from '@expo/vector-icons';
import {SettingsDividerShort, SettingsDividerLong, SettingsEditText, SettingsCategoryHeader, SettingsSwitch, SettingsPicker} from 'react-native-settings-components';
import Swipeable from 'react-native-swipeable';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  CheckBox,
  Easing,
  AsyncStorage,
  Animated,
  Vibration,
} from 'react-native';
import HomeScreen from './HomeScreen';

const db = SQLite.openDatabase('mneme.db');

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ListItemAnimation = {
  duration: 175,
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.linear,
  },
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
  delete: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.linear,
  },
};
const SwipeItemAnimation = {
  duration: 235,
  create: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
  delete: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
};
const SwipeOutItemAnimation = {
  duration: 435,
  create: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
  delete: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.linear,
  },
};

const RecoverBtn = ({onPress}) => (
  <Fab
      direction="up"
      containerStyle={{ }}
      style={{ backgroundColor: 'rgba(22,22,22,0.53)' }}
      position="bottomRight"
      onPress={onPress}>
      <Icon.MaterialIcons name={'restore'} />
  </Fab>
)

class ArchiveItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      removed: false,
    }
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
    ];
  }

  _getDueDate = () => {
    if (this.props.due && this.props.today.getDay() > this.props.due) {
      return 'Overdue';
    } else if (this.props.today.getDay() === this.props.due) {
      return 'Today';
    } else if (this.props.today.getDay() + 1 === this.props.due) {
      return 'Tomorrow';
    } else if (this.props.due === 7) {
      return 'This Week';
    } else {
      return 'Some day';
    }
  }

  _getSetDate = () => {
    if (this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      return hr + ':' + min;
    } else if (this.props.day === 6 ? this.props.today.getDay() == 0 : this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      return 'Yesterday at ' + hr + ':' + min;
    } else {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      let day = this.props.date < 10 ? '0' + this.props.date : this.props.date;
      let month = this.props.month < 10 ? '0' + this.props.month : this.props.month;
      return day + '/' + month + ' at ' + hr + ':' + min;
    }
  } 

  _swipeActivation = async (i) => {
    await LayoutAnimation.configureNext( SwipeItemAnimation );
    if (i === 1) {
      this.setState({swipeOpen: true});
    } else if (i === 0) {
      this.setState({swipeOpen: false});
    }
  }

  _swpieHandler = async (a) => {
  
  }

  // handleUserBeganScrollingParentView() {
  //   LayoutAnimation.configureNext(SwipeItemAnimation);
  //   this.swipeable.recenter();
  // }

  render() {
    const leftContent = [
      <TouchableHighlight style={{
        flex: 1,
        padding: 15,
        backgroundColor: this.state.swipeOpen ? '#c43131' : '#fff',
        }}
        underlayColor={this.state.swipeOpen ? '#c43131' : '#fff'}
        onPress={() => {this.swipeable.recenter(); this.props.done(this.props.index)}}
        >
        {!this.state.swipeOpen ? <Icon.MaterialIcons
          style={{
            position: 'absolute',
            left: 22,
            top: 15,
            fontSize: 25,
            color: '#222'}}
        name={'undo'} /> : <Icon.MaterialIcons
        style={{
          position: 'absolute',
          left: 22,
          top: 15,
          fontSize: 25,
          color: !this.state.swipeOpen ? '#c43131' : '#fff'}}
      name={'delete'} /> }
      </TouchableHighlight>,
      <TouchableHighlight style={{
        flex: 1,
        padding: 15,
        backgroundColor: this.state.swipeOpen ? '#c43131' : '#fff',
        }}
        underlayColor={this.state.swipeOpen ? '#c43131' : '#fff'}
        onPress={async () => {
          await LayoutAnimation.configureNext(SwipeItemAnimation);
          await setTimeout(() => this.setState({removed: true}), 0);
          await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
          await setTimeout(() => this.props.delete(this.props.index), 0);
          // await setTimeout(() => this.setState({removed: false}), 150);
        }}
        >
      {!this.state.swipeOpen ? <Icon.MaterialIcons
          style={{
            position: 'absolute',
            left: 22,
            top: 15,
            fontSize: 25,
            color: '#c43131'}}
        name={'delete'} /> : <Text></Text> }
      </TouchableHighlight>,   
    ];

    if (this.props.archive) {
      return (
        <Swipeable
          style={{
            right: this.state.swipeOpen ? this.state.removed ? 280 : 80 : this.state.removed ? 400 : 0,
          }}
          onRef={ref => this.swipeable = ref}
          rightButtons={leftContent}
          rightButtonWidth={70}

          rightActionActivationDistance={190}
          onRightActionActivate={ () => this._swipeActivation(1) }
          onRightActionDeactivate={ () => this._swipeActivation(0) }
          onRightActionRelease={async () => {
            await LayoutAnimation.configureNext(SwipeItemAnimation);
            await setTimeout(() => this.setState({removed: true}), 0);
            await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
            await setTimeout(() => this.props.delete(this.props.index), 0);
            // await setTimeout(() => this.setState({removed: false}), 150);
          }}

          >
          <TouchableWithoutFeedback>
            <View style={ this.props.completed ? styles.itemDone : styles.item }>
              <Text style={ this.props.completed ? styles.textDone : styles.text }>
                { this.props.text }
              </Text>
              <Text style={styles.time}>
                { this._getSetDate() }
              </Text>
              <Text style={styles.due}>
                { this.props.completed ? 'done' : this._getDueDate() }
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Swipeable>
      );
    } else {
      return null;
    }
  }
}

export default class Settings extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      biometry: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
      update: false,
      spin: new Animated.Value(0),
      loading: false,
      barcodeScanner: false,
      bardata: '',
    };
    this._bootstrapAsync();
  }
  static navigationOptions = {
    title: 'Settings'
  };

  _bootstrapAsync = async () => {
    AsyncStorage.getItem('biometry')
      .then((res) => {
        this.setState({biometry: res === '1' ? true : false});
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
      this._animationLoop()
    });
  }

  _update = async (a) => {
    this._animationLoop();
    this.setState({loading: true});
    let status = await Expo.Updates.checkForUpdateAsync();
    if (a === 0) {
      this.setState({update: status, loading: false});
    } else if (a === 1) {
      Expo.Updates.fetchUpdateAsync().then(() => Expo.Updates.reload());
    } else if (a === -1) {
      this.setState({update: false, loading: false});
    }
  }

  _biometrySet = async (i) => {
    this.setState({biometry: i});
    if (i) {
      AsyncStorage.setItem('biometry', '1');
      AlertIOS.alert(
        'Touch Id Enabled',
        'Will take effect on next launch.'
       );
    } else {
      AsyncStorage.setItem('biometry', '0');
      AlertIOS.alert(
        'Touch Id Disabled'
       );
    }
    
    console.log(i);
  }

  _scanBarcode = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    this.setState({barcodeScanner: true});
  }

  _handleBarCodeScanned = ({ type, data }) => {
    Vibration.vibrate();
    this.setState({barcodeScanner: false, bardata: data});
    this.forceUpdate();
    AlertIOS.alert(`Bar code with type ${type}`, `and data ${data} has been scanned!`, [{
      text: 'Cancel',
      onPress: () => null,
      style: 'cancel',
    }]);
  }

  _dropDB = () => {
    AlertIOS.alert('Drop all DBs?', "This action is irreversible", [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Drop',
        style: 'destructive',
        onPress: async () => {
          await db.transaction(tx => {
            tx.executeSql(
              `drop table tasks;`
            );
          });
          db.transaction(tx => {
            tx.executeSql(
              `drop table notes;`
            );
          });
          db.transaction(tx => {
            tx.executeSql(
              `drop table folders;`
            );
          });
        }
      },
    ]);
  }

  _registerAnon = () => {
    fetch('http://localhost:8001/init', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded' 
      },
    })
    .then((response) => response.json())
    .then((res) => {
      if (res.uuid) {
        AsyncStorage.setItem('uuid', res.uuid).then(() => this._sync(res.uuid))
      }
    })
    .catch((error) => {
      console.error(error);
    })
  }

  _sync = (uuid) => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from notes;`, [], async (_, { rows: { _array } }) => {
          let formBody = [];
          for (let key in _array) {
              let encodedKey = encodeURIComponent(key);
              let encodedValue = JSON.stringify(_array[key]);
              formBody.push(encodedKey + "=" + encodedValue);
          }
          formBody.push(encodeURIComponent('uuid') + "=" + uuid);
          formBody = formBody.join("&");
          await fetch('http://localhost:8001/sync', {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded' 
            },
            body: formBody
          })
          .then((response) => response.json())
          .then((res) => {
            if (res.error === 'uuid') {
              this._registerAnon();
            } else {
              fetch('http://localhost:8001/notes_update/' + uuid + '/' + new Date().getTime(), {
                method: 'GET',
              
              }).then((response) => response.json())
              .then((res) => {
                console.log(res);
              })
            }
          })
          .catch((error) => {
            console.error(error);
          })
        });
    });
  }

  _test = async () => {
    let uuid = await AsyncStorage.getItem('uuid');
    if (uuid) {
      console.log('sync')
      this._sync(uuid);
    } else {
      console.log('register')
      this._registerAnon();
    }
  }

  render() {
    const spin = this.state.spin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
 
      return (
        <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
          <Text style={styles.header}>
            Settings
          </Text>
          <SettingsCategoryHeader title={'History'} />
            <SettingsDividerLong android={false}/>
              <TouchableOpacity
                style={{
                  height: 48,
                  backgroundColor: '#fff',
                }}
                onPress={() => this.props.navigation.navigate('History')}>
                <Text style={ styles.settingsText }>History</Text>
                <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                  name="angle-right" />
              </TouchableOpacity>
            <SettingsDividerShort/>
              <TouchableOpacity
                style={{
                  height: 48,
                  backgroundColor: '#fff',
                }}
                onPress={() => null}>
                <Text style={ styles.settingsText }>Completed</Text>
                <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                  name="angle-right" />
              </TouchableOpacity>
            <SettingsCategoryHeader title={'Preferences'} />
              <SettingsDividerLong android={false}/>
                <SettingsPicker
                  title="Default reminder time"
                  dialogDescription={'If not specified otherwise.'}
                  possibleValues={[
                      {label: '9 am', value: '9:00'},
                      {label: '10 am', value: '10:00'},
                      {label: '11 am', value: '11:00'},
                      {label: 'Noon', value: '12:00'}
                  ]}
                  negativeButtonTitle={'Cancel'}
                  modalButtonsTitleNegativeStyle={{fontWeight: '400', color: '#444'}}
                  // buttonRightTitle={'Save'}
                  positiveButtonTitle={'Save'}
                  modalButtonsTitlePositiveStyle={{right: -10}}
                  onSaveValue={value => {
                      console.log('reminder time:', value);
                      this.setState({
                          gender: value
                      });
                  }}
                  value={this.state.gender}
                  styleModalButtonsText={{color: '#c43131', fontWeight: '400'}}                
                />
            <SettingsCategoryHeader title={'Privacy'} />
              <SettingsDividerLong android={false}/>
                <SettingsSwitch
                  title={'Allow Push Notifications'}
                  onSaveValue={(value) => {
                      console.log('allow push notifications:', value);
                      this.setState({
                          allowPushNotifications: value
                      });
                  }}
                  value={this.state.allowPushNotifications}
                />
              <SettingsDividerShort/>
                <SettingsSwitch
                  title={'Enable Touch ID / Face ID'}
                  onSaveValue={(value) => this._biometrySet(value)}
                  value={this.state.biometry}
                />
              <SettingsDividerShort/>
                <TouchableOpacity
                  style={{
                    height: 48,
                    backgroundColor: '#fff',
                  }}
                  onPress={() => this.props.navigation.navigate('Scanner')}>
                  <Text style={ styles.settingsText }>{this.state.bardata ? this.state.bardata : 'Sync with desktop'}</Text>
                  <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                    name="angle-right" />
                </TouchableOpacity>
              <SettingsDividerShort/>
                <TouchableOpacity
                  style={{
                    height: 48,
                    backgroundColor: '#fff',
                  }}
                  onPress={this._test}>
                  <Text style={ styles.settingsText }>test</Text>
                  <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                    name="angle-right" />
                </TouchableOpacity>

            <SettingsCategoryHeader title={'Development'} />
              <SettingsDividerLong android={false}/>
                <TouchableOpacity
                  style={{
                    height: 48,
                    backgroundColor: '#fff',
                  }}
                  onPress={this._dropDB}>
                  <Text style={ styles.settingsText }>Drop all databases</Text>
                  <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                    name="angle-right" />
                </TouchableOpacity>
              <SettingsDividerShort/>
                <TouchableOpacity
                  style={{
                    height: 48,
                    backgroundColor: '#fff',
                  }}
                  onPress={() => this._update(this.state.update ? this.state.update.isAvailable ? 1 : -1 : 0)}>
                  <Text style={ styles.settingsText }>
                    {!this.state.update ? 
                      'Check for Updates'
                      :
                        this.state.update.isAvailable ? 
                          'Download Update'
                          :
                          'You are up to date'
                    }
                  </Text>
                  {this.state.loading ?
                    <Animated.View style={{transform: [{rotate: spin}], position: 'absolute', top: 12, right: 13, height: 22, width: 22}}>
                      <Icon.Ionicons style={{position: 'absolute', top: 0, right: 0, fontSize: 22}} name="ios-sync" />
                    </Animated.View>
                    :
                    !this.state.update ?
                      <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}}
                        name="angle-right" />
                        :
                        this.state.update.isAvailable ?
                        <Icon.Foundation style={{ position: 'absolute', right: 13, fontSize: 22, color: '#c41313', top: 12}} name="burst-new" />
                      :
                      <Icon.FontAwesome style={{ position: 'absolute', right: 13, fontSize: 22, color: '#aaa', top: 12}} 
                      name="angle-right" />

                  }
                </TouchableOpacity>
        </ScrollView>
      );
    
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    marginTop: 40,
    left: 12,
    marginBottom: 10,
    // textAlign: 'right',
    color: '#292929',
    fontWeight: 'bold',
    fontSize: 35,
  },
  addBtn: {
    width: 56,
    height: 56
  },
  dueDate: {
    top: -5,
    width: 110,
    flexDirection: 'column',
    backgroundColor: '#fff',
    left: -20,
  },
  dueSelect: {
    top: -8,
    color: '#555',
    fontSize: 18,
  },
  submitBtn: {
    width: 30,
    padding: 0,
    height: 30,
    backgroundColor: '#c43131',
    position: 'absolute',
    top: 10,
    right: 7,
  },
  item: {
    flex: 1,
    padding: 12,
    minHeight: 55,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemDone: {
    flex: 1,
    padding: 12,
    minHeight: 55,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    opacity: 0.3,
  },
  text: {
    top: -5,
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 8,
    maxWidth: screenWidth - 120,
    fontSize: 16,
    color: '#191919',
  },
  textDone: {
    top: -5,
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 8,
    maxWidth: screenWidth - 120,
    fontSize: 16,
    color: '#191919',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  time: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    fontSize: 12,
    color: '#555',
  },
  due: {
    position: 'absolute',
    top: 10,
    right: 17,
    fontSize: 14,
    color: '#555',
  },
  settingsText:{
    fontSize: 16,
    lineHeight: 48,
    paddingLeft: 16,
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
