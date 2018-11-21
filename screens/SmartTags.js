import React from 'react';
import { Icon, Contacts } from 'expo';
import {
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  View,
  LayoutAnimation,
  AlertIOS,
  RefreshControl,
  Linking
} from 'react-native';
import { Header } from '../constants/header';
const Dimensions = require('Dimensions');
const screenHeight = Dimensions.get('window').height;

import PouchDB from 'pouchdb-react-native'
const db = new PouchDB('mydb')

const screenWidth = Dimensions.get('window').width;

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
        db.put({
          '_id': date.getTime().toString(),
          'type': 'task', 'text': this.props.tag.key.replace(/^\w/, c => c.toUpperCase()) + ' ' + this.state.text,
          'hours': -1, 'minutes': -1,
          'day': null, 'date': date.getDate(), 'month': date.getMonth(),
          'due': null, 'tag': this.props.tag.key,
          'completed': 0, 'reminder': null, 'origin': 'Mobile' })
        LayoutAnimation.configureNext( ExpandAnimation );
        await this.setState({updated: true});
        this.props.updateToday()
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
            <View style={[ styles.noteItem, {opacity: this.props.dark ? 0.2 : 0.35} ]} >
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
                    this.props.done(this.state.done ? 0 : 1, this.props._id.toString())
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
                    onBlur={this.state.text ? this._addItem : () => { LayoutAnimation.configureNext( ExpandAnimation );this.props.refresh() }}
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
    {_id: -1},
    {_id: -2},
    {_id: -3},
    {_id: -4},
    {_id: -5},
    {_id: -6},
    {_id: -7},
    {_id: -8},
    {_id: -9},
    {_id: -10},
    {_id: -11},
    {_id: -12},
    {_id: -13},
    {_id: -14},
    {_id: -15},
    {_id: -16},
    {_id: -17},
    {_id: -18},
    {_id: -19},
    {_id: -20},
    {_id: -21},
    {_id: -22},
]

export default class SmartTags extends React.Component {
    constructor() {
        super();
        this.state = {
            dataSource: [],
            dark: false,
            refreshing: false,
            list: false,
            changes: false,
            modal: false,
            tag: {key: 'buy', name: 'Shopping'}
        }
        this._getTasks(null);
    }

    componentDidMount() {
        // console.log()
        // let time = new Date().getHours();
        // if (time > )
    }

    _sortTasks(stash, today) {
        let today_t = [];
        let tomor = [];
        let rest = [];
        stash.map(e => {
          if (e.due === today) {
            today_t.push(e);
          } else if (e.due === today + 1) {
            tomor.push(e);
          } else {
            rest.push(e);
          }
        })
        return (today_t.concat(tomor.concat(rest)));
    }

    _getTasks = async (key) => {
        let criteria = await key ? key : this.state.tag.key
        let selector = {
            'type': 'task',
            'tag': {$regex: '.*' + criteria + '.*'},
            'completed': 0,
          }
        //   db.createIndex({
        //     index: {fields: ['type']},
        //   })
          db.find({
            selector: selector,
            sort: ['_id'],
          }).then((res) => {
            LayoutAnimation.configureNext(ChangeAnimation);
            this.setState({ dataSource: this._sortTasks(res.docs.reverse(), new Date().getDate()) }, () => {
              this.setState({loaded: true}, () => this.forceUpdate())
            })
        });
        
    }

    _refresh = () => {
        this.setState({refreshing: true});
        this._getTasks();
        setTimeout(() => this.setState({refreshing: false}), 1000);
    }

    _listIDone = async (i, id) => {
        this.setState({changes: true});
        db.get(id).then(async (doc) => {
            console.log(doc)
            doc.completed = i;
            db.put(doc);
        })
    }

    _done = () => {
        this._getTasks();
        this.props.navigation.navigate('MenuS');
    }

    _addItem = () => {
        let i = this.state.dataSource[0] ? this.state.dataSource[0]._id + 1 : 0;
        LayoutAnimation.configureNext(ThemeAnimation);
        this.state.dataSource.unshift({text: 'New', _id: i, create: true, addMore: this._addItem, refresh: this._getTasks})
        this.setState({updated: true});
    }

    _setTag = (tag) => {
        this.setState({tag: tag});
        this._getTasks(tag.key);
    }

    render() {
        let styles = this.state.dark ? dark : light;
        let today = new Date();

        return (
            <View style={styles.container}>
                <View style={[styles.container, {opacity: this.state.modal ? 0.05 : 1} ]}>
                    <Header title={ this.state.tag.name } headerRight={this.state.changes && <Text onPress={this._done} style={styles.counter}>DONE</Text>} />
               
                    {this.state.dataSource[0] ? 
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
                        keyExtractor={item => item._id.toString()}
                        extraData={this._getTasks}
                        renderItem={({ item }) => <SmartListItem {...item} dark={this.state.dark} today={today} update={this._getTasks} done={this._listIDone} tag={this.state.tag} updateToday={() => this.props.navigation.state.params.updateToday()} />}
                    />
                    : <Text style={ styles.empty }>Nothing here yet</Text>
                    }
                    <View style={styles.footer}>
                        {/* <Icon.MaterialCommunityIcons
                            onPress={() => {
                                LayoutAnimation.configureNext(ThemeAnimation);
                                this.setState({dark: !this.state.dark})
                            }}
                            style={styles.themeSwitch}
                            name="theme-light-dark" /> */}
                        <Text style={[styles.moreBtn, {bottom: this.state.modal ? -40 : 9}]} onPress={() => this.setState({modal: !this.state.modal})}>more</Text>
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
                    <View style={{overflow: 'visible', bottom: screenHeight > 800 ? 29 : 0}}>
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
        backgroundColor: 'rgb(244,244,247)',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        height: 45,
        width: screenWidth,
        backgroundColor: 'rgba(250,250,253,0.95)',
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
        paddingTop: 3,
        height: 94,
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
        height: 20,
        width: 60,
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
        // borderBottomColor: '#ccc',
        // borderBottomWidth: 0.5,
    },
    text: {
        position: 'absolute',
        maxWidth: screenWidth - 70,
        top: 0,
        left: 47,
        lineHeight: 31.5,
        // letterSpacing: 0.3,
        fontWeight: "400",
        fontSize: 24,
        color: '#444',
    },
    textDone: {
        position: 'absolute',
        maxWidth: screenWidth - 70,
        top: 0,
        left: 47,
        lineHeight: 31.5,
        // letterSpacing: 0.5,
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
        color: '#888',
        width: 50,
        textAlign: 'center',
        backgroundColor: 'rgb(244,244,247)'
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
        color: '#393939',
        fontWeight: '700',
        fontSize: 16,
        marginHorizontal: screenWidth/2 - 30,
    },
    empty: {
        top: 30,
        fontSize: 22,
        color: '#a1a1a1',
        fontWeight: '400',
        textAlign: 'center'
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
        backgroundColor: 'rgba(35,35,35,0.95)',
        borderTopColor: '#191919',
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
        paddingTop: 3,
        height: 94,
        marginBottom: 5,
        backgroundColor: 'rgba(35,35,35,0.95)',
        borderBottomColor: '#111',
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
        backgroundColor: 'rgba(35,35,35,0.95)',
        height: 35,
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
    },
    empty: {
        top: 30,
        fontSize: 22,
        color: '#6a6a6a',
        fontWeight: '400',
        textAlign: 'center'
    }
})

