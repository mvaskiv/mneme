import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon, Permissions, Location } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-swipeable';
import { WeekDay, Month, weatherIcons } from '../constants/Dates-Weather';
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
  LayoutAnimation,
  Animated,
  Easing,
  AlertIOS,
  RefreshControl
} from 'react-native';
const Dimensions = require('Dimensions');
const db = SQLite.openDatabase('mneme.db');
const screenWidth = Dimensions.get('window').width;

class SmartListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        removed: false,
        edit: false,
        removed: false,
        view: false,
        done: false,
      }
    }
  
    _getSetDate = () => {
      if (this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
        let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
        let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
        return 'Due ' + hr + ':' + min;
      } else if (this.props.today.getDay() + 1 == this.props.day && this.props.today.getMonth() == this.props.month) {
        return 'Tomorrow';
      }
    }
  
    _hideNote = () => {
      this.setState({view: false});
      this.props.update()
    }
  
    render() {
      let creationDate = this._getSetDate();
  
      return (
        <TouchableWithoutFeedback
          underlayColor={'rgba(29, 29, 29, 0.3)'}
          onPress={() => this.props.done(this.props.id)}
          >
            <View style={[ styles.noteItem, {opacity: this.props.due === this.props.today.getDay() + 1 ? 0.4 : 1} ]}>
              <Icon.Ionicons
                onPress={() => {
                  this.props.done(this.state.done ? 0 : 1, this.props.id)
                    .then(this.setState({done: !this.state.done}));
                }}
                style={styles.checkmark}
                name={this.state.done ? "ios-checkmark-circle-outline" : "ios-radio-button-off"} />
              <Text
                numberOfLines={1}
                style={ this.state.done ? styles.textDone : styles.text }>
                { this.props.text.replace(/(Buy)|(today)/g, '').trim().replace(/^\w/, c => c.toUpperCase()) }
              </Text>
              {this.state.view && <Popup
                caption={this.props.header}
                text={this.props.text}
                view={true}
                id={this.props.id}
                created={creationDate}
                updated={null}
                delete={this.props.delete}
                hide={this._hideNote}
                change={this._onChange} />}
            </View>
        </TouchableWithoutFeedback>
      );
    }
  }

export default class SmartTags extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
        }
        this._getTasks();
    }

    _getTasks = () => {
        let today = new Date().getDay();
        db.transaction(tx => {
            tx.executeSql(`select * from tasks where completed = 0 and tag like "%buy%" order by id desc;`, [today, today + 1],
            (_, { rows: { _array } }) => {
                this.setState({ dataSource: _array });
                }
            );
        });
    }

    _listIDone = async (i, id) => {
        return new Promise(
          resolve => {
            db.transaction(tx => {
              tx.executeSql(`update tasks set completed = ? where id = ?`,[i, id]
            );
          });
          resolve('yes');
        });
    }

    _done = () => {
        this._getTasks();
        this.props.navigation.navigate('MenuS');
    }

    render() {
        let today = new Date();
        return (
            <View style={styles.container}>
                <View style={ styles.headerCnt }>
                    <Text style={styles.header}>Shopping</Text>
                    <Text onPress={this._done} style={styles.counter}>DONE</Text>
                    {/* <Text style={styles.saveBtn} >Done</Text> */}
                </View>
                <FlatList
                    data={this.state.dataSource}
                    style={ styles.listContainer }
                    keyExtractor={item => item.id.toString()}
                    extraData={this._getTasks}
                    // onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
                    renderItem={({ item }) => <SmartListItem {...item} today={today} update={this._getTasks} done={this._listIDone} />}
                />
                {/* <View style={ styles.list }>
                    <View style={ styles.listItem }>
                        <Text style={[ styles.listText, {color: '#FBB300'} ]}>S</Text>
                    </View>
                    <View style={ styles.listItem }>   
                        <Text style={ styles.listText }>C</Text>
                    </View>
                    <View style={ styles.listItem }>   
                        <Text style={ styles.listText }>V</Text>
                    </View>
                </View> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#292929',
    },
    headerCnt: {
        height: 90,
        borderBottomColor: '#FBB300',
        borderBottomWidth: 0.5,
    },
    header: {
        marginTop: 35,
        left: 12,
        // textAlign: 'right',
        color: '#FBB300',
        fontWeight: 'bold',
        fontSize: 35,
    },
    counter: {
        position: 'absolute',
        bottom: -9,
        right: 15,
        color: '#FBB300',
        fontWeight: 'normal',
        fontSize: 18,
        textAlign: 'center',
        backgroundColor: '#292929',
        height: 20,
        width: 70
    },
    saveBtn: {
        position: 'absolute',
        top: 55,
        right: 30,
        color: '#FBB300',
        fontSize: 16,
    },
    listContainer: {
        paddingTop: 10,
    },
    noteItem: {
        flex: 1,
        padding: 12,
        marginTop: 10,
        top: 0,
        minHeight: 35,
        flexDirection: 'row',
        borderBottomColor: '#FBB300',
        borderBottomWidth: 0.5,
        
    },
    text: {
        position: 'absolute',
        maxWidth: screenWidth - 170,
        top: 0,
        left: 52,
        lineHeight: 30,
        letterSpacing: 0.5,
        fontWeight: "400",
        fontSize: 24,
        color: '#FBB300',
    },
    textDone: {
        position: 'absolute',
        maxWidth: screenWidth - 170,
        top: 0,
        left: 52,
        lineHeight: 30,
        letterSpacing: 0.5,
        fontWeight: "400",
        fontSize: 24,
        color: '#FBB300',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    checkmark: {
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: 32,
        color: '#FBB300',
        width: 50,
        textAlign: 'center',
        backgroundColor: '#292929'
    },
    editNote: {
        position: 'absolute',
        flexDirection: 'row',
        width: screenWidth,
        bottom: 0,
        height: 45,
        backgroundColor: 'rgba(255,255,255,0.85)',
    },
    list: {
        position: 'absolute',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        // flexGrow: 1,
        justifyContent: 'space-evenly',
        bottom: 0,
        height: 25,
        borderTopColor: '#aaa',
        borderTopWidth: 0.5,
        width: screenWidth,
        overflow: 'visible'
    },
    listItem: {
        display: 'flex',
        // flexGrow: 1,
        // width: 50,0
        marginHorizontal: 10,
        bottom: 12,
        
    },
    listText: {
        textAlign: 'center',
        // width: 50,
        height: 29,
        paddingHorizontal: 10,
        color: '#aaa',
        backgroundColor: '#292929',
        fontWeight: 'normal',
        fontSize: 18,
    }
})

