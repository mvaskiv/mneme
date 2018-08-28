import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
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
  AsyncStorage,
  Animated,
} from 'react-native';
import HomeScreen from './HomeScreen';

const db = SQLite.openDatabase('mneme.db');
const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      removed: false,
      count: '',
      lastItem: '',
      
    };
    this._getCount();
  }

  _getCount = () => {
    db.transaction(async tx => {
        tx.executeSql(`select count(*) from ` + this.props.route + `;`, [],
            (_, { rows: { _array } }) => {
                this.setState({count: _array[0]['count(*)']})
            }
        );
    });
    db.transaction(async tx => {
        tx.executeSql(`select * from ` + this.props.route + ` order by id desc limit 1;`, [],
            (_, { rows: { _array } }) => {
                this.setState({lastItem: _array[0]})
            }
        )
    });
  }

  _getSetDate = () => {
    let today = new Date();

    if (!this.state.lastItem) {return 'New'}
    if (today.getDay() == this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      return 'Last modified at ' + hr + ':' + min;
    } else if (this.state.lastItem.day === 6 ? today.getDay() === 0 : today.getDay() - 1 === this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      return 'Last modified yesterday at ' + hr + ':' + min;
    } else {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      let day = this.state.lastItem.date < 10 ? '0' + this.state.lastItem.date : this.state.lastItem.date;
      let month = this.state.lastItem.month < 10 ? '0' + this.state.lastItem.month : this.state.lastItem.month;
      return 'Last modified ' + day + '/' + month + ' at ' + hr + ':' + min;
    }
  }

  render() {
    if (this.props.caption === 'Add') {
        return (
            <TouchableHighlight
                style={[ styles.menuBtn , {backgroundColor: '#efefef'}]}
                underlayColor={'rgba(29, 29, 29, 0.11)'}
                onPress={() => this.props.navigation.navigate(this.props.route)}>
                <Icon.Ionicons
                    style={ styles.addIcon }
                    name="ios-add" />
            </TouchableHighlight>
        )
    } else {
        return (
            <TouchableHighlight
                style={ styles.menuBtn }
                underlayColor={'rgba(29, 29, 29, 0.1)'}
                onPress={() => this.props.navigation.navigate(this.props.route)}>
                <View>
                    <Text
                        style={ styles.folderHeader }>
                        {this.props.caption} {this.state.count > 0 && <Text style={{color: '#888', fontSize: 16, fontWeight: 'normal', paddingBottom: 2}}>({this.state.count})</Text>}
                    </Text>
                    <Text
                        style={ styles.lastModif }>
                        {this._getSetDate()}
                    </Text>
                    <Icon.SimpleLineIcons
                        style={ styles.enterIcon }
                        name="arrow-right" />
                </View>
            </TouchableHighlight>
        );
    }
  }
}

const SettingsBtn = (props) => (
    <Icon.Ionicons
      onPress={() => props.nav.navigate('Settings')}
      style={{
        color: '#c43131',
        fontSize: 24,
        paddingHorizontal: 15,
        paddingTop: 20,
      }}
      name='ios-settings' />
  )

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
    };
    this._bootstrapAsync();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <SettingsBtn nav={navigation}  />
    }
  };

  _bootstrapAsync = async () => {
   
  }

  render() {
    let today = new Date();

    return (
      <ScrollView style={styles.container}>
        {/* <Image style={{position: 'absolute', top: 0, height: screenHeight, opacity: 0.2, flex: 1}} source={require('../assets/images/paper.jpg')} /> */}
        <MenuItem
            navigation={this.props.navigation}
            caption={"To Do's"}
            route={'todos'} />
        <MenuItem
            navigation={this.props.navigation}
            caption={"Notes"}
            route={'notes'} />    
        <MenuItem
            navigation={this.props.navigation}
            caption={"Add"}
            route={'Add'} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    // paddingTop: 60,
    backgroundColor: '#fff',
  },
  menuBtn: {
      width: screenWidth - 20,
      padding: 14,
      top: 4,
      marginTop: 15,
      marginHorizontal: 10,
      borderWidth: 1,
      borderColor: '#eee',
      borderRadius: 10,
      height: 85,
  },
  folderHeader: {
      fontWeight: 'bold',
      fontSize: 21,
  },
  lastModif: {
      paddingTop: 12,
      color: '#777'
  },
  enterIcon: {
    position: 'absolute',
    right: 5,
    top: 2,
    fontSize: 18,
    color: '#292929'
  },
  addIcon: {
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 55,
      color: '#777',
  }
});
