import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon, Permissions, Location } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, SimpleLineIcons, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
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
const screenHeight = Dimensions.get('window').height;

const ThemeAnimation = {
    duration: 225,
    create: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear,
    },
    update: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear,
    },
    delete: {
      property: LayoutAnimation.Properties.opacity,
      type: LayoutAnimation.Types.linear,
    },
}

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
      let styles = this.props.dark ? dark : light;
      if (!this.props.text) {
          return (
            <View style={[ styles.noteItem, {opacity: 0.4} ]} >
                <Icon.Ionicons
                    style={[ styles.checkmark, { color: this.props.dark ? '#292929' : '#fff' } ]}
                    name="ios-radio-button-off" />
            </View>
          );
      }
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
            dark: true,
            refreshing: false,
            list: false,
        }
        this._getTasks();
    }

    _getTasks = () => {
        let today = new Date().getDay();
        db.transaction(tx => {
            tx.executeSql(`select * from tasks where completed = 0 and tag like "%buy%" order by id desc;`, [today, today + 1],
            (_, { rows: { _array } }) => {
                if (_array.length < 11) {
                    for(let i = 1; _array.length < 11; i++) { _array.push({id: -i}) }
                }
                this.setState({ dataSource: _array });
                }
            );
        });
    }

    _refresh = () => {
        this.setState({refreshing: true});
        this._getTasks();
        setTimeout(() => this.setState({refreshing: false}), 1000);
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
        let styles = this.state.dark ? dark : light;
        let today = new Date();
        return (
            <View style={styles.container}>
                <View style={[styles.container, {bottom: this.state.list ? screenHeight - 70  : 0} ]}>
                    <View style={ styles.headerCnt }>
                        <Text style={styles.header}>Shopping</Text>
                        <Text onPress={this._done} style={styles.counter}>DONE</Text>
                    </View>
                    <FlatList
                        refreshControl={
                            <RefreshControl
                                onRefresh={this._refresh}
                                refreshing={this.state.refreshing}
                                tintColor={this.state.dark ? 'transparent' : '#fff'}
                                title={this.state.refreshing ? 'Up to Date' : ''}
                                titleColor={this.state.dark ? '#FBB300' : '#292929'}
                            />
                        }
                        data={this.state.dataSource}
                        style={[ styles.listContainer, {display: this.state.list ? 'none' : 'flex'} ]}
                        keyExtractor={item => item.id.toString()}
                        extraData={this._getTasks}
                        ListFooterComponent={<View style={{height: 75, width: screenWidth}}/>}
                        // onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
                        renderItem={({ item }) => <SmartListItem {...item} dark={this.state.dark} today={today} update={this._getTasks} done={this._listIDone} />}
                    />
                    <View style={styles.footer}>
                        <Icon.MaterialCommunityIcons
                            onPress={() => {
                                LayoutAnimation.configureNext(ThemeAnimation);
                                this.setState({dark: !this.state.dark})
                            }}
                            style={styles.themeSwitch}
                            name="theme-light-dark" />
                        <Icon.Ionicons
                            // onPress={() => {
                            //     LayoutAnimation.configureNext(ThemeAnimation);
                            //     this.setState({list: !this.state.list})
                            // }}
                            style={styles.tagsList}
                            name="ios-menu" /> 
                    </View>
                    
                </View>
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

const light = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 48,
        width: screenWidth,
        backgroundColor: 'rgba(250,250,250,0.95)',
        borderTopColor: '#ccc',
        borderTopWidth: 0.5,
    },
    themeSwitch: {
        position: 'absolute',
        right: 12,
        top: 13,
        fontSize: 22
    },
    tagsList: {
        position: 'absolute',
        left: 12,
        top: 11,
        fontSize: 25
    },
    headerCnt: {
        height: 90,
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
    },
    header: {
        marginTop: 35,
        left: 12,
        // textAlign: 'right',
        color: '#292929',
        fontWeight: 'bold',
        fontSize: 35,
    },
    counter: {
        position: 'absolute',
        bottom: 0,
        right: 12,
        color: '#292929',
        fontWeight: 'normal',
        fontSize: 17,
        textAlign: 'center',
        backgroundColor: '#fff',
        height: 50,
        width: 70,
        zIndex: 9,
    },
    saveBtn: {
        position: 'absolute',
        top: 55,
        right: 30,
        color: '#292929',
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
        borderBottomColor: '#aaa',
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
        color: '#292929',
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
        color: '#292929',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    checkmark: {
        position: 'absolute',
        top: 0,
        left: 0,
        fontSize: 32,
        color: '#555',
        width: 50,
        textAlign: 'center',
        backgroundColor: '#fff'
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

const dark = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#292929',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 48,
        width: screenWidth,
        backgroundColor: 'rgba(39,39,39,0.95)',
        borderTopColor: '#222',
        borderTopWidth: 0.5,
    },
    themeSwitch: {
        position: 'absolute',
        right: 12,
        top: 13,
        fontSize: 22,
        color: '#FBB300'
    },
    tagsList: {
        position: 'absolute',
        left: 12,
        top: 11,
        fontSize: 25,
        color: '#FBB300'
    },
    headerCnt: {
        height: 90,
        backgroundColor: '#282828',
        borderBottomColor: '#222',
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
        bottom: 0,
        right: 12,
        color: '#FBB300',
        fontWeight: 'normal',
        fontSize: 17,
        textAlign: 'center',
        backgroundColor: '#292929',
        height: 50,
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

