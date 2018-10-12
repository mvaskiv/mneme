import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon, Permissions, Location, Contacts } from 'expo';
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
  RefreshControl,
  Linking
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
const ExpandAnimation = {
    duration: 150,
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
const ChangeAnimation = {
    duration: 100,
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
        text: '',
      }
      this.contacts = [];
    }
  
    async componentDidMount() {
        if (this.props.tag && this.props.tag.key === 'call') {
            this.contacts = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });
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

    _addItem = async () => {

        let date = await new Date();
        let thisID = 0;
        await db.transaction(async tx => {
            await tx.executeSql(`insert into tasks (text, hours, minutes, day, date, month, due, tag) values
            (?, ?, ?, ?, ?, ?, ?, ?); select last_insert_rowid();`, [
                this.props.tag.key.replace(/^\w/, c => c.toUpperCase()) + ' ' + this.state.text,
                -1,
                -1,
                null,
                date.getDate(),
                date.getMonth(),
                null,
                this.props.tag.key,
            ], async (_, res) => {
                thisID = await res['insertId'];
            }
            );
        }
        );
        LayoutAnimation.configureNext( ExpandAnimation );
        await this.setState({updated: true});
    }

    _onChange = (e) => {
        this.setState({text: e});
    }

    _checkContact = () => {
        if (this.props.tag && this.props.tag.key === 'call') {
            this.contacts.data.some((c) => {
                if (c.name && c.name.toLowerCase().includes(this.props.text.replace(/(Call)|(today)/g, '').trim().toLowerCase())) {
                    if (c.phoneNumbers[0].number) {
                        AlertIOS.alert('Call ' + c.name + '?','', [
                            {
                                text: 'Cancel',
                                onPress: () => null,
                                style: 'cancel',
                            },
                            {
                                text: 'Call',
                                onPress: () => {
                                    Linking.openURL('tel:' + c.phoneNumbers[0].number.replace(/[ ()+-]/g, ''));
                                },
                                style: 'normal',
                            },
                        ]);
                    }
                    return true;
                }
            })
        }
    }
  
    render() {
      let creationDate = this._getSetDate();
      let styles = this.props.dark ? dark : light;
      if (!this.props.text) {
          return (
            <View style={[ styles.noteItem, {opacity: 0.35} ]} >
                <Icon.Ionicons
                    style={[ styles.checkmark, { color: this.props.dark ? '#292929' : '#fff' } ]}
                    name="ios-radio-button-off" />
            </View>
          );
      }
      return (
        <View style={[ styles.noteItem, {opacity: this.props.due === this.props.today.getDay() + 1 ? 0.4 : 1} ]}>
            <Icon.Ionicons
                onPress={() => {
                    this.props.done(this.state.done ? 0 : 1, this.props.id)
                    .then(this.setState({done: !this.state.done}));
                }}
                style={styles.checkmark}
                name={this.state.done ? "ios-checkmark-circle-outline" : "ios-radio-button-off"} />
            {this.props.create ?
                <TextInput
                    keyboardAppearance={this.props.dark ? 'dark' : 'light'}
                    value={this.state.text}
                    onChangeText={this._onChange}
                    onSubmitEditing={() => this.props.addMore()}
                    onBlur={this.state.text ? this._addItem : () => {LayoutAnimation.configureNext( ExpandAnimation );this.props.refresh()}}
                    blurOnSubmit={true}
                    maxLength={60}
                    numberOfLines={1}
                    style={ styles.text }
                    autoFocus={true} />
            :
                <Text
                    onPress={this._checkContact}
                    numberOfLines={1}
                    style={ this.state.done ? styles.textDone : styles.text }>
                    { this.props.text.replace(/(Buy)|(today)|(Call)/g, '').trim().replace(/^\w/, c => c.toUpperCase()) }
                </Text>
     
            }
            {this.state.view && <Popup
                caption={this.props.header}
                text={this.props.text}
                view={true}
                id={this.props.id}
                created={creationDate}
                updated={null}
                delete={this.props.delete}
                hide={this._hideNote}
                change={this._onChange} />
            }
        </View>
      );
    }
  }

const emptySet = [
    {id: -1},
    {id: -2},
    {id: -3},
    {id: -4},
    {id: -5},
    {id: -6},
    {id: -7},
    {id: -8},
    {id: -9},
    {id: -10},
    {id: -11},
    {id: -12},
    {id: -13},
    {id: -14},
    {id: -15},
    {id: -16},
    {id: -17},
    {id: -18},
    {id: -19},
    {id: -20},
    {id: -21},
    {id: -22},
]

export default class SmartTags extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            dark: true,
            refreshing: false,
            list: false,
            changes: false,
            modal: false,
            tag: {key: 'buy', name: 'Shopping'}
        }
        this._getTasks();
    }

    componentDidMount() {
        let time = new Date().getHours();
        // if (time > )
    }

    _getTasks = async (key) => {
        let today = new Date().getDay();
        let tag = key ? key : this.state.tag.key;
        db.transaction(tx => {
            tx.executeSql(`select * from tasks where completed = 0 and tag like ? order by id desc;`, [
                '%'+tag+'%'
            ],
            (_, { rows: { _array } }) => {
                // if (_array.length < 11) {
                //     for(let i = 1; _array.length < 11; i++) { _array.push({id: -i}) }
                // }
                LayoutAnimation.configureNext(ChangeAnimation);
                this.setState({ dataSource: _array, changes: false });
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
        this.setState({changes: true});
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

    _addItem = () => {
        let i = this.state.dataSource[0] ? this.state.dataSource[0].id + 1 : 0;
        LayoutAnimation.configureNext(ThemeAnimation);
        this.state.dataSource.unshift({text: 'New', id: i, create: true, addMore: this._addItem, refresh: this._getTasks})
        this.setState({updated: true});
    }

    _setTag = (tag) => {
        this.setState({tag: tag});
        this._getTasks(tag.key);
    }

    render() {
        let styles = this.state.dark ? dark : light;
        // const footer = this.
        let today = new Date();
        return (
            <View style={styles.container}>
                <View style={[styles.container, {opacity: this.state.modal ? 0.05 : 1} ]}>
                    <View style={ styles.headerCnt }>
                        <Text style={styles.header}>{this.state.tag.name}</Text>
                        {this.state.changes && <Text onPress={this._done} style={styles.counter}>DONE</Text>}
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
                        ListFooterComponent={<View style={{height: 90, marginTop: -15, width: screenWidth, overflow: 'visible'}}>
                            <FlatList
                                scrollEnabled={false}
                                data={emptySet}
                                style={styles.listContainer}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item }) => <SmartListItem {...item} dark={this.state.dark} today={today} />}
                            /></View>}
                        // onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
                        renderItem={({ item }) => <SmartListItem {...item} dark={this.state.dark} today={today} update={this._getTasks} done={this._listIDone} tag={this.state.tag} />}
                    />
                    
                    <View style={styles.footer}>
                        <Icon.MaterialCommunityIcons
                            onPress={() => {
                                LayoutAnimation.configureNext(ThemeAnimation);
                                this.setState({dark: !this.state.dark})
                            }}
                            style={styles.themeSwitch}
                            name="theme-light-dark" />
                        <Text style={[styles.moreBtn, {bottom: this.state.modal ? -40 : 12}]} onPress={() => this.setState({modal: !this.state.modal})}>more</Text>
                        <Icon.Ionicons
                            onPress={this._addItem}
                            style={styles.tagsList}
                            name="ios-create-outline" /> 
                    </View>
                </View>
                <Modal
                    transparent={true}
                    visible={this.state.modal}
                    animationType='slide'>
                    <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({modal: false})}/>
                    <View style={{overflow: 'visible'}}>
                        <FlatList
                            data={Tags}
                            style={[styles.listContainer, {overflow: 'visible'}]}
                            keyExtractor={item => item.id.toString()}
                            ListFooterComponent={<View style={{height: 15}} />}
                            renderItem={({ item }) => <TagsView {...item} set={this._setTag} dark={this.state.dark} hide={() => this.setState({modal: false})}/>}
                        />
                        <View style={[ styles.noteItem, { borderBottomWidth: 0 } ]}>
                            <Text
                                numberOfLines={1}
                                onPress={() => {LayoutAnimation.configureNext(ThemeAnimation);this.setState({modal: false})}}
                                style={[ styles.text, {left: 0, textAlign: 'center', width: screenWidth, maxWidth: screenWidth, fontSize: 16, fontWeight: '700', top: -2} ]}>
                                cancel
                            </Text>
                        </View>

                    </View>
                </Modal>

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

const Tags = [
    {id: 0, name: 'Shopping', keyword: 'buy'},
    {id: 1, name: 'Calls', keyword: 'call'},
    {id: 2, name: 'Work', keyword: 'work'},
    {id: 3, name: 'Home', keyword: 'home'},
    {id: 4, name: 'Errands', keyword: 'misc'},
    {id: 5, name: 'Shared', keyword: 'shared'},
];

const TagsView = (props) => (
    <View style={[ props.dark ? dark.noteItem : light.noteItem , { borderBottomWidth: 0 } ]} >
        <Text
            onPress={() => {props.set({key: props.keyword, name: props.name}); setTimeout(() => props.hide(), 120)}}
            numberOfLines={1}
            style={[ props.dark ? dark.text : light.text, {left: 0, textAlign: 'center', width: screenWidth, maxWidth: screenWidth} ]}>
            { props.name }
        </Text>
    </View>
)

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
        left: 14,
        top: 8,
        fontSize: 28,
    },
    headerCnt: {
        top: 5,
        height: 90,
        marginBottom: 5,
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
        fontSize: 16,
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
        maxWidth: screenWidth - 70,
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
        maxWidth: screenWidth - 70,
        top: 0,
        left: 52,
        lineHeight: 30,
        letterSpacing: 0.5,
        fontWeight: "400",
        fontSize: 24,
        color: '#777',
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
    },
    moreBtn: {
        position: 'absolute',
        bottom: 12,
        width: 60,
        textAlign: 'center',
        color: '#292929',
        fontWeight: '700',
        fontSize: 16,
        marginHorizontal: screenWidth/2 - 30,
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
        left: 14,
        top: 8,
        fontSize: 28,
        color: '#FBB300'
    },
    headerCnt: {
        top: 5,
        height: 90,
        marginBottom: 5,
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
        fontSize: 16,
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
        maxWidth: screenWidth - 70,
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
        maxWidth: screenWidth - 70,
        top: 0,
        left: 52,
        lineHeight: 30,
        letterSpacing: 0.5,
        fontWeight: "400",
        fontSize: 24,
        color: '#FBB300',
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
        opacity: 0.8
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
    },
    moreBtn: {
        position: 'absolute',
        bottom: 12,
        width: 60,
        textAlign: 'center',
        color: '#FBB300',
        fontWeight: '700',
        fontSize: 16,
        marginHorizontal: screenWidth/2 - 30,
    },
    modal: {
        position: 'absolute',
        bottom: 85,
        height: 250,
        width: screenWidth - 30,
        marginHorizontal: 15,
        backgroundColor: '#f7f7f7',
        borderRadius: 12,
        borderWidth: 0.5,
        borderColor: '#222',
        shadowColor: '#151515',
        shadowOffset: {bottom: 5},
        shadowOpacity: 0.55,
        shadowRadius: 33,
    },
    tagHeader: {
        marginTop: 5,
        left: 12,
        // textAlign: 'right',
        color: '#292929',
        fontWeight: 'bold',
        fontSize: 27,
    }
})

