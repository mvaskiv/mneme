import React from 'react';
import { Icon, Permissions } from 'expo';
import { WeekDay, Month } from '../constants/Dates-Weather';
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View,
  LayoutAnimation,
  Animated
} from 'react-native';
import { Popup } from './HomeScreen';
import PouchDB from 'pouchdb-react-native'

const dba = new PouchDB('mydb')

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
    return Month[this.props.month].name + ' ' + this.props.date
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
            <Icon.MaterialIcons
              onPress={() => {
                this.props.done(this.state.done ? 0 : 1, this.props._id)
                  .then(this.setState({done: !this.state.done}));
              }}
              style={[styles.checkmark, {color: this.state.done ? '#c41313' : '#f6f5f5'}]}
              name="done" />
            <Text
              style={ this.state.done ? styles.headerDone : styles.header }>
              { this.props.header ? this.props.header : this.props.text }
            </Text>
            <Text style={[styles.time, 
              // {color: this.state.done ? '#bbb' : '#c41313'}
              ]}>
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
    };
  }

  componentWillMount() {
    this._todayInit();
  }

  _todayInit = () => {
    let today = new Date();
    this.setState({today: {
      'Day': WeekDay[today.getDay()],
      'Date': Month[today.getMonth()].name + ' ' + today.getDate()
    }});
  }

  render() {
    return (
      <View style={{zIndex: 3000, top: 0, height: 64, borderBottomColor: '#eeeeee', borderBottomWidth: 1, overflow: 'hidden', paddingTop: 10, paddingLeft: 12, paddingBottom: 7, backgroundColor: 'rgba(250,250,253,1)',
    }}>
        <Text
            style={[ styles.folderHeader, {fontSize: 24, fontWeight: '700'} ]}>
            {this.state.today ? this.state.today['Day'].toUpperCase() : 'Today'}
        </Text>
        {this.state.today &&
          <Text style={styles.monthNdate}>
            {this.state.today['Date'].toUpperCase()}
          </Text>
        }      
    </View>
    )
  }
}

const HomeAddBtn = (props) => (
  <View style={{height: 99}}>
    <Icon.Feather name='minus' style={{position: 'absolute', zIndex: 101, width: 50, textAlign: 'center', left: screenWidth / 2 - 25, fontSize: 50, fontWeight: 900, top: -32, color: '#b9b9cc', height: 30 }} />
    <TouchableHighlight
        style={ styles.menuBtn }
        underlayColor={'#efefef'}
        onLongPress={() => props.navigation.navigate('NewNoteM', {caption: "Notes", updateToday: props.updateToday})}
        onPress={props._toogleModal}>
        <Icon.Ionicons
            style={ styles.addIcon }
            name="ios-add" />
    </TouchableHighlight>
  </View>
)

const HomeMenuBtn = (props) => (
  <View>
    <TouchableHighlight
      style={ styles.smallMenuBtn }
      underlayColor={'rgba(29, 29, 29, 0.1)'}
      onPress={() => props.navigation.navigate(props.route, {updateToday: props.updateToday})}>
        <View>
          <Text style={ styles.folderHeader }>
              {props.caption}
          </Text>
          <Icon.SimpleLineIcons
              style={ styles.enterIcon }
            name="arrow-right" />
        </View>
    </TouchableHighlight>
  </View>
)

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
      added: false,
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      header: null
    }
  };

  async componentWillReceiveProps() {
    let a = await this.props.navigation.state;
    console.log(a)
  }

  _bootstrapAsync = async () => {
  }


  _updateToday = () => {
    return new Promise(resolve => {
      this.setState({todayUpd: !this.state.todayUpd});
      resolve('done');
    })
  }

  _toogleModal = () => {
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
    await this._toogleModal();
    let date = await new Date();
    let dueDate = due === '' ? null :
      due === 'Tomorrow' ? date.getDate() + 1 :
        due === 'Today' ? date.getDate() : null;
    let hr = time ? time.getHours() ? time.getHours() : time.getHours() == 0 ? time.getHours() : -1 : -1;
    let min = time ? time.getMinutes() ? time.getMinutes() : time.getMinutes() == 0 ? time.getMinutes() : -1 : -1;
    dba.put({
      '_id': date.getTime().toString(),
      'type': 'task', 'text': text.trim(),
      'hours': hr, 'minutes': min,
      'day': dueDate ? dueDate : null, 'date': date.getDate(), 'month': date.getMonth(),
      'due': dueDate, 'tag': tags,
      'completed': 0, 'reminder': null, 'origin': 'Mobile' }).catch(err => console.warn(err))
    if (time && time.getHours() && (date.getHours() <= time.getHours() &&  date.getMinutes() < time.getMinutes())) {
      this._scheduleNotification(dueDate, time, text);
    }
    this._updateToday();
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


  render() {
    return (
      <View style={{flex:1, backgroundColor:'#fff'}}>
        <Today />
        <Popup visible={true} visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem} />
        {this.state.added && <AddedItem />}
        <ScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          snapToInterval={screenHeight > 800 ? 550 : 450}
          snapToAlignment='end'
          // bounces={false}
          decelerationRate='fast'
          style={{position: 'absolute', bottom: 0, width: screenWidth, height: screenHeight > 800 ? screenHeight - 83 : screenHeight - 75, zIndex: 399, overflow: 'hidden'}}
          contentContainerStyle={{position: 'absolute', top: screenHeight > 800 ? 49 : 0, backgroundColor:'transparent', height: screenHeight + 45}}>
          <TasksToday ref={r => this.today = r} update={ this.state.todayUpd } navigation={ this.props.navigation } />
          <View style={{position: 'absolute', bottom: 0, width: screenWidth, height: screenHeight > 800 ? 273 : 225, paddingTop: 0, zIndex:99, overflow: 'visible', borderWidth: 0.5,
            backgroundColor: 'rgb(248,248,248)',
            borderColor: '#eaeaeb',
            borderRadius: 25,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,}}>
            <HomeAddBtn
              navigation={this.props.navigation}
              update={this._bootstrapAsync}
              _toogleModal={this._toogleModal} />
            <HomeMenuBtn
              updateToday={this._updateToday}
              navigation={this.props.navigation}
              caption={"Tasks"}
              route={'tasks'} />
            <HomeMenuBtn
              navigation={this.props.navigation}
              updateToday={this._updateToday}
              caption={"Notes"}
              route={'notes'} />
            <View style={{backgroundColor: 'rgb(248,248,248)', height: 500}} />
          </View>
        </ScrollView>
        <Footer navigate={this.props.navigation.navigate} _getTasks={() => this.today._getTasks() } />
      </View>
    );
  }
}

const Footer = (props) => (
  <View style={ styles.footer }>
   <Icon.Ionicons
        onPress={() => props.navigate('SmartTagsS', {updateToday: () => props._getTasks()})}
        style={styles.tagsList}
        name="ios-list" /> 
    <Icon.Ionicons
        onPress={() => props.navigate('SettingsS')}
        style={styles.themeSwitch}
        name="ios-settings" />
  </View>
)


class TasksToday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    }
    this._getTasks();
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
    return(today_t.concat(tomor.concat(rest)));
  }

  componentWillReceiveProps() {
    this._getTasks();
  }

  _getTasks = async () => {
    let today = await new Date().getDate();
    // dba.createIndex({
      // index: {fields: ['type']}
    // })
    dba.find({
      selector: {
        'type': 'task',
        'completed': {$eq: 0}
      },
      sort: ['_id']
    }).then((res) => {
      this.setState({ dataSource: this._sortTasks(res.docs.reverse(), today) })
    }).catch(err => console.warn(err))
  }

  _todayIDone = async (i, id) => {
    dba.get(id).then((res) => {
      res.completed = i;
      dba.put(res)
        // .then(() => this._getUpdate())
        .catch(err => console.warn(err))
    })
  }

  render() {
    let today = new Date();
    if (this.state.dataSource[0]) {
      return (
        <FlatList
          scrollEnabled={!this.state.isSwiping}
          extraData={this.state}
          data={this.state.dataSource}
          style={[ styles.listContainer, { height: screenHeight - 195, overflow: 'hidden', backgroundColor:'#fff'} ]}
          keyExtractor={item => item._id.toString()}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._todayIDone} swiping={this._swipeHandler} />}
        />
      )
    } else {
      return (
        <View style={[ styles.listContainer, { height: screenHeight - 195, overflow: 'hidden', backgroundColor:'#fff'} ]}>
          <Text style={{textAlign: 'center', color: '#999', fontSize: 25, fontWeight: '200', paddingTop: 10}}>No tasks for Today</Text>
        </View>
      )
    }
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
    position: 'relative',
    width: screenWidth,
    left: -0.5,
    padding: 14,
    paddingTop: 4,
    top: -15,
    margin: 0,
    borderWidth: 0.5,
    shadowColor: 'rgba(150,150,153,0.95)',
    shadowRadius: 14,
    shadowOpacity: 0.12,
    backgroundColor: 'rgba(250,250,253,1)',
    borderColor: '#ddd',
    borderRadius: 25,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: screenHeight > 800 ? '#aaa' : '#ddd',
    borderBottomWidth: 0.5,
    height: 75,
  },
  smallMenuBtn: {
    position: 'relative',
    width: screenWidth,
    padding: 14,
    paddingTop: 19,
    top: screenHeight > 800 ? -47 : -39,
    margin: 0,
    marginBottom: 0,
    backgroundColor: 'rgba(245,245,248,0.95)',
    borderColor: '#eaeaea',
    borderBottomColor: '#e7e7e7',
    borderBottomWidth: 0.5,
    height: screenHeight > 800 ? 64 : 60,
  },
  folderHeader: {
    color: '#333',
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
    fontSize: 38,
    top: screenHeight > 800 ? 8 : 12,
    color: '#555',
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
    width: screenWidth,
    left: 0,
    padding: 14,
    paddingBottom: 0,
    top: 0,
    marginBottom: 5,
    marginTop: 8,
    marginHorizontal: 0,
    // borderWidth: 1,
    // borderColor: '#eee',
    // borderRadius: 10,
    height: 'auto',
  },
  noteItemNote: {
    flex: 1,
    padding: 22,
    margin: 0,
    marginTop: 10,
    top: -10,
    minHeight: 66,
    flexDirection: 'row',
    backgroundColor: 'rgba(29, 29, 29, 0.04)',
    borderColor: '#eee',
    shadowColor: '#eee',
    shadowOpacity: 0.5,
    shadowOffset: {top: 2},
    shadowRadius: 4,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  noteItem: {
    // flex: 1,
    padding: 15,
    paddingBottom: 5,
    marginLeft: 0,
    marginTop: 10,
    top: -15,
    // minHeight: 37,
    height: 'auto',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#f5f5f5',
    borderBottomWidth: 1,
  },

  header: {
    position: 'relative',
    width: screenWidth - 60,
    top: -14,
    margin: 0,
    padding: 0,
    paddingBottom: 3,
    left: -15,
    lineHeight: 24,
    fontWeight: "400",
    fontSize: 18,
    color: '#444',
  },
  headerDone: {
    position: 'relative',
    width: screenWidth - 60,
    top: -14,
    margin: 0,
    padding: 0,
    paddingBottom: 3,
    left: -15,
    lineHeight: 24,
    fontWeight: "400",
    fontSize: 18,

    color: '#bbb',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  checkmark: {
    position: 'absolute',
    top: 4,
    right: 0,
    fontSize: 29,
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
    bottom: 3.5,
    left: 0.8,
    fontSize: 13,
    // color: '#c43131',
    color: '#aaa',
    fontWeight: '200'
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
    top: -2,
    fontSize: 16,
    color: '#c43131',
    fontWeight: '700',
    
    // opacity: 0.8
  },
  settings: {
    position: 'absolute',
    top: 1,
    right: 2,
    color: '#c43131',
    fontSize: 26,
  },
  footer: {
    width: screenWidth,
    height: 45,
    position: 'absolute',
    bottom: 0,
    borderTopWidth: 0.5,
    backgroundColor: 'rgba(250,250,253,1)',
    borderTopColor: '#ccc',
    zIndex: 2001,
  },
  themeSwitch: {
    position: 'absolute',
    right: 14,
    top: 10,
    fontSize: 24,
    color: '#667'
  },
  tagsList: {
    position: 'absolute',
    left: 17,
    top: 5,
    fontSize: 32,
    color: '#444'
  },
});
