import React from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { Icon, SQLite, Notifications, Permissions, Contacts, LinearGradient } from 'expo';
import { MaterialIcons, Ionicons, Foundation, SimpleLineIcons } from '@expo/vector-icons';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import Swipeable from 'react-native-swipeable';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  AlertIOS,
  DatePickerIOS,
} from 'react-native';
import PouchDB from 'pouchdb-react-native'
const dba = new PouchDB('mydb')

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const TimePickerAnimation = {
  duration: 350,
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
  update: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
  delete: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.easeOut,
  },
}
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
  duration: 330,
  create: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  update: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
  },
  delete: {
    property: LayoutAnimation.Properties.scaleXY,
    type: LayoutAnimation.Types.easeOut,
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
  // <Fab
  //     direction="up"
  //     containerStyle={{ }}
  //     style={{ backgroundColor: '#c43131' }}
  //     position="bottomRight"
  //     onPress={onPress}>
    <TouchableOpacity
      style={{
        position: 'absolute',
        bottom: 0,
        height: 60,
        width: screenWidth,
      }}
      onPress={onPress}>
      <Icon.Ionicons name={'ios-add'} style={{color: '#c43131', textAlign: 'center', fontSize: 52}} />
    </TouchableOpacity>
  // </Fab>
)

export class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      dueDate: '',
      tag: [],
      day: '',
      time: '',
      timepicker: false,
      chosenDate: new Date()
    }
    this.contacts = [];
  }

  setDate = (newDate) => {
    this.setState({chosenDate: newDate})
  }

  async componentDidMount() {
    // this.contacts = await Contacts.getContactsAsync({
    //   fields: [Contacts.Fields.PhoneNumbers],
    // });
    // console.log(this.contacts);
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

  _timeParse = (time) => {
    let parseRegexp = /(\d{1,2}:\d{2})|(\d{1,2})/;

    let date = new Date();
    date.setSeconds(0);

    let str = time.match(parseRegexp);
    if (time.includes(':')) {
      let tmp = time.split(':');
      if (time.includes('pm')) {
        if (tmp[0] === '12') {
          date.setHours(parseInt(tmp[0]));
        } else {
          date.setHours(parseInt(tmp[0]) + 12);          
        }
      } else {
        if (tmp[0] === '12') {
          date.setHours(parseInt(tmp[0]) + 12);  
        } else {
          date.setHours(parseInt(tmp[0]));        
        }
      }
      date.setMinutes(tmp[1].match(/\d{2}/)[0]);
    } else {
      date.setMinutes(0);
      if (time.includes('pm')) {
        if (str[0] === '12') {
          date.setHours(parseInt(str[0]));
        } else {
          date.setHours(parseInt(str[0]) + 12);          
        }
      } else {
        console.log(str);
        if (str[0] === '12') {
          date.setHours(parseInt(str[0]) - 12);  
        } else {
          date.setHours(parseInt(str[0]));        
        }
      }
    }
    return date;
  }

  _timeManager = () => {
    const timeRegexp = /( at \d{1,2}:\d{2}[ap]m)|( at \d{1,2}[ap]m)/;

    if (this.state.text.toLowerCase().match(timeRegexp)) {
      // this._timeParse(this.state.text.toLowerCase().match(timeRegexp)[0].substr(4,7));
      this.setState({time: this.state.text.toLowerCase().match(timeRegexp)[0].substr(4,10)});
    } else {
      this.setState({time: ''});
    }
  }

  _dayManager = () => {
    if (this.state.text.toLowerCase().includes('today')) {
      this.setState({day: 'Today'});
    } else if (this.state.text.toLowerCase().includes('tomorrow')) {
      this.setState({day: 'Tomorrow'});
    } else {
      this.setState({day: ''});
    }
  }

  _tagManager = (tag) => {
    if (tag && this.state.tag.length < 3) {
      console.log(this.state.tag)
      let a = this.state.tag;
      a.push(tag);
      this.setState({tag: a});
    } else if (this.state.tag.length < 3 && this.state.text) {
      if (this.state.text.toLowerCase().includes('buy') && (!this.state.tag || !this.state.tag.join(' ').includes('buy'))) {
        this.state.tag.push('buy');
      } else if (this.state.text.toLowerCase().includes('call') && (!this.state.tag || !this.state.tag.join(' ').includes('call'))) {
        this.state.tag.push('call');
      } 
    }
  }

  _tagDelete = (e) => {
    let a = this.state.tag.join(' ').replace(e, '').replace('  ', ' ').trim();
    console.log(a);
    this.setState({tag: a ? a.split(' ') : []});
  }

  _input = (e) => {
    this.setState({text: e});
    this._tagManager();
    this._timeManager();
    this._dayManager();
    if (!e && this.state.tag) {
      this.setState({tag: []});
    }
  }

  _submit = async () => {
    await this.state.text ? this.props.add(this.state.text, this.state.day, this.state.tag.join(' ').toLowerCase(), this.state.time ? this._timeParse(this.state.time) : null) : null;
    this.setState({text: '', tag: [], time: '', day: ''});
  }

  
  render() {
    let Taglist = TagsListFull.map((tag, i) => {
      if (!this.state.tag.join(' ').includes(tag.keyword)) {
        return (
          <TouchableOpacity onPress={() => this._tagManager(tag.keyword)} key={ i }>
            <Text
              style={[styles.tag, {marginVertical: 3, color: '#c41313', borderWidth: 1, borderColor: '#c41313', backgroundColor: '#fff'}]}
              >#{tag.keyword}</Text>
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    });

    let Tags = <Text style={styles.tagPlace}>#SpaceForTags</Text>;
    if (this.state.tag[0]) {
      // let tmp = this.state.tag;
      // if (this.state.day && !tmp.includes(this.state.day)) {tmp.push(this.state.day)}
      Tags = this.state.tag.map((tag, i) => {
        return <Text onPress={() => this._tagDelete(tag)} style={styles.tag} key={ i }>#{tag}</Text>
      })
    }

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <TouchableOpacity style={{flex: 1}} onPress={() => {this.setState({timepicker: false}); this.props.close()}} activeOpacity={1} />
        <View style={{position: 'absolute', bottom: this.state.timepicker ? 0 : -100, borderColor: '#ccc', shadowColor: '#999', shadowOpacity: 0.2, shadowRadius: 5,
          borderWidth: 1, backgroundColor: '#fff', height: 270, width: screenWidth, overflow: 'hidden', zIndex: 2010}}>
            {this.state.timepicker && <DatePickerIOS
              style={{backgroundColor: 'transparent', height: 170}}
              date={this.state.chosenDate}
              onDateChange={this.setDate}
            />}
            <TouchableOpacity onPress={() => {this.taskIn.focus(); LayoutAnimation.configureNext(TimePickerAnimation); this.setState({timepicker: false})}} style={{position: 'absolute', bottom: 25, left: 70}}><Text style={{fontSize: 20, color: '#999'}}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={{position: 'absolute', bottom: 25, right: 70}}><Text style={{fontSize: 20, color: '#c41313'}}>Confirm</Text></TouchableOpacity>
          </View>
          <View style={{
            position: 'relative',
            bottom: this.state.timepicker ? -60 : 0,
            height: screenHeight > 800 ? 365 : 328,
            width: screenWidth,
            borderColor: '#ccc',
            // borderRadius: 11,
            // borderTopRightRadius: 0,
            shadowColor: '#999',
            padding: 5,
            // paddingTop: this.state.timepicker ? 100 : 0,
            // shadowOffset: 2,
            shadowOpacity: 0.2,
            shadowRadius: 5,
            borderWidth: 1,
            backgroundColor: '#fff'
          }}>
          {/* <DateTimePicker
              isVisible={this.state.timepicker}
              mode='datetime'
              onConfirm={(d) => this.setState({picked: d, timepicker: false})}
              onCancel={() => this.setState({timepicker: false})}
            /> */}
             
            <TouchableOpacity onPress={() => {Keyboard.dismiss(); LayoutAnimation.configureNext(TimePickerAnimation); this.setState({timepicker: !this.state.timepicker})}} style={{position: 'absolute', right: -25, top: 76, width: 80} }>
                <Text
                  style={[styles.tag, {paddingLeft: 8, marginVertical: 3, color: this.state.time ? '#fff' : '#c41313', borderWidth: 1, borderColor: '#c41313', backgroundColor: this.state.time ? '#c41313' : '#fff'}]}
                  >Time</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{position: 'absolute', right: -30, top: 15, width: 80} }>
                <Text
                  style={[styles.tag, {paddingLeft: 8, marginVertical: 3, color: '#fff', borderWidth: 1, borderColor: '#c41313', backgroundColor: '#c41313'}]}
                  >Add</Text>
            </TouchableOpacity> */}
            <TextInput
              ref={ref => this.taskIn = ref}
              placeholder='Type it in'
              maxLength={60}
              selectionColor='#c41313'
              // clearButtonMode='always'
              autoCorrect={false}
              name="text"
              underlineColorAndroid="#fff"
              value={this.state.text}
              onChangeText={this._input}
              blurOnSubmit={false}
              onSubmitEditing={this._submit}
              style={{fontSize: 16, padding: 11, paddingRight: 40}}
              autoFocus={true} />
              <RkButton
                style={styles.submitBtn}
                onPress={this._submit}
                rkType='rounded'>
                <Icon.MaterialIcons
                  name='add'
                  style={{
                    position: 'absolute',
                    color: '#fff',
                    top:5,
                    fontSize: 20,
                  }} />
              </RkButton>
              <View
                style={{display: 'flex', width: screenWidth, flexDirection: 'row'}}>
                { Tags }
                {this.state.day && <Text style={[styles.tag, {color: '#c43131', backgroundColor: '#fff', paddingHorizontal: 0, marginHorizontal: 2}]}>{this.state.day}</Text>}
                {this.state.time && <Text style={[styles.tag, {color: '#c43131', backgroundColor: '#fff', paddingHorizontal: 0, marginHorizontal: 2}]}>@{this.state.time}</Text>}
                {/* <RkButton
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: 110,
                    height: 30,
                    backgroundColor: 'transparent',
                    }}>
                  <Text
                    style={{ 
                      top: -5,
                      right: -10,
                      textAlign: 'right',
                      color: this.state.text.length >= 60 ? '#c43131' : '#999',
                      fontSize: 13,
                    }}>{this.state.text.length}/60</Text>
                </RkButton> */}
              </View>
              <LinearGradient start={[1,1]} end={[0,1]} locations={[0.4, 1]} style={{position: 'absolute', right: 50, top: 70, width: 25, height: 35, zIndex: 1205}} colors={['#fff', 'rgba(255,255,255,0)']} />
              <ScrollView contentContainerStyle={{paddingRight: 10}}  keyboardShouldPersistTaps='always' keyboardDismissMode='none' horizontal={true} style={styles.tagRow}>
              { Taglist }
              
            </ScrollView>
            
          </View>
      </Modal>
    );
  }
}

const TagsListFull = [
  {id: 0, name: 'Shopping', keyword: 'buy'},
  {id: 1, name: 'Calls', keyword: 'call'},
  {id: 2, name: 'Work', keyword: 'work'},
  {id: 3, name: 'Home', keyword: 'home'},
  {id: 4, name: 'Errands', keyword: 'misc'},
  {id: 5, name: 'Shared', keyword: 'shared'},
];

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
    if (this.props.expanded && this.props._id === this.props.expanded) {
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
      return '';
    }
  }

  _getSetDate = () => {

    if (this.props.hours >= 0 && this.props.minutes >= 0) {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      return hr + ':' + min;
    }

    // if (this.props.today.getDay() === this.props.day && this.props.today.getMonth() == this.props.month) {
    //   let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
    //   let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
    //   return hr + ':' + min;
    // } else if (this.props.day === 6 ? this.props.today.getDay() == 0 : this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
    //   let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
    //   let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
    //   return 'Yesterday at ' + hr + ':' + min;
    // } else {
    //   let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
    //   let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
    //   let day = this.props.date < 10 ? '0' + this.props.date : this.props.date;
    //   let month = this.props.month < 10 ? '0' + this.props.month : this.props.month;
    //   return day + '/' + month + ' at ' + hr + ':' + min;
    // }
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
    this.props.expand(this.state.edit ? null : this.props._id);
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
        onPress={() => {this.swipeable.recenter(); this.props.done(this.props._id)}}
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
      //   onPress={() => this.props.hide(this.props._id)}
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
            await setTimeout(() => this.props.done(this.props._id), 300);
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
                      numberOfLines={1}
                      autoCorrect={false}
                      returnKeyType='done'
                      name="newText"
                      onSubmitEditing={() => {if (this.state.newText) {this.props.editItem(this.props._id, this.state.newText)} this.setState({editText: false}); this.props.expand(false)} }
                      underlineColorAndroid="#fff"
                      onChangeText={(newText) => this.setState({newText})}
                      blurOnSubmit={true}
                      onBlur={() => {if (this.state.newText) {this.props.editItem(this.props._id, this.state.newText)} this.setState({editText: false}); this.props.expand(false)} }
                      style={{
                        top: 2,
                        marginLeft: 1,
                        lineHeight: 23,
                        paddingBottom: 5,
                        paddingRight: 80,
                        fontSize: 18,
                        color: '#191919',
                        width: screenWidth - 25,
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
                    <Text style={ this.state.swipeOpen ? styles.textDone : styles.text } numberOfLines={this.state.edit ? 5 : 1}>
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
                  {/* { this.state.editText ?
                    <View style={{flex: 1, flexDirection: 'row', left: -80}}>
                      <RkButton style={{width: 50, backgroundColor: 'transparent'}}
                        onPress={ async () => {await this.props.editItem(this.props._id, this.state.newText); this.setState({editText: false})} }>
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
                  :  */}
                    <Text style={styles.due}>
                    { this.props.completed ? 'done' : this._getDueDate() }
                    </Text>
 
                </View>
                {this.state.edit &&
                <View style={ styles.itemOpt }>
                   <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.done(this.props._id); this.props.expand(false)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn ]}
                      name="md-checkmark" />
                  </RkButton>
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.setState({editText: true}); this.props.expand(false)}}>
                    <Icon.SimpleLineIcons
                      style={[ styles.editBtn, {fontSize: 20, top: -6} ]}
                      name="pencil" />
                  </RkButton>
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.showCal(); this.props.expand(false)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn ]}
                      name="ios-calendar-outline" />
                  </RkButton>
                  
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.schedule(this.props.text, this.props._id); this.props.expand(false)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn]}
                      name="ios-alarm-outline" />
                  </RkButton>
                  
                  <RkButton style={ styles.edit }
                    onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.props.delete(this.props._id)}}>
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
    console.log(this.props.nav)
    return (
    <View>
      {this.state.popup && <PopUpTop />}
      <Icon.Ionicons
        onPress={() => this.props.nav.state.params.addTask()}
        style={{
          color: '#c43131',
          top: 2,
          fontSize: 32,
          paddingHorizontal: 15,
        }}
        name='ios-add' />
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
    this.props.navigation.state.params.addTask = this._toogleModal;
  }

  componentWillUnmount() {
    this.props.navigation.state.params.updateToday();
    this.props.navigation.state.params.update();
  }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
  }

  _addItem = async (text, due, tags, time) => {
    await this._toogleModal();
    let date = await new Date();
    let dueDate = due === '' ? null :
      due === 'Tomorrow' ? date.getDate() + 1 :
        due === 'Today' ? date.getDate() : null;
    let hr = time ? time.getHours() ? time.getHours() : time.getHours() == 0 ? time.getHours() : -1 : -1;
    let min = time ? time.getMinutes() ? time.getMinutes() : time.getMinutes() == 0 ? time.getMinutes() : -1 : -1;
    dba.put({
      '_id': date.getTime().toString(),
      'type': 'task', 'text': text,
      'hours': hr, 'minutes': min,
      'day': dueDate ? dueDate : null, 'date': date.getDate(), 'month': date.getMonth(),
      'due': dueDate, 'tag': tags,
      'completed': 0, 'reminder': null })
    if (time && time.getHours() && (date.getHours() <= time.getHours() &&  date.getMinutes() < time.getMinutes())) {
      this._scheduleNotification(dueDate, time, text);
    }
    await this._getUpdate();
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({deleted: false, updated: true});
  }

  _getUpdate = () => {
    dba.createIndex({
      index: {fields: ['completed']}
    })
    dba.find({
      selector: {
        completed: 0,
        type: 'task',
      },
      sort: ['_id'],
    }).then((res) => {
      console.log(res.docs)
      this.setState({ dataSource: res.docs.reverse() })
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
    LayoutAnimation.configureNext( ListItemAnimation );
    this._getUpdate();
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
      let reminderTime = (when.getDate() < 10 ? '0' + when.getDate() : when.getDate()) + '/' + ((when.getMonth() + 1 < 10) ? '0' + (when.getMonth() + 1) : (when.getMonth() + 1)) + ' at ' + (when.getHours() < 10 ? '0' + when.getHours() : when.getHours()) + ':' + (when.getMinutes() < 10 ? '0' +  when.getMinutes() :  when.getMinutes());
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
          keyExtractor={item => item._id.toString()}
          // extraData={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <ListItem {...item} delete={this._delete} editItem={this._edit} today={today} done={this._done} hide={this._archive} swiping={this._swipeHandler} schedule={this._toogleTimePicker} expand={(i) => this.setState({expanded: i})} expanded={this.state.expanded} showCal={() => this.setState({showCal: !this.state.showCal})} />}
          />
        <Popup visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem}
          change={this._onChange} />
        {/* <AddBtn onPress={this._toogleModal} /> */}
        <DateTimePicker
          isVisible={this.state.timepicker}
          mode='datetime'
          onConfirm={this._saveReminderTime}
          onCancel={this._toogleTimePicker}
        />
        {this.state.removed && <RecoverBtn onPress={this._recover} />}
        <Modal visible={this.state.showCal} transparent={true} animationType='slide' >
          <TouchableOpacity style={{flex: 1}} onPress={() => this.setState({showCal: !this.state.showCal})} />
          <View
            style={{flexDirection: 'row', position: 'absolute', bottom: 340}}>
            <RkButton
              style={ styles.dueDateMod }
              onPress={() => this._addDueDate('today')} >
            <Text
              style={styles.dueDateModText}>
                Today
              </Text>
            </RkButton>
            <RkButton
              style={ styles.dueDateMod }
              onPress={() => this._addDueDate('tomorrow')} >
            <Text 
              style={styles.dueDateModText}>
                Tomorrow
              </Text>
            </RkButton>
            <RkButton
              style={ styles.dueDateMod }
              onPress={() => this._addDueDate('week')} >
            <Text
              style={styles.dueDateModText}>
                This Week
              </Text>
            </RkButton>
            <RkButton
              style={ styles.dueDateMod }>
              <Text
                style={styles.dueDateModText}>
                  {this.state.CalendarSelected && this.state.CalendarSelected.day}
                </Text>
            </RkButton>
          </View>
          {/* <CalendarList
            style={{position: 'absolute', bottom: 0}}
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
                let d = '{"' + day['dateString'] + '": {"selected": true, "marked": false, "selectedColor": "#c43131"}, "day": "' + day['dateString'] + '"}';
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
          /> */}
          </Modal>
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
  dueDateMod: {
    top: -5,
    // width: 90,
    padding: 0,
    margin: 0,
    maxWidth: screenWidth / 4,
    backgroundColor: '#fff',
  },
  dueDateModText: {
    position: 'absolute',
    left: 0,
    // top: -8,
    color: '#555',
    fontSize: 16,
    width: 'auto',
    // width: screenWidth / 4,
    textAlign: 'left'
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
    minHeight: 62,
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
    minHeight: 62,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    opacity: 0.3,
  },
  text: {
    top: 7,
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 1,
    maxWidth: screenWidth - 120,
    fontSize: 18,
    color: '#292929',
  },
  textDone: {
    top: 7,
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 1,
    maxWidth: screenWidth - 120,
    fontSize: 18,
    color: '#191919',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  time: {
    position: 'absolute',
    bottom: 21,
    right: 13,
    fontSize: 12,
    fontWeight: '200',
    color: '#888',
  },
  due: {
    position: 'absolute',
    top: 8,
    right: 13,
    fontSize: 14,
    fontWeight: '200',
    color: '#888',
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
    right: 21,
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

  tagRow: {
    position: 'relative', 
    zIndex: 1104, 
    height: 25,
    top: 0,
    paddingTop: 5,
    marginRight: 70,
    width: screenWidth - 65,
    marginHorizontal: 0,
  },
  tag: {
    // position: 'absolute',
    overflow: 'hidden',
    backgroundColor: '#c43131',
    borderRadius: 12,
    top: -4,
    left: 1,
    fontSize: 15,
    padding: 2.5,
    height: 25,
    paddingHorizontal: 8,
    color: '#fff',
    zIndex: 100,
    margin: 0,
    marginHorizontal: 5,
    
  },
  tagPlace: {
    top: -4,
    left: 0,
    fontSize: 15,
    padding: 2.5,
    height: 25,
    paddingHorizontal: 5,
    color: '#999',
    zIndex: 100,
    margin: 0,
    marginHorizontal: 5,
  }
});
