import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon, Permissions, Location } from 'expo';
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
  LayoutAnimation,
  Animated,
  AlertIOS,
} from 'react-native';
import HomeScreen from './HomeScreen';

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

const weatherIcons = {
  "partly-cloudy-night": require("../assets/weather/partly-cloudy-night.png"),
  "clear-night": require("../assets/weather/clear-night.png"),
  "clear-day": require("../assets/weather/clear-day.png"),
  "cloudy": require("../assets/weather/cloudy.png"),
  "default": require("../assets/weather/default.png"),
  "fog": require("../assets/weather/fog.png"),
  "hail": require("../assets/weather/hail.png"),
  "meteor-shower": require("../assets/weather/meteor-shower.png"),
  "partly-cloudy-day": require("../assets/weather/partly-cloudy-day.png"),
  "precip": require("../assets/weather/precip.png"),
  "rain": require("../assets/weather/rain.png"),
  "sleet": require("../assets/weather/sleet.png"),
  "snow": require("../assets/weather/snow.png"),
  "thunderstorm": require("../assets/weather/thunderstorm.png"),
  "tornado": require("../assets/weather/tornado.png"),
  "wind": require("../assets/weather/wind.png"),
}

class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      removed: false,
      edit: false,
      removed: false,
      view: false,
    }
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
    ];
  }

  _getSetDate = () => {
    if (this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      return 'Today at ' + hr + ':' + min;
    } else if (this.props.today.getDay() - 1 == this.props.day && this.props.today.getMonth() == this.props.month) {
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

  // _toogleModal = async => {
  //   this.setState({view: !this.state.view});
    
  // }

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
    let options = {
      caption: this.props.header,
      text: this.props.text,
      view: true,
      id: this.props.id,
      created: creationDate,
      updated: null,
      delete: this.props.delete,
      hide: this._hideNote,
      close: this._toogleModal,
      change: this._onChange,
      today: this.props.today,
      update: this.props.update,
    }

    const leftContent = [
      <TouchableHighlight
        style={{
        flex: 1,
        right: this.state.swipeOpen ? -20 : 0,
        padding: 15,
        backgroundColor: this.state.removed ? '#c43131' : '#edb41a',
        }}
        underlayColor={ '#edb41a' }
        onPress={() => {null}}
        >
      <Icon.Ionicons
          style={{
            position: 'absolute',
            left: 32,
            top: 20,
            color: '#fff',
            fontSize: 25,
          }}
        name='ios-archive' />
      </TouchableHighlight>,
      <TouchableHighlight
        style={{
        flex: 1,
        right: this.state.swipeOpen ? this.state.removed ? 410 : 140 : 0,
        padding: 15,
        backgroundColor: '#c43131',
        }}
        underlayColor={'#c43131'}
        onPress={() => {this.props.delete(this.props.id)}}
        >
       <Icon.Ionicons
          style={{
            position: 'absolute',
            left: 34,
            top: 20,
            color: '#fff',
            fontSize: 25,
           }}
        name='ios-trash' />
      </TouchableHighlight>
    ];

    return (
      // <Swipeable
      //   onRef={ref => this.swipeable = ref}
      //   swipeStartMinDistance={40}
      //   onSwipeStart={() => this.props.swiping(1)}
      //   onSwipeRelease={() => this.props.swiping(0)}
      //   rightButtons={leftContent}
      //   rightButtonWidth={80}
      //   rightActionActivationDistance={230}
      //   onRightActionActivate={ () => this._swipeActivation(1) }
      //   onRightActionDeactivate={ () => this._swipeActivation(0) }
      //   onRightActionRelease={async () => {
      //     // await LayoutAnimation.configureNext(SwipeItemAnimation);
      //     await setTimeout(() => this.setState({removed: true}), 0);
      //     // await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
      //     await setTimeout(() => this.props.delete(this.props.id), 0);
      //     // await setTimeout(() => this.setState({removed: false}), 150);
      //     // await setTimeout(() => this.setState({swipeOpen: false}), 400);
      //   }}
      //   >
      <TouchableWithoutFeedback
        underlayColor={'rgba(29, 29, 29, 0.3)'}
        onPress={() => null}
        // onPress={() => this.props.viewNote(options)}

        // onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
        >
        {
          this.state.edit ? 
          <View style={ styles.noteItem }>
            <RkButton style={ styles.edit }
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
            </RkButton>
            <RkButton style={ styles.edit }
              onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.props.delete(this.props.id)}}>
              <Icon.Ionicons
                style={[ styles.editBtn, {color: '#c43131'} ]}
                name="ios-trash-outline" />
            </RkButton>
          </View>
        :
          <View style={ styles.noteItem }>
            <Text
              numberOfLines={1}
              style={ styles.header }>
              { this.props.header ? this.props.header : this.props.text }
            </Text>
            {/* <Text
              numberOfLines={1}
              style={ this.props.text ? styles.text : styles.textDone }>
              { this.props.text ? this.props.text : 'No additional data' }
            </Text> */}
            <Text style={styles.time}>
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
        }
      </TouchableWithoutFeedback>
      // </Swipeable>
    );
  }
}

class Today extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: false,
      weather: false,
      weatherIcon: false,
      expanded: false,
      dataSource: false,
    };
    this._getTasks();
  }

  componentWillMount() {
    this._getLocationAsync();
  }

  _viewNote = (options) => {
    this.props.navigation.navigate('Note', options);
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
    console.log(this.state.location);
  };

  _getWeather = async () => {
    await fetch('https://api.darksky.net/forecast/9356b07d5c4d535014e4593c241c3431/' + this.state.location.coords.latitude + ',' + this.state.location.coords.longitude + '?units=auto&exclude=minutely,hourly,daily,alerts,flags', {
      method: 'GET',
      // headers: {
      //   Accept: 'application/json',
      //   'Content-Type': 'application/json',
      // }
    })
    .then((response) => response.json())
    .then((res) =>
    {
      if (res) {
        console.log(res);
        this.setState({weather: res});
        this.setState({weatherIcon: weatherIcons[res.currently.icon]});
      }
    })
    .catch((error) => {
      console.error(error);
    });
    console.log(this.state.weatherIcon);
  }

  _getTasks = () => {
    let today = new Date().getDay();
    db.transaction(tx => {
        tx.executeSql(`select * from tasks where completed = 0 and due = ? order by id desc;`,[today], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
      );
    });
  }

  render() {
    let today = new Date();

    return (
      <View style={{height: this.state.expanded ? 'auto' : 140, overflow: 'hidden'}}>
        <TouchableHighlight
          style={[ styles.menuBtn, {height: 120, overflow: 'hidden'} ]}
          underlayColor={'rgba(29, 29, 29, 0.1)'}
          onPress={this.state.dataSource[0] ? () => {LayoutAnimation.configureNext(FadeItemAnimation); this.setState({expanded: !this.state.expanded})} : null}>
          <View>
            <Text
                style={[ styles.folderHeader, {fontSize: 29} ]}>
                Today
            </Text>
            {this.state.dataSource[0] && <Icon.SimpleLineIcons
              style={[ styles.enterIcon, { color: '#aaa', top: 75 } ]}
              name={this.state.expanded ? 'arrow-up' : "arrow-down"} />}
            <Text
                style={[ styles.lastModif, {position: 'absolute', right: 35, top: -5, textAlign: 'right', lineHeight: 15, fontSize: 12} ] }>
                
                {this.state.weather ? this.state.weather.currently.summary + ' ' + Math.round(this.state.weather.currently.apparentTemperature) + '\u2103' : null}
            </Text>
            <Text
                style={[ styles.lastModif, {position: 'absolute', left: 0, top: 67} ]}>
                {!this.state.dataSource[0] ? 'No tasks for today' :
                  'Next: ' + this.state.dataSource[0].text}
            </Text>
            {this.state.weatherIcon && <Image style={{position: 'absolute', top: 0, right: 0, height: 25, width: 25}} source={ this.state.weatherIcon } /> }
          </View>
      </TouchableHighlight>
      <FlatList
        scrollEnabled={!this.state.isSwiping}
        // onRefresh={() => null}
        // refreshing={false}
        data={this.state.dataSource}
        style={ styles.listContainer }
        keyExtractor={item => item.id.toString()}
        extraData={this._getUpdate}
        onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
        renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._done} swiping={this._swipeHandler} />}
      />
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
    let selection = this.props.route === 'tasks' ? ' where completed = 0;' : ';';

    db.transaction(async tx => {
        tx.executeSql(`select count(*) from ` + this.props.route + selection, [],
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
              tx.executeSql(`delete from folders where name = ?`,[
                  this.props.caption
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
      return 'Last added at ' + hr + ':' + min;
    } else if (this.state.lastItem.day === 6 ? today.getDay() === 0 : today.getDay() - 1 === this.state.lastItem.day && today.getMonth() == this.state.lastItem.month) {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      return 'Last added yesterday at ' + hr + ':' + min;
    } else {
      let hr = this.state.lastItem.hours < 10 ? '0' + this.state.lastItem.hours : this.state.lastItem.hours;
      let min = this.state.lastItem.minutes < 10 ? '0' + this.state.lastItem.minutes : this.state.lastItem.minutes;
      let day = this.state.lastItem.date < 10 ? '0' + this.state.lastItem.date : this.state.lastItem.date;
      let month = this.state.lastItem.month < 10 ? '0' + this.state.lastItem.month : this.state.lastItem.month;
      return 'Last added ' + day + '/' + month + ' at ' + hr + ':' + min;
    }
  }

  render() {

    if (this.props.caption === 'Add') {
      return (
        <TouchableHighlight
            style={[ this.props.small ? styles.smallMenuBtn : styles.menuBtn , {backgroundColor: '#efefef'} ]}
            underlayColor={'rgba(29, 29, 29, 0.11)'}
            onPress={this._newFolder}>
            <Icon.Ionicons
                style={ styles.addIcon }
                name="ios-add" />
        </TouchableHighlight>
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
            onPress={this.state.edit ? () => {LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: false})} : () => this.props.navigation.navigate(this.props.route, {update: this._getCount})}>
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
    db.transaction(tx => {
        tx.executeSql(`select * from folders;`,[], (_, { rows: { _array } }) => {this.setState({ dataSource: _array }); console.log(this.state.dataSource)}
      );
    });
  }

  _toogleModal = () => {
    this.setState({modal: !this.state.modal});
  }

  render() {
    let today = new Date();

    return (
      <ScrollView style={styles.container} contentContainerStyle={{justifyContent: 'flex-start', flex: 1 }}>
        {/* <Image style={{position: 'absolute', top: 0, height: screenHeight, opacity: 0.2, flex: 1}} source={require('../assets/images/paper.jpg')} /> */}
        {/* {this.state.preferences.today && 
          <MenuItem
              navigation={this.props.navigation}
              caption={"Today"}
              route={'today'} />
        } */}
          <View style={{width: screenWidth}}>
            <Today 
              navigation={this.props.navigation} />
            <MenuItem
              navigation={this.props.navigation}
              caption={"To Do's"}
              route={'tasks'} />
            <MenuItem
              navigation={this.props.navigation}
              caption={"Notes"}
              route={'notes'} />
            <FlatList
              data={this.state.dataSource}
              contentContainerStyle={{bottom: 5}}
              keyExtractor={item => item.id.toString()}
              extraData={this._getUpdate}
              onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
              renderItem={({ item }) => <MenuItem
                navigation={this.props.navigation}
                caption={item.name}
                route={item.route}
                update={this._bootstrapAsync}
                custom={ true } />} 
              />
            <MenuItem
              navigation={this.props.navigation}
              caption={"Add"}
              route={'Add'}
              update={this._bootstrapAsync}
              _toogleModal={this._toogleModal} />
          </View>

          {/* <View style={{width: screenWidth, flexDirection: 'row', flexWrap: 'wrap'}}>
            <MenuItem
                navigation={this.props.navigation}
                caption={"Media"}
                route={'Add'}
                small={true} />
            <MenuItem
                navigation={this.props.navigation}
                caption={"Docs"}
                route={'Add'}
                small={true} />
            <MenuItem
                navigation={this.props.navigation}
                caption={"Trash"}
                route={'Add'}
                small={true} /> */}
              {/* <FlatList
                data={this.state.dataSource}
                contentContainerStyle={{bottom: 5}}
                keyExtractor={item => item.id.toString()}
                extraData={this._getUpdate}
                onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
                renderItem={({ item }) => <MenuItem
                  navigation={this.props.navigation}
                  caption={item.name}
                  route={item.route}
                  small={true}
                  update={this._bootstrapAsync}
                  custom={ true } />} 
              /> */}
            {/* <MenuItem
                navigation={this.props.navigation}
                caption={"Add"}
                route={'Add'}
                update={this._bootstrapAsync}
                small={true} />
          </View> */}
          {/* <Popup visible={this.state.modal}
                close={this._toogleModal}
                add={this._addItem} /> */}
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
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
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
    maxWidth: screenWidth - 130,
    top: 0,
    left: 0,
    fontWeight: "700",
    fontSize: 16,
    color: '#444',
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
    right: 0,
    fontSize: 12,
    color: '#555',
  },
  emptyToday: {
    color: '#777'
  }
});
