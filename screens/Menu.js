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
import HomeScreen, {Popup} from './HomeScreen';
import SmartTags from './SmartTags';

const db = SQLite.openDatabase('mneme.db');
const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

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

const WeatherAnimation = {
  duration: 335,
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
}

const IntroAnimation = {
  duration: 305,
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
}
// class SmallFolder extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       count: '',
//       lastItem: '',
//     };
//     this._getCount();
//   }

//   _getCount = () => {
//     db.transaction(async tx => {
//         tx.executeSql(`select count(*) from ` + this.props.route + `;`, [],
//             (_, { rows: { _array } }) => {
//                 this.setState({count: _array[0]['count(*)']})
//             }
//         );
//     });
//     db.transaction(async tx => {
//         tx.executeSql(`select * from ` + this.props.route + ` order by id desc limit 1;`, [],
//             (_, { rows: { _array } }) => {
//                 this.setState({lastItem: _array[0]})
//             }
//         )
//     });
//   }

//   _getSetDate = () => {
//     let today = new Date();

//     if (!this.state.lastItem) {return 'New'}
//     if (today.getDay() == this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
//       let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
//       let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
//       return 'Last modified at ' + hr + ':' + min;
//     } else if (this.state.lastItem.day === 6 ? today.getDay() === 0 : today.getDay() - 1 === this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
//       let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
//       let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
//       return 'Last modified yesterday at ' + hr + ':' + min;
//     } else {
//       let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
//       let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
//       let day = this.state.lastItem.date < 10 ? '0' + this.state.lastItem.date : this.state.lastItem.date;
//       let month = this.state.lastItem.month < 10 ? '0' + this.state.lastItem.month : this.state.lastItem.month;
//       return 'Last modified ' + day + '/' + month + ' at ' + hr + ':' + min;
//     }
//   }

//   render() {
//     if (this.props.caption === 'Add') {
//       return (
//         <TouchableHighlight
//             style={[ styles.smallMenuBtn , {backgroundColor: '#efefef'} ]}
//             underlayColor={'rgba(29, 29, 29, 0.11)'}
//             onPress={() => this.props.navigation.navigate(this.props.route)}>
//             <Icon.Ionicons
//                 style={ styles.addIcon }
//                 name="ios-add" />
//         </TouchableHighlight>
//       )
//     } else {
//       return (
//         <TouchableHighlight
//             style={ styles.smallMenuBtn }
//             underlayColor={'rgba(29, 29, 29, 0.1)'}
//             onPress={() => this.props.navigation.navigate(this.props.route, {update: this._getCount})}>
//             <View>
//                 <Text
//                     style={ styles.folderHeader }>
//                     {this.props.caption} {this.state.count > 0 && <Text style={{color: '#888', fontSize: 16, fontWeight: 'normal', paddingBottom: 2}}>({this.state.count})</Text>}
//                 </Text>
//                 <Text
//                     style={ styles.lastModif }>
//                     {this._getSetDate()}
//                 </Text>
//                 {!this.props.size && <Icon.SimpleLineIcons
//                     style={ styles.enterIcon }
//                   name="arrow-right" /> }
//             </View>
//         </TouchableHighlight>
//       );
//     }
//   }
// }

// class Popup extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       text: '',
//       dueDate: '',
//     }
//   }

//   _addDueDate(d) {
//     if (d === this.state.dueDate) {
//       this.setState({dueDate: ''})
//     } else if (d === 'today') {
//       this.setState({dueDate: 'today'});
//     } else if (d === 'tomorrow') {
//       this.setState({dueDate: 'tomorrow'});
//     } else if (d === 'week') {
//       this.setState({dueDate: 'week'});
//     }
//   }

//   render() {
//     return (
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={this.props.visible}
//         onRequestClose={this.props.close}>
//         <TouchableOpacity style={{flex: 1}} onPress={this.props.close} activeOpacity={1}>
//           <View style={{
//             position: 'absolute',
//             bottom: 0,
//             height: screenHeight > 800 ? 365 : 292,
//             width: screenWidth,
//             borderColor: '#ccc',
//             borderRadius: 11,
//             shadowColor: '#999',
//             padding: 5,
//             shadowOpacity: 0.2,
//             shadowRadius: 5,
//             borderWidth: 1,
//             backgroundColor: '#fff'
//           }}>
//             <TextInput
//               placeholder="New folder's name"
//               maxLength={30}
//               autoCorrect={false}
//               name="text"
//               underlineColorAndroid="#fff"
//               onChangeText={(text) => {LayoutAnimation.configureNext( SwipeItemAnimation ); this.setState({text})}}
//               blurOnSubmit={false}
//               style={{fontSize: 16, padding: 11, paddingRight: 40}}
//               autoFocus={true} />
//               <RkButton
//                 style={styles.submitBtn}
//                 onPress={async () => {
//                   await this.state.text ? this.props.add(this.state.text, this.state.dueDate) : null;
//                   this.setState({text: ''});
//                 }}
//                 rkType='rounded'>
//                 <Icon.MaterialIcons
//                   name='add'
//                   style={{
//                     position: 'absolute',
//                     color: '#fff',
//                     top:5,
//                     fontSize: 20,
//                   }} />
//               </RkButton>
//               <View
//                 style={{flexDirection: 'row'}}>
//                 <RkButton
//                   style={ styles.dueDate }
//                   onPress={() => this._addDueDate('today')} >
//                 <Text
//                   style={{
//                     top: -8,
//                     color: this.state.dueDate === 'today' ? '#c43131' : '#555',
//                     fontSize: 16,
//                     }}>
//                     Tasks
//                   </Text>
//                 </RkButton>
//                 <RkButton
//                   style={ styles.dueDate }
//                   onPress={() => this._addDueDate('tomorrow')} >
//                 <Text
//                   style={{
//                     top: -8,
//                     color: this.state.dueDate === 'tomorrow' ? '#c43131' : '#555',
//                     fontSize: 16,
//                     }}>
//                     Notes
//                   </Text>
//                 </RkButton>
//                 <RkButton
//                   style={{top: -5,
//                     width: 110,
//                     flexDirection: 'column',
//                     backgroundColor: '#fff',
//                     left: this.state.text.length > 0 ? -20 : 50
//                     }}>
//                   <Text
//                     style={{
//                       top: -8,
//                       left: -22,
//                       color: this.state.text.length >= 30 ? '#c43131' : '#555',
//                       fontSize: 13,
//                     }}>{this.state.text.length}/30</Text>
//                 </RkButton>
//               </View>
//           </View>
//         </TouchableOpacity>
//       </Modal>
//     );
//   }
// }

class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      removed: false,
      edit: false,
      removed: false,
      view: false,
      done: false,
    }
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
    ];
  }

  _getSetDate = () => {
    if (this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
      if (this.props.hours >= 0 && this.props.minutes >= 0) {
        let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
        let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
        return hr + ':' + min;
      } else {
        return '';
      }
    } else if (this.props.today.getDay() + 1 == this.props.day && this.props.today.getMonth() == this.props.month) {
      return 'Tomorrow';
    } else {
      return '';
    }
  }

  _hideNote = () => {
    this.setState({view: false});
    this.props.update()
  }

  _swipeActivation = async (i) => {
    await LayoutAnimation.configureNext( SwipeItemAnimation );
    if (i === 1) {
      this.setState({swipeOpen: true});
    } else if (i === 0) {
      this.setState({swipeOpen: false});
    }
  }

  render() {
    let creationDate = this._getSetDate();

    return (
      <TouchableWithoutFeedback
        underlayColor={'rgba(29, 29, 29, 0.3)'}
        onPress={() => this.props.done(this.props.id)}
        
        // onPress={() => this.props.viewNote(options)}

        // onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
        >
          <View style={[ styles.noteItem, {opacity: this.props.due === this.props.today.getDay() + 1 ? 0.5 : 1} ]}>
            <Icon.Ionicons
              onPress={() => {
                this.props.done(this.state.done ? 0 : 1, this.props.id)
                  .then(this.setState({done: !this.state.done}));
              }}
              style={styles.checkmark}
              name={this.state.done ? "ios-checkmark-circle-outline" : "ios-radio-button-off"} />
            <Text
              numberOfLines={1}
              style={ this.state.done ? styles.headerDone : styles.header }>
              { this.props.header ? this.props.header : this.props.text }
            </Text>
            {/* <Text
              numberOfLines={1}
              style={ this.props.text ? styles.text : styles.textDone }>
              { this.props.text ? this.props.text : 'No additional data' }
            </Text> */}
            <Text style={[styles.time]}>
              { creationDate }
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

class Today extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      today: false,
      location: false,
      weather: false,
      weatherLoad: 0,
      weatherIcon: false,
      expanded: true,
      propOpen: this.props.open,
      dataSource: false,
      spin: new Animated.Value(0),
      open: new Animated.Value(1),
    };
    this._getTasks();
  }

  componentWillMount() {
    this._getLocationAsync();
    this._todayInit();
    LayoutAnimation.configureNext(IntroAnimation);
  }

  componentDidMount() {
    // this._animationLoop();
  }

  componentWillReceiveProps() {
    this._getTasks();
  }

  _todayInit = () => {
    let today = new Date();

    this.setState({today: {
      'Day': WeekDay[today.getDay()],
      'Date': Month[today.getMonth()].name + ' ' + today.getDate()
    }});
  }

  _animationLoop = () => {
    this.state.spin.setValue(0);
    Animated.timing(this.state.spin, {
      toValue: 1,
      duration: 1500,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      this.setState({weatherLoad: this.state.weatherLoad + 1});
      if (this.state.weatherLoad < 5) {
        this._animationLoop()
      }
    });
  }

  _expandAnimation = (i) => {
    Animated.timing(this.state.open, {
      toValue: 10,
      duration: 240,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => {
      Animated.timing(this.state.open, {
        toValue: 1,
        duration: 100,
        easing: Easing.linear,
        useNativeDriver: true
      }).start();
    });
  }

  _viewNote = (options) => {
    this.props.navigation.navigate('Note', options);
  }

  _todayIDone = async (i, id) => {
    return new Promise(
      resolve => {
        db.transaction(tx => {
          tx.executeSql(`update tasks set completed = ? where id = ?`,[i, id]
        );
      });
      resolve('yes');
    });
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    await Location.getCurrentPositionAsync({})
    .then((location) => {
      this.setState({ location });
      this._getWeather();
    })
  };

  _getWeather = async () => {
    this.setState({weatherLoad: 0});
    await fetch('https://api.darksky.net/forecast/9356b07d5c4d535014e4593c241c3431/' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '?units=auto&exclude=minutely,hourly,alerts,flags', {
      method: 'GET',
    })
    .then((response) => response.json())
    .then((res) =>
    {
      if (res) {
        // console.log(new Date(res.daily.data[0].sunsetTime).getUTCHours());
        this.setState({weather: res});
        this._animationLoop();
        setTimeout(() => {LayoutAnimation.configureNext(WeatherAnimation); this.setState({weatherIcon: weatherIcons[res.currently.icon]})}, 500);
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  _sortTasks(stash, today) {
    let arr = [];

    stash.map(e => {
      if (e.due === today) {
        arr.push(e);
      }
    })
    stash.map(e => {
      if (e.due === today + 1) {
        arr.push(e);
      }
    })
    return(arr);
  }

  _getTasks = () => {
    let today = new Date().getDate();
    db.transaction(tx => {
        tx.executeSql(`select * from tasks where completed = 0 and due between ? and ? order by id desc;`, [today, today + 1],
        (_, { rows: { _array } }) => {
          // Expo.Notifications.setBadgeNumberAsync(_array.length);
          this.setState({ dataSource: this._sortTasks(_array, today) });
        }
      );
    });
  }

  _expand = () => {
    this._getTasks();
    // this.props.updateCounter._getCount();
    LayoutAnimation.configureNext( ExpandAnimation );
    this.setState({expanded: !this.state.expanded});
    // this._expandAnimation(1);
  }

  render() {
    let today = new Date();
    const spin = this.state.spin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });

    // const open = this.state.open.interpolate({
    //   inputRange: [1, 1.1, 1],
    //   outputRange: [1, 1.1, 1],
    //   extrapolate: 'clamp',
    //   useNativeDriver: true,
    // })

    return (
      <View style={{top: 5, height: this.state.expanded ? 'auto' : 94, overflow: 'hidden', paddingBottom: 10, backgroundColor: 'rgba(255,255,255,0)'}}>
        <TouchableHighlight
          style={[ styles.todayView, {height: 75, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0)'} ]}
          underlayColor={'rgba(255,255,255,0.2)'}
          // onPress={this.state.dataSource[0] ? this._expand : null}
          >
          <View style={{backgroundColor: 'rgba(255,255,255,0)',
            // opacity: this.state.expanded ? 0.5 : 1
            }}>
            <Text
                style={[ styles.folderHeader, {fontSize: 35} ]}>
                {this.state.today ? this.state.today['Day'] : 'Today'}
            </Text>
            {this.state.today &&
              <Text style={styles.monthNdate}>
                {this.state.today['Date']}
              </Text>
            }
            <Text
              style={[ styles.lastModif, {position: 'absolute', right: 35, top: -5, textAlign: 'right', lineHeight: 15, fontSize: 12} ] }>
              {this.state.weather ? this.state.weather.currently.summary + ' ' + Math.round(this.state.weather.currently.apparentTemperature) + '\u2103' + '\n' : null}
              {this.state.weather ? Math.round(this.state.weather.daily.data[0].temperatureMax) + '\u00b0' + ' / ' + Math.round(this.state.weather.daily.data[0].temperatureMin) + '\u00b0' : null}
            </Text>
            {/* {this.state.dataSource[0] && <Icon.SimpleLineIcons
              style={[ styles.enterIcon, { color: '#aaa', top: 75 } ]}
              name={this.state.expanded ? 'arrow-up' : "arrow-down"} />} */}

            {/* <Text
                style={[ styles.lastModif, {position: 'absolute', left: 0, top: 67, opacity: this.state.expanded ? 0.5 : 1} ]}>
                {!this.state.dataSource[0] ? 'No tasks for today' :
                  'Next: ' + this.state.dataSource[0].text}
            </Text> */}
            {this.state.weatherIcon
              ? <Image style={{position: 'absolute', top: 9, right: 0, height: 25, width: 25}} source={ this.state.weatherIcon } />
              : <TouchableOpacity onPress={() => {this._getWeather()}} style={{position: 'absolute', top: 9, right: 0, height: 22, width: 22}}>
                  <Animated.View style={{transform: [{rotate: spin}], position: 'absolute', top: 0, right: 0, height: 22, width: 22}}>
                    <Icon.Ionicons style={{position: 'absolute', top: 0, right: 0, fontSize: 22}} name="ios-sync" />
                  </Animated.View>
                </TouchableOpacity>
            }
          </View>
      </TouchableHighlight>
      {this.state.dataSource[0] ?
      <FlatList
        scrollEnabled={!this.state.isSwiping}
        // onRefresh={() => null}
        // refreshing={false}
        data={this.state.dataSource}
        style={[ styles.listContainer, { height: screenHeight - 263, overflow: 'hidden', backgroundColor:'#fff'} ]}
        keyExtractor={item => item.id.toString()}
        extraData={this._getUpdate}
        onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
        renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._todayIDone} swiping={this._swipeHandler} />}
      />
      :
      <View style={[ styles.listContainer, { height: screenHeight - 263, overflow: 'hidden', backgroundColor:'#fff'} ]}>
        <Text style={{textAlign: 'center', color: '#999', fontSize: 25, fontWeight: '200', paddingTop: 10}}>No tasks for Today</Text>
      </View>
      }
    </View>
    )
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: '',
      lastItem: '',
      edit: false,
    };
    this._getCount();
  }

  _getCount = () => {
    let selection = this.props.route === 'tasks' ? ' where completed = 0;' : ' where deleted = 0;';
    let route = this.props.route === 'tasks' ? 'tasks' : 'notes';
    route = this.props.id ? "notes where folder = ?" : route;
    selection = this.props.id ? " and deleted = 0" : selection;
    db.transaction(async tx => {
        tx.executeSql(`select count(*) from ` + route + selection, [this.props.id],
            (_, { rows: { _array } }) => {
                this.setState({count: _array[0]['count(*)']})
            }
        );
    });
    db.transaction(async tx => {
        tx.executeSql(`select * from ` + route + ` order by id desc limit 1;`, [this.props.id],
            (_, { rows: { _array } }) => {
                this.setState({lastItem: _array[0]})
            }
        )
    });
  }

  _newFolder = () => {
    AlertIOS.prompt('New Folder', "", [
      {
        text: 'Cancel',
        // onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Add',
        onPress: name => {
          name ? this._addFolder(
          name,
          this.props.small ? 1 : 0
        ) : null},
      },
    ]);
  }

  _addFolder = async (name, size) => {
    LayoutAnimation.configureNext( FadeItemAnimation );
    await db.transaction(tx => {
      tx.executeSql(`insert into folders (name, type, route, size) values (?, ?, ?, ?);`,[
          name,
          0,
          name,
          size
        ], () => this.props.update()
      );
    });
  }

  _deleteFolder = () => {
    LayoutAnimation.configureNext( FadeItemAnimation );
    AlertIOS.alert(
      'Delete the folder',
      'Including the notes inside',
      [
        {
          text: 'Cancel',
          onPress: () => this.setState({edit: false}),
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await db.transaction(tx => {
              tx.executeSql(`delete from folders where id = ?`,[
                  this.props.id
                ], () => this.props.update()
              );
            });
          }
        },
      ]
    );
  }

  _getSetDate = () => {
    let today = new Date();

    if (!this.state.lastItem) {return 'New'}
    if (today.getDay() == this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      return 'Last added Today';
    } else if (this.state.lastItem.day === 6 ? today.getDay() === 0 : today.getDay() - 1 === this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      return 'Last added Yesterday';
    } else {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      let day = this.state.lastItem.date < 10 ? '0' + this.state.lastItem.date : this.state.lastItem.date;
      let month = this.state.lastItem.month < 10 ? '0' + this.state.lastItem.month : this.state.lastItem.month;
      return 'Last added ' + day + '/' + month;
    }
  }

  render() {

    if (this.props.caption === 'Add') {
      return (
        <View style={{height: 99}}>
          <TouchableHighlight
              style={[ this.props.small ? styles.smallMenuBtn : styles.menuBtn , {backgroundColor: '#efefef'} ]}
              underlayColor={'rgba(29, 29, 29, 0.11)'}
              onLongPress={() => this.props.navigation.navigate('NewNoteM', {update: this.props.notes, folder: 0, caption: "Notes", updateToday: this.props.updateToday})}
              onPress={this.props._toogleModal}>
              <Icon.Ionicons
                  style={ styles.addIcon }
                  name="ios-add" />
          </TouchableHighlight>
          {/* <RkButton
            style={{ zIndex: 101, backgroundColor: 'transparent', position: 'absolute', width: 26, height: 26, bottom: -5, right: 14 }}
            onPress={() => this.props.navigation.navigate('Settings')}>
            <Icon.Ionicons
              style={ styles.settings }
              name='ios-settings' />
          </RkButton> */}
        </View>
      )
    } else {
      return (
        <View>
          {this.state.edit && <View style={{position: 'absolute', right: 0, top:40, flexDirection: 'row'}}>
            {/* <RkButton style={ styles.edit }
              onPress={() => {LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: false})}}>
              <Icon.Ionicons
                style={ styles.editBtn }
                name="ios-arrow-dropleft-outline" />
            </RkButton>
            <RkButton style={ styles.edit }
              onPress={() => {LayoutAnimation.configureNext(FadeItemAnimation); this.setState({editText: true}); this.setState({edit: false})}}>
              <Icon.Ionicons
                style={[ styles.editBtn, {color: '#4286f4'} ]}
                name="ios-create-outline" />
            </RkButton> */}
            <RkButton style={ styles.edit }
              onPress={() => this._deleteFolder()}>
              <Icon.Ionicons
                style={[ styles.editBtn, {color: '#c43131'} ]}
                name="ios-trash-outline" />
            </RkButton>
          </View> }
          <TouchableHighlight
            onLongPress={this.props.custom ? () => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})} : () => null}
            style={[ this.props.small ? styles.smallMenuBtn : styles.menuBtn, this.state.edit && { width: screenWidth / 1.5 } ]}
            underlayColor={this.state.edit ? 'transparent' : 'rgba(29, 29, 29, 0.1)'}
            onPress={this.state.edit ? () => {LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: false})} : () => this.props.route === 'tasks' ? this.props.navigation.navigate('tasks', {update: this._getCount, updateToday: this.props.updateToday}) : this.props.navigation.navigate('notes', {update: this._getCount, folder: this.props.id, caption: this.props.caption, updateToday: this.props.updateToday})}>
            { this.props.small
            ?
              <View>
                <Text
                    style={ styles.folderHeader }>
                    {this.props.caption}
                </Text>
                <Text
                  style={{color: '#888', fontSize: 14, fontWeight: 'normal', paddingBottom: 2, top: 12}}>
                   { this.state.count > 0 ? this.state.count + this.state.count > 1 ? ' Items' : 'Item' : 'Empty' }
                </Text>
              </View>
            :
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
            }
          </TouchableHighlight>
        </View>
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

const addedItemStyle = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 340,
    left: screenWidth/2 - 60,
    right: screenWidth/2 - 60,
    width: 120,
    height: 25,
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#ccc',
    shadowColor: '#888',
    shadowOffset: {bottom: 5},
    shadowOpacity: 0.2,
    shadowRadius: 33,
    borderRadius: 12,
    zIndex: 101,
  },
  text: {
    fontWeight: '200',
    color: '#c41313',
    paddingHorizontal: 11,
    paddingTop: 3
  }
});

const AddedItem = (props) => (
  <View style={addedItemStyle.container}>
    <Text style={addedItemStyle.text}>Added to tasks</Text>
  </View>
)

export default class Menu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
      today: false,
      refreshing: false,
      synced: true,
      todayUpd: false,
      todayOpactity: new Animated.Value(0),
      modal: false,
      added: false,
    };
    this._bootstrapAsync();
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
      // headerRight: <SettingsBtn nav={navigation}  />
    }
  };

  _bootstrapAsync = async () => {
    return new Promise(
      resolve => {
          db.transaction(tx => {
            tx.executeSql(`select * from folders;`,[], (_, { rows: { _array } }) => {this.setState({ dataSource: _array })}
        );
      });
      resolve('yes');
    });
  }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
  }

  _scheduleNotification = (day, when, body) => {
    return new Promise(resolve => {
      Permissions.askAsync(Permissions.NOTIFICATIONS);
      let localNoti = {
        title: 'Reminder:',
        body: body,
        ios: {
          sound: true,
        },
      };
      let date = new Date(when);
      date.setSeconds(0);
      // date.setHours(when.hr);
      // date.setMinutes(when.min);
      if (day) {
        date.setDate(day);    
      }
      
      let schedulingOptions = {
        time: date,
      };
    
      Expo.Notifications.scheduleLocalNotificationAsync(localNoti, schedulingOptions)
        .then((res) => resolve(res));
    });
  }

  _addItem = async (text, due, tags, time) => {
    console.log(due);
    await this._toogleModal();
    let date = await new Date();
    let dueDate = due === '' ? null :
    due === 'Tomorrow' ? date.getDate() + 1 :
      due === 'Today' ? date.getDate() : null;
    let thisID = 0;
    console.log(dueDate);
    await db.transaction(async tx => {
        await tx.executeSql(`insert into tasks (text, hours, minutes, day, date, month, due, tag) values
          (?, ?, ?, ?, ?, ?, ?, ?); select last_insert_rowid();`, [
            text,
            time ? time.getHours() ? time.getHours() : time.getHours() == 0 ? time.getHours() : -1 : -1,
            time ? time.getMinutes() ? time.getMinutes() : time.getMinutes() == 0 ? time.getMinutes() : -1 : -1,
            dueDate ? dueDate : null,
            date.getDate(),
            date.getMonth(),
            dueDate,
            tags,
          ], async (_, res) => {
            thisID = await res['insertId'];
            // console.log(date.getHours(), time.getHours(), date.getMinutes(), time.getMinutes())
            if (time && time.getHours() && (date.getHours() <= time.getHours() &&  date.getMinutes() < time.getMinutes())) {
              this._scheduleNotification(dueDate, time, text);
            }
          }
        );
      }
    );
    this._updateToday();
    this.todosBtn._getCount();
    LayoutAnimation.configureNext( ExpandAnimation );
    await this.setState({updated: true, added: true});
    setTimeout(() => {LayoutAnimation.configureNext( ExpandAnimation );this.setState({added: false})}, 1550);
  }


  _onRefresh = () => {
    LayoutAnimation.configureNext( FadeItemAnimation );
    this.setState({refreshing: true});
    this.setState({synced: false});
    this._bootstrapAsync().then(() => {
      setTimeout(() => this.setState({synced: true}), 2500);
      setTimeout(() => this.setState({refreshing: false}), 4000);
    });
  }

  _refresh = () => {
    this.setState({refreshing: true});
    setTimeout(() => this.setState({refreshing: false}), 1000);
    this._updateToday();
  }

  _updateToday = () => {
    return new Promise(resolve => {
      this.setState({todayUpd: !this.state.todayUpd});
      resolve('done');
    })
  }

  render() {
    let today = new Date();
    const todayOpactity = this.state.todayOpactity.interpolate({
      inputRange: [20, 155],
      outputRange: [1, 0],
      extrapolate: 'clamp',
      // useNativeDriver: true,
    });
    const todayShift = this.state.todayOpactity.interpolate({
      inputRange: [-250, -15, 30, 100],
      outputRange: [15, 0, 0, 20],
      extrapolate: 'clamp',
      // useNativeDriver: true,
    });
    const todayScale = this.state.todayOpactity.interpolate({
      inputRange: [-250, -10, 10, 30],
      outputRange: [0.87, 1, 1, 0.94],
      extrapolate: 'clamp',
      // useNativeDriver: true,
    });


    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <Popup visible={true} visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem} />
        {this.state.added && <AddedItem />}
        <ScrollView
          refreshControl={
            <RefreshControl
                onRefresh={this._refresh}
                refreshing={this.state.refreshing}
                tintColor='#fff'
                title={this.state.refreshing ? 'Up to Date' : 'Pull to Update'}
                titleColor='#c41313'
            />
          }
          // onScrollEndDrag={() => {console.log('qwe')}}
          showsVerticalScrollIndicator={false}
          snapToInterval={300}
          snapToAlignment='start'
          decelerationRate='fast'
          style={{position: 'absolute', top: 0, width: screenWidth, height: screenHeight + 322, zIndex: 99, overflow: 'visible'}}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.state.todayOpactity}}}])}
          scrollEventThrottle={16}
          contentContainerStyle={{justifyContent: 'flex-end', backgroundColor:'transparent'}}>
          <Animated.View style={{
            transform: [{scale: todayScale}],
            opacity: todayOpactity,
            top: todayShift,
            zIndex: 1,
            backgroundColor: '#fff',
            }}>

          <Today
            update={this._updateToday}
            navigation={this.props.navigation}
            clickable={this.state.todayOpactity === 1 ? true : false}
            updateCounter={this.todosBtn}
            />
          </Animated.View>
          <View style={{width: screenWidth, height: screenHeight, paddingTop: 30, zIndex:99, overflow: 'visible'}}>
            <MenuItem
              navigation={this.props.navigation}
              caption={"Add"}
              route={'Add'}
              update={this._bootstrapAsync}
              notes={() => this.notesBtn._getCount()}
              _toogleModal={this._toogleModal} />
            <MenuItem
              ref={(c) => this.todosBtn = c}
              updateToday={this._updateToday}
              navigation={this.props.navigation}
              caption={"To Do's"}
              route={'tasks'} />
            <MenuItem
              ref={(ref) => this.notesBtn = ref}
              navigation={this.props.navigation}
              updateToday={this._updateToday}
              caption={"Notes"}
              route={'notes'} />
          </View>
        </ScrollView>
        {/* <Modal
          transparent={true}
          visible={true}>
            <ScrollView
              scrollEventThrottle={16}
              onScroll={this._modalScroll}
              style={{position: 'absolute', bottom: 0, height: screenHeight - 85, width: screenWidth, backgroundColor: '#fff', borderColor: '#bbb', borderWidth: 0.5, borderTopLeftRadius: 15, borderTopRightRadius: 15}}>
              <View style={{height: screenHeight * 2, width: screenWidth, backgroundColor: '#aaa'}} />
            </ScrollView>
        </Modal> */}
      </View>
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
    shadowColor: '#999',
    shadowOffset: {bottom: 20},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: '#eaeaea',
    borderRadius: 10,
    height: 85,
  },
  smallMenuBtn: {
    width: (screenWidth / 3) - 18,
    padding: 14,
    top: 4,
    left: 8,
    right: 8,
    marginTop: 15,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    height: (screenWidth / 3) - 18,
  },
  folderHeader: {
    color: '#c43131',
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
    marginTop: 'auto',
    marginBottom: 'auto'
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
  edit: {
    backgroundColor: 'transparent',
    left: -20,
    width: screenWidth / 4,
  },
  editBtn: {
    right: 0,
    fontSize: 27,
    color: '#555'
  },
  editTextBtn: {
    top: 0,
    fontSize: 30,
  },
  item: {
    width: screenWidth / 1.5
  },
  listContainer: {
    width: screenWidth - 20,
    padding: 14,
    paddingBottom: 0,
    top: 4,
    marginBottom: 5,
    marginTop: 15,
    marginHorizontal: 10,
    // borderWidth: 1,
    // borderColor: '#eee',
    // borderRadius: 10,
    height: 'auto',
  },
  noteItem: {
    flex: 1,
    padding: 12,
    marginTop: 10,
    top: -10,
    minHeight: 30,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  header: {
    position: 'absolute',
    maxWidth: screenWidth - 170,
    top: 0,
    left: 24,
    fontWeight: "400",
    fontSize: 16,
    color: '#444',
  },
  headerDone: {
    position: 'absolute',
    maxWidth: screenWidth - 170,
    top: 0,
    left: 24,
    fontWeight: "400",
    fontSize: 16,
    // color: '#444',
    color: '#bbb',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  checkmark: {
    position: 'absolute',
    top: -3.9,
    left: -8,
    fontSize: 26,
  },
  // text: {
  //   marginTop: 10,
  //   left: -20,
  //   paddingTop: 5,
  //   paddingBottom: 0,
  //   marginLeft: 0,
  //   fontSize: 16,
  //   color: '#191919',
  // },
  textDone: {
    marginTop: 10,
    left: -12,
    paddingTop: 5,
    paddingBottom: 0,
    marginLeft: 0,
    fontSize: 16,
    color: '#555',
  },
  editNote: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth,
    bottom: 0,
    height: 45,
    backgroundColor: 'rgba(255,255,255,0.85)',
  },
  time: {
    position: 'absolute',
    top: 2,
    right: -5,
    fontSize: 12,
    color: '#c43131',
  },
  emptyToday: {
    color: '#777'
  },
  todayView: {
    width: screenWidth - 10,
    padding: 10,
    top: 10,
    marginTop: 15,
    marginHorizontal: 5,
    // borderWidth: 1,
    // borderColor: '#eee',
    // borderRadius: 10,
    height: 85,
  },
  monthNdate: {
    // position: 'absolute',
    // top: 47,
    fontSize: 16,
    // color: '#c43131',
    fontWeight: '100',
    opacity: 0.8
  },
  settings: {
    position: 'absolute',
    top: 1,
    right: 2,
    color: '#c43131',
    fontSize: 26,
  }
});
