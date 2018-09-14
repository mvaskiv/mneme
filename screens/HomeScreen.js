import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { Icon, SQLite, Notifications, Permissions } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, Ionicons, Foundation, SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
// import Swipeout from 'react-native-swipeout';
import CountdownCircle from 'react-native-countdown-circle'
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
  AlertIOS,
  DatePickerIOS,
} from 'react-native';
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
    property: LayoutAnimation.Properties.opacity,
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
const FadeItemAnimation = {
  duration: 135,
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

const RecoverBtn = ({ onPress }) => (
  <TouchableOpacity style={ styles.recoverPop } onPress={ onPress }>
    <Text style={ styles.recoverPopText }>
      Tap to <Text style={{color: '#c43131'}}>Undo</Text>
    </Text>
  </TouchableOpacity>
)

// const RmRecBtn = ({onPress}) => (
//   <Fab
//     direction="up"
//     containerStyle={{ }}
//     style={{ left: 60, backgroundColor: 'rgba(22,22,22,0.43)' }}
//     position="bottomLeft"
//     onPress={onPress}>
//     <Icon.MaterialIcons name={'delete'} />
//   </Fab>
// )


const AddBtn = ({onPress}) => (
  <Fab
      direction="up"
      containerStyle={{ }}
      style={{ backgroundColor: '#c43131' }}
      position="bottomRight"
      onPress={onPress}>
      <Icon.MaterialIcons name={'add'} />
  </Fab>
)

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      dueDate: '',
    }
  }

  _addDueDate(d) {
    if (d === this.state.dueDate) {
      this.setState({dueDate: ''})
    } else if (d === 'today') {
      this.setState({dueDate: 'today'});
    } else if (d === 'tomorrow') {
      this.setState({dueDate: 'tomorrow'});
    } else if (d === 'week') {
      this.setState({dueDate: 'week'});
    }
  }
  
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <TouchableOpacity style={{flex: 1}} onPress={this.props.close} activeOpacity={1}>
          <View style={{
            position: 'absolute',
            bottom: 0,
            height: screenHeight > 800 ? 365 : 292,
            width: screenWidth,
            borderColor: '#ccc',
            borderRadius: 11,
            shadowColor: '#999',
            padding: 5,
            // shadowOffset: 2,
            shadowOpacity: 0.2,
            shadowRadius: 5,
            borderWidth: 1,
            backgroundColor: '#fff'
          }}>
            <TextInput
              placeholder='Type it in'
              maxLength={60}
              // clearButtonMode='always'
              autoCorrect={false}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {LayoutAnimation.configureNext( SwipeItemAnimation ); this.setState({text})}}
              blurOnSubmit={false}
              onSubmitEditing={async () => {
                await this.state.text ? this.props.add(this.state.text, this.state.dueDate) : null;
                this.setState({text: ''});
              }}
              style={{fontSize: 16, padding: 11, paddingRight: 40}}
              autoFocus={true} />
              <RkButton
                style={styles.submitBtn}
                onPress={async () => {
                  await this.state.text ? this.props.add(this.state.text, this.state.dueDate) : null;
                  this.setState({text: ''});
                }}
                rkType='rounded'>
                <Icon.MaterialIcons
                  name='add'
                  style={{
                    position: 'absolute',
                    color: '#fff',
                    top:5,
                    fontSize: 20,
                  }} />
                  {/* <Text
                    style={{
                      position: 'absolute',
                      color: '#fff',
                      top:5,
                      fontSize: 15,
                    }}> A </Text> */}
              </RkButton>
              <View
                style={{flexDirection: 'row'}}>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('today')} >
                <Text
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'today' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    Today
                  </Text>
                </RkButton>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('tomorrow')} >
                <Text 
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'tomorrow' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    Tomorrow
                  </Text>
                </RkButton>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('week')} >
                <Text
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'week' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    This Week
                  </Text>
                </RkButton>
                <RkButton
                  style={{top: -5,
                    width: 110,
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    left: this.state.text.length > 0 ? -20 : 50
                    }}>
                  <Text
                    style={{ 
                      top: -8,
                      left: -22,
                      color: this.state.text.length >= 60 ? '#c43131' : '#555',
                      fontSize: 13,
                    }}>{this.state.text.length}/60</Text>
                </RkButton>
              </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      edit: false,
      newText: '',
      editText: false,
      removed: false,
      date: new Date(),
      setDate: false,
    }    
    
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
    ];
  }

  componentWillReceiveProps() {
    if (this.props.expanded && this.props.id === this.props.expanded) {
      this.setState({edit: false});
    }
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
    await LayoutAnimation.configureNext(SwipeItemAnimation);
    if (i === 1) {
      this.setState({swipeOpen: true});
    } else if (i === 0) {
      this.setState({swipeOpen: false});
    }
  }

  _swpieHandler = async (a) => {
  
  }

  _onDateChange = (date) => {
    this.setState({date: date});
    // this.props.events.emit('date-picked', date);
  }

  // handleUserBeganScrollingParentView() {
  //   LayoutAnimation.configureNext(SwipeItemAnimation);
  //   this.swipeable.recenter();
  // }

  _expand = () => {
    this.props.expand(this.state.edit ? null : this.props.id);
    LayoutAnimation.configureNext( ListItemAnimation );
    this.setState({edit: !this.state.edit});
  }

  render() {
    const leftContent = [
      <TouchableHighlight
        style={{
        flex: 1,
        right: this.state.swipeOpen ? 0 : 110,
        padding: 15,
        backgroundColor: '#fff',
        }}
        underlayColor={ '#fff'}
        onPress={() => {this.swipeable.recenter(); this.props.done(this.props.id)}}
        >
       <Icon.MaterialIcons
          style={{
            position: 'absolute',
            right: 10,
            top: 15,
            color: '#c43131',
            fontSize: 25,
           }}
        name={'done'} />
          </TouchableHighlight>,
      // <TouchableHighlight style={{
      //   flex: 1,
      //   padding: 15,
      //   backgroundColor: this.state.swipeOpen ? '#31a2ac' : '#890202',
      //   }}
      //   underlayColor={this.state.swipeOpen ? '#31a2ac' : '#890202'}
      //   onPress={() => this.props.hide(this.props.id)}
      //   >
      //   {!this.state.swipeOpen ? 
      //   <Icon.MaterialIcons
      //     style={{
      //       position: 'absolute',
      //       right: 20,
      //       top: 15,
      //       fontSize: 25,
      //       color: '#fff'}}
      //   name='delete' />
      //    : <Text></Text> }
      //      : <Icon.MaterialIcons
      //     style={{
      //       position: 'absolute',
      //       right: 22,
      //       top: 15,
      //       fontSize: 25,
      //       color: '#fff'}}
      //     name='archive' /> }
      // </TouchableHighlight>,
      
    ];

    if (!this.props.completed) {
      return (
        <Swipeable
          onRef={ref => this.swipeable = ref}
          style={{
            left: this.state.removed ? 700 : 0,
          }}
          swipeStartMinDistance={40}
          onSwipeStart={() => this.props.swiping(1)}
          onSwipeRelease={() => this.props.swiping(0)}
          leftButtons={leftContent}
          leftButtonWidth={0}
          leftActionActivationDistance={100}
          onLeftActionActivate={ () => this._swipeActivation(1) }
          onLeftActionDeactivate={ () => this._swipeActivation(0) }
          onLeftActionRelease={async () => {
            await LayoutAnimation.configureNext(SwipeItemAnimation);
            await setTimeout(() => this.setState({removed: true}), 0);
            // await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
            await setTimeout(() => this.props.done(this.props.id), 300);
            // await setTimeout(() => this.setState({removed: false}), 150);
          }}
          >
          <TouchableWithoutFeedback
            onPress={this._expand}>

              <View style={{flexDirection: 'column'}}>
                <View style={[ this.state.swipeOpen ? styles.itemDone : styles.item, {width: screenWidth, borderBottomColor: this.state.edit ? '#fff' : '#eee'}]}>
                  { this.state.editText ?
                    <TextInput
                      defaultValue={this.props.text}
                      maxLength={60}
                      autoCorrect={false}
                      name="newText"
                      underlineColorAndroid="#fff"
                      onChangeText={(newText) => this.setState({newText})}
                      blurOnSubmit={true}
                      style={{
                        top: -5,
                        marginLeft: 8,
                        lineHeight: 23,
                        paddingBottom: 5,
                        paddingRight: 80,
                        fontSize: 16,
                        color: '#191919',
                        width: screenWidth - 45,
                      }}
                      autoFocus={true} >
                    </TextInput>
                  //   <RkButton
                  //   style={styles.submitBtn}
                  //   onPress={() => {
                  //     this.state.text ? this.props.add(this.state.text, this.state.dueDate) : null;
                  //   }}
                  //   rkType='rounded'>
                  //   <Icon.MaterialIcons
                  //     name='add'
                  //     style={{
                  //       position: 'absolute',
                  //       color: '#fff',
                  //       top:5,
                  //       fontSize: 20,
                  //     }} />
                  // </RkButton>
                  :
                    <Text style={ this.state.swipeOpen ? styles.textDone : styles.text }>
                      { this.props.text }
                    </Text>
                  }
                  <Text style={styles.time}>
                    { this._getSetDate() }
                  </Text>

                  {this.props.reminder && <View style={ styles.reminderSet }>
                    <Icon.Ionicons style={ styles.bell } name="ios-notifications-outline" />
                    <Text style={ styles.reminderTime }>
                      { this.props.reminder }
                    </Text>
                  </View>}
                  { this.state.editText ?
                    <View style={{flex: 1, flexDirection: 'row', left: -80}}>
                      <RkButton style={{width: 50, backgroundColor: 'transparent'}}
                        onPress={ async () => {await this.props.editItem(this.props.id, this.state.newText); this.setState({editText: false})} }>
                      <Icon.Ionicons
                        style={[ styles.editTextBtn, {color: '#2869d3'} ]}
                        name="ios-checkmark-circle-outline" />
                      </RkButton>
                      <RkButton style={{width: 50, backgroundColor: 'transparent', marginLeft: -5}}
                        onPress={() => this.setState({editText:false})}>
                      <Icon.Ionicons
                        style={[ styles.editTextBtn, {color: '#c43131'} ]}
                        name="ios-close-circle-outline" />
                    </RkButton>
                    </View>
                  : <Text style={styles.due}>
                    { this.props.completed ? 'done' : this._getDueDate() }
                    </Text>
                  }
                </View>
                {this.state.edit &&
                <View style={ styles.itemOpt }>
                   <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(FadeItemAnimation); this.setState({editText: true}); this.setState({edit: false})}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn ]}
                      name="md-checkmark" />
                  </RkButton>
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(FadeItemAnimation); this.setState({editText: true}); this.setState({edit: false})}}>
                    <Icon.SimpleLineIcons
                      style={[ styles.editBtn, {fontSize: 20, top: -6} ]}
                      name="pencil" />
                  </RkButton>
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.expand(false)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn ]}
                      name="ios-calendar-outline" />
                  </RkButton>
                  
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.schedule(this.props.text, this.props.id); this.props.expand(false)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn]}
                      name="ios-alarm-outline" />
                  </RkButton>
                  
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.props.delete(this.props.id)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn ]}
                      name="ios-trash-outline" />
                  </RkButton>
                </View>
                }
              </View> 
          </TouchableWithoutFeedback>
        </Swipeable>
      );
    } else {
      return null;
    }
  }
}

class MoreBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: false,
    }
  }

  render() {
    return (
    <View>
      {this.state.popup && <PopUpTop />}
      <Icon.Ionicons
        onPress={async () => {await LayoutAnimation.configureNext(ListItemAnimation); this.setState({popup: !this.state.popup})}}
        style={{
          color: '#c43131',
          fontSize: 22,
          paddingHorizontal: 15,
        }}
        name='ios-more' />
      </View>
    );
  }
}

const MenuBtn = (props) => (  
  <Icon.Ionicons
    onPress={() => props.nav.goBack(null)}
    style={{
      color: '#c43131',
      fontSize: 22,
      paddingHorizontal: 15,
    }}
    name='ios-menu' />
)

const PopUpTop = (props) => {
  return (
    <View style={ styles.PopUpTop }>
      <TouchableHighlight style={ styles.PopUpBtn } underlayColor={'rgba(245,245,245,0.7)'} onPress={() => {null}}>
        <Text style={ styles.PopUpText }>Mark Multiple</Text>
      </TouchableHighlight>
      <View style={ styles.separator } />
      <TouchableHighlight style={ styles.PopUpBtn } underlayColor={'rgba(245,245,245,0.7)'} onPress={() => {null}}>
        <Text style={ styles.PopUpText }>Do smth else</Text>
      </TouchableHighlight>
    </View>
  );
}

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
      isSwiping: false,
      removed: false,
      timepicker: false,
      reminder: false,
      reminderBody: false,
      showCal: false,
    };
    this._bootstrapAsync();
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <MoreBtn nav={navigation} />,
      headerLeft: <MenuBtn nav={navigation} />,
    }
  };

  _bootstrapAsync = async () => {
    await this._getUpdate();
    console.log(this.state.dataSource)
  }

  componentWillUnmount() {
    this.props.navigation.state.params.updateToday();
    this.props.navigation.state.params.update();
  }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
  }

  _addItem = async (text, due) => {
    await this._toogleModal();
    let date = await new Date();
    let thisID = 0;
    await db.transaction(async tx => {
        await tx.executeSql(`insert into tasks (text, hours, minutes, day, date, month, due) values
          (?, ?, ?, ?, ?, ?, ?); select last_insert_rowid();`, [
            text,
            date.getHours(),
            date.getMinutes(),
            date.getDay(),
            date.getDate(),
            date.getMonth(),
            due === '' ? null :
              due === 'tomorrow' ? date.getDay() + 1 :
                due === 'today' ? date.getDay() : 7
          ], async (_, res) => {
            thisID = await res['insertId'];
          }
        );
      }
    );
    await this._getUpdate();
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({deleted: false});    
    await this.setState({updated: true});
  }

  _getUpdate = () => {
    db.transaction(tx => {
        tx.executeSql(`select * from tasks where completed = 0 order by id desc;`,[], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
      );
    });
  }

  _delete = async (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from tasks where id = ?`, [id]);
    });
    await this._getUpdate();
    LayoutAnimation.configureNext( SwipeItemAnimation );
    await this.setState({updated: true});
    this.setState({editText: false});
  }

  _done = async (i) => {
    this.setState({removed: i});
    db.transaction(tx => {
        tx.executeSql(`update tasks set completed = 1 where id = ?`,[i]
      );
    });
    await this._getUpdate();
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({updated: true});
  }

  _edit = async (i, text) => {
      db.transaction(tx => {
        tx.executeSql(`update tasks set text = ? where id = ?`,[text, i]
      );
    });
    LayoutAnimation.configureNext( FadeItemAnimation );
    await this.setState({updated: true});
  }

  // _archive = async (i) => {
  //   let n = await this.state.dataSource.findIndex(x => x.index === i);
  //   LayoutAnimation.configureNext( ListItemAnimation );        
  //   this.state.dataSource[n].archive = !this.state.dataSource[n].archive;
  //   await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
  //   await this.setState({updated: true});
  // }

  // _delete = async (i) => {
  //   let d = await AsyncStorage.getItem('todos');
  //   let n = await this.state.dataSource.findIndex(x => x.index === i);
  //   LayoutAnimation.configureNext( ListItemAnimation );        
  //   await this.state.dataSource.splice(n, 1);
  //   await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
  //   await this.setState({deleted: JSON.parse(d)});
  //   await this.setState({updated: true});
  // }

  _recover = async () => {
    await db.transaction(tx => {
        tx.executeSql(`update tasks set completed = 0 where id = ?`, [this.state.removed], () => {
          this.setState({removed: false});
        }
      );
    });
    await this._getUpdate();
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({updated: true});
  }

  // _restore = async () => {
  //   let n = await this.state.deleted;
  //   await LayoutAnimation.configureNext( ListItemAnimation );        
  //   await this.setState({dataSource: n});
  //   await AsyncStorage.setItem('todos', JSON.stringify(n));
  //   await this.setState({deleted: false});
  //   await this.setState({dismissed: false});
  //   await this.setState({updated: true});
  // }

  _update = async () => {
    await this.setState({updated: true});
    await this._bootstrapAsync();
    await this.setState({updated: false});
  }

  _swipeHandler = (i) => {
    if (i === 1) {
      this.setState({isSwiping: true});
    } else if (i === 0) {
      this.setState({isSwiping: false});
    }
  }

  _scheduleNotification = (when) => {
    return new Promise(resolve => {
      Permissions.askAsync(Permissions.NOTIFICATIONS);
      let localNoti = {
        title: 'Reminder:',
        body: this.state.reminderBody,
        ios: {
          sound: true,
        },
      };

      let time = when.getTime();
      let reminderTime = when.getDate() + '/' + (when.getMonth() + 1) + ' at ' + when.getHours() + ':' + when.getMinutes();
      let schedulingOptions = {
        time: time,
      };
      db.transaction(tx => {
          tx.executeSql(`update tasks set reminder = ? where id = ?`, [reminderTime, this.state.reminderId]
        );
      });
      Expo.Notifications.scheduleLocalNotificationAsync(localNoti, schedulingOptions)
        .then((res) => resolve(res));
    });
  }

  _toogleTimePicker = (body, id) => {
    this.setState({reminderBody: body, reminderId: id});
    this.setState({timepicker: !this.state.timepicker});
  }

  _saveReminderTime = (time) => {
    let today = new Date();

    if (time > today) {
      this._scheduleNotification(time)
        .then(() =>  {
          this._toogleTimePicker();
          setTimeout(() => AlertIOS.alert('Reminder has been set'), 400);
        }
      );
      this.setState({reminderBody: false});
    }
  }

  render() {
    let today = new Date();

    return (
      <View style={styles.container}>
       
        <FlatList
          scrollEnabled={!this.state.isSwiping}      
          refreshing={this.state.refreshing}
          onRefresh={this._update}
          data={this.state.dataSource}
          style={ styles.container }
          keyExtractor={item => item.id.toString()}
          // extraData={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <ListItem {...item} delete={this._delete} editItem={this._edit} today={today} done={this._done} hide={this._archive} swiping={this._swipeHandler} schedule={this._toogleTimePicker} expand={(i) => this.setState({expanded: i})} expanded={this.state.expanded} />}
          />
        <Popup visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem}
          change={this._onChange} />
        <AddBtn onPress={this._toogleModal} />
        <DateTimePicker
          isVisible={this.state.timepicker}
          mode='datetime'
          onConfirm={this._saveReminderTime}
          onCancel={this._toogleTimePicker}
        />
        {this.state.removed && <RecoverBtn onPress={this._recover} />}
        {/* {this.state.showCal && <CalendarList
            style={{position: 'absolute', top: 60}}
            horizontal={true}
            pagingEnabled={true}
            calendarWidth={screenWidth}
            scrollEnabled={true}
            showScrollIndicator={false}
            current={this.state.CalendarSelected}
            markedDates={this.state.CalendarSelected}
            minDate={Date()}
            maxDate={'2025-05-30'}
            onDayPress={(day) => {
                let d = '{"' + day['dateString'] + '": {"selected": true, "marked": false, "selectedColor": "#c43131"}}';
                this.setState({
                  CalendarSelected: JSON.parse(d)
              })}
            }
            onDayLongPress={(day) => {console.log('selected day', day)}}
            monthFormat={'MMM yyyy'}
            onVisibleMonthsChange={(month) => {console.log('month changed', month)}}
            hideArrows={true}
            renderArrow={(direction) => (<Arrow />)}
            hideExtraDays={true}
            disableMonthChange={false}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#b6c1cd',
              selectedDayBackgroundColor: '#c43131',
              todayTextColor: '#c43131',
            }}
          /> } */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    minHeight: 60,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemOpt: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    height: 40,
    flexDirection: 'row',
    backgroundColor: 'rgba(240,240,240,1)',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    shadowOffset:{ bottom: 5 },
    shadowColor: '#777',
    shadowRadius: 3,
    shadowOpacity: 0,
  },
  itemDone: {
    flex: 1,
    padding: 12,
    minHeight: 60,
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
    marginLeft: 1,
    maxWidth: screenWidth - 120,
    fontSize: 16,
    color: '#292929',
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
    left: 13,
    fontSize: 12,
    color: '#777',
  },
  due: {
    position: 'absolute',
    top: 10,
    right: 13,
    fontSize: 14,
    color: '#777',
  },
  edit: {
    backgroundColor: 'transparent',
    left: -15,
    width: screenWidth / 5,
  },
  editBtn: {
    top: -7,
    right: 0,
    fontSize: 27,
    color: '#555'
  },
  editTextBtn: {
    top: 0,
    fontSize: 30,
  },
  PopUpTop: {
    position: 'absolute',
    top: 24,
    right: 12,
    width: 120,
    height: 64,
    borderColor: '#eee',
    padding: 5,
    shadowColor: '#555',
    shadowOffset: {bottom: 5},
    shadowOpacity: 0.75,
    shadowRadius: 5,
    borderWidth: 1,
    borderRadius: 20,
    borderTopRightRadius: 0,
    backgroundColor: '#fefefe',
    zIndex: 5,
  },
  PopUpText: {
    color: '#444',
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  PopUpBtn: {
    height: 27,
    borderRadius: 20,
  },
  reminderSet: {
    position: 'absolute',
    bottom: 4,
    right: 15,
    height: 20,
    width: 92,
  },
  reminderTime: {
    top: 2,
    left: 15,
    fontSize: 12,
    color: '#777',
    fontStyle: 'italic',
  },
  bell: {
    position: 'absolute',
    fontSize: 13,
    top: 2.5,
    left: 2,
  },
  recoverPop: {
    position: 'absolute',
    backgroundColor: '#fefefe',
    height: 29,
    width: 110,
    bottom: 34,
    left: (screenWidth / 2) - 55,
    borderColor: '#e3e3e3',
    borderRadius: 12,
    borderWidth: 0.8,
    shadowColor: '#555',
    shadowOffset: {bottom: 5},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recoverPopText: {
    color: '#777',
    top: 5,
    left: 14
  },
  separator: {
    top: -2,
    backgroundColor: '#bbb',
    height: 0.6,
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
