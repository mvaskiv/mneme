import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton, RkModalImg } from 'react-native-ui-kitten';
import ImageViewer from 'react-native-image-zoom-viewer';
import Expo, { Icon, SQLite, Notifications, Permissions, Camera, BlurView } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-swipeable';
// import Modal from 'react-native-modalbox';
import CountdownCircle from 'react-native-countdown-circle';
import SlideDownPanel from "react-native-slide-down-panel";
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
    property: LayoutAnimation.Properties.scaleXY,
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
        right: this.state.swipeOpen ? 120 : 0,
        padding: 15,
        backgroundColor: '#c43131',
        }}
        underlayColor={'#c43131'}
        onPress={async () => {await LayoutAnimation.configureNext(SwipeItemAnimation);
          await setTimeout(() => this.setState({removed: true}), 0);
          await setTimeout(() => this.props.delete(this.props.id), 400)}}
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
      <Swipeable
        onRef={ref => this.swipeable = ref}
        swipeStartMinDistance={40}
        style={{right: this.state.removed ? this.state.swipeOpen ? screenWidth - 120 : screenWidth / 1.3 : 0}}
        onSwipeStart={() => this.props.swiping(1)}
        onSwipeRelease={() => this.props.swiping(0)}
        rightButtons={leftContent}
        rightButtonWidth={80}
        rightActionActivationDistance={230}
        onRightActionActivate={ () => this._swipeActivation(1) }
        onRightActionDeactivate={ () => this._swipeActivation(0) }
        onRightActionRelease={async () => {
          await LayoutAnimation.configureNext(SwipeItemAnimation);
          await setTimeout(() => this.setState({removed: true}), 0);
          // await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
          await setTimeout(() => this.props.delete(this.props.id), 450);
          // await setTimeout(() => this.setState({removed: false}), 150);
          // await setTimeout(() => this.setState({swipeOpen: false}), 400);
        }}
        >
      <TouchableHighlight
        underlayColor={'rgba(29, 29, 29, 0.3)'}
        // onPress={() => this.setState({view: true})}
        onPress={() => this.props.viewNote(options)}
        // onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
        >
        {
          this.state.edit ? 
          <View style={ styles.item }>
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
          <View style={ styles.item }>
            <Text
              numberOfLines={1}
              style={ styles.header }>
              { this.props.header ? this.props.header : this.props.text }
            </Text>
            <Text
              numberOfLines={3}
              style={ this.props.text ? styles.text : styles.textDone }>
              { this.props.text ? this.props.text : 'No additional data' }
            </Text>
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
      </TouchableHighlight>
      </Swipeable>
    );
  }
}

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: '',
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
  }

  render() {
    return (
        <TouchableHighlight
          style={ styles.smallMenuBtn }
          underlayColor={this.state.edit ? 'transparent' : 'rgba(169, 169, 169, 0.1)'}
          // onPress={() => this.props.goto(this.props.route)}>
          onPress={() => this.props.navigation.navigate('Subfolder', {'folder': 0})}>
            <View>
              <Text
                  style={ styles.folderHeader }>
                  {this.props.caption}
              </Text>
              <Text 
                style={{color: '#888', fontSize: 14, fontWeight: 'normal', paddingBottom: 2, top: 12, marginLeft: 'auto', marginRight: 'auto',}}>
                  { this.state.count > 0 ? this.state.count + this.state.count > 1 ? ' Items' : 'Item' : 'Empty' }
              </Text>
            </View>
        </TouchableHighlight>
    
    );
  }
}

export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      newItem: '',
      dataSource: '',
      refreshing: false,
      isSwiping: false,
      folders: false,
      route: false,
      trash: '',
    };
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    await this._getUpdate();
  }

  // componentDidMount() {
  //   Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   Notifications.scheduleLocalNotificationAsync(localNoti, schedulingOptions);
  // }

  componentWillUnmount() {

  }

  _getUpdate = (route) => {
    if (this.props.navigation.state.params.folder) {
      db.transaction(tx => {
          tx.executeSql(`select * from notes where folder = ? and where deleted = 1 order by id desc;`,[this.props.navigation.state.params.folder], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
        );
      });
    } else {
      db.transaction(tx => {
          tx.executeSql(`select * from notes where deleted = 1 order by id desc;`,[], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
        );
      });
    }
  };

  _delete = async (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from notes where id = ?`, [id]);
    });
    LayoutAnimation.configureNext( SwipeItemAnimation );
    this._getUpdate(); 
    await this.setState({updated: true});
  }

  _selectImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let img = await Expo.ImagePicker.launchImageLibraryAsync();
    if (img) {
      this.setState({img: img});
    }
  }

  _viewNote = (options) => {
    this.props.navigation.navigate('Note', options);
  }

  _swipeHandler = (i) => {
    if (i === 1) {
      this.setState({isSwiping: true});
    } else if (i === 0) {
      this.setState({isSwiping: false});
    }
  }

  _goTo = async (route) => {
    LayoutAnimation.configureNext(SwipeItemAnimation);
    await this.setState({route: route});
    // await this._getUpdate(route);
  }

  render() {
    let today = new Date();

    return (
      <View style={{flex: 1}}>
        <View style={{position: 'absolute', width: screenWidth, height: screenHeight - 50, top: this.state.route ? 50 : -30, backgroundColor: '#fff'}}>
        <FlatList
            scrollEnabled={!this.state.isSwiping}
            // onRefresh={() => null}
            // refreshing={false}
            ListFooterComponent={<View style={{height: 55, width: screenWidth}}/>}
            data={this.state.trash}
            style={ styles.listContainer }
            keyExtractor={item => item.id.toString()}
            extraData={this._getUpdate}
            onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
            renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._done} swiping={this._swipeHandler} />}
          />
        </View>
        <View style={{position: 'absolute', bottom: this.state.route ? - 100 : 0, backgroundColor: '#eee', width: screenWidth, height: 90, flexDirection: 'row'}}>
          <MenuItem
              navigation={this.props.navigation}
              caption={"Media"}
              goto={this._goTo}
              route={'media'}/>
          <MenuItem
              navigation={this.props.navigation}
              caption={"Docs"}
              goto={this._goTo}
              route={'docs'}/>
          <MenuItem
              navigation={this.props.navigation}
              caption={"Trash"}
              goto={this._goTo}
              route={'trash'}/>
        </View>
        <View style={[ styles.container, {
          shadowOffset:{  width: 4,  height: 1,  },
          shadowColor: '#494949',
          // shadowRadius: 5,
          shadowOpacity: 1.0,
          bottom: this.state.folders ? this.state.route ? screenHeight - 110 : 90 : 0 } ]}>
            {this.state.folders && <TouchableOpacity style={{position: 'absolute', top: 0, height: screenHeight -60, width: screenWidth, zIndex: 99}} 
            onPress={() => {LayoutAnimation.configureNext(SwipeItemAnimation); this.setState({folders: false}); this.setState({route: false})}} />}
        {/* <SlideDownPanel
        handlerDefaultView={<Handler />}
          >
          <View
              style={ styles.welcomeView }>
              <Text
                style={ styles.welcome }>
                You can add a new note {'\n'} using the {' '}
                <Icon.Ionicons
                  style={ {color: '#999', fontSize: 25 } }
                  name="ios-create-outline" />
                {' '} button
              </Text>
            </View>
          </SlideDownPanel> */}
        <FlatList
            scrollEnabled={!this.state.isSwiping}
            // onRefresh={() => null}
            // refreshing={false}
            ListFooterComponent={<View style={{height: 55, width: screenWidth}}/>}
            data={this.state.dataSource}
            style={ styles.listContainer }
            keyExtractor={item => item.id.toString()}
            extraData={this._getUpdate}
            onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
            renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._done} swiping={this._swipeHandler} />}
          />
          {!this.state.dataSource[0] && 
            <View
              style={ styles.welcomeView }>
              <Text
                style={ styles.welcome }>
                    Notes you delete {'\n'} will appear here
              </Text>
            </View>
          }
            {/* <Image source={this.state.img} /> */}
          {/* <Popup visible={this.state.modal}
            close={this._toogleModal}
            add={this._addItem}
            addImg={this._selectImage}
            change={this._onChange} /> */}

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
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
    width: 40,
    padding: 0,
    height: 30,
    backgroundColor: '#fff',
    position: 'absolute',
    top: 11,
    right: 11,
  },
  item: {
    flex: 1,
    padding: 12,
    minHeight: 55,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  header: {
    position: 'absolute',
    maxWidth: screenWidth - 130,
    top: 10,
    left: 15,
    fontWeight: "700",
    fontSize: 16,
  },
  text: {
    marginTop: 20,
    left: -5,
    paddingTop: 5,
    paddingBottom: 0,
    marginLeft: 8,
    fontSize: 16,
    color: '#191919',
  },
  textDone: {
    marginTop: 20,
    left: -5,
    paddingTop: 5,
    paddingBottom: 0,
    marginLeft: 8,
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
    top: 12,
    right: 10,
    fontSize: 12,
    color: '#555',
  },
  due: {
    position: 'absolute',
    top: 10,
    right: 17,
    fontSize: 14,
    color: '#555',
  },
  edit: {
    backgroundColor: 'transparent',
    left: -20,
  },
  editR: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 5,
    right: -35,
  },
  editL: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 5,
    left: -35,
  },

  editBtnRow: {
    width: 40,
    padding: 0,
    marginTop: 15,
    height: 30,
    backgroundColor: '#fff',
    top: 0,
    right: 11,
  },
  noteCreated: {
    fontSize: 12,
    fontWeight: '100',
    color: '#777',
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: 19,
  },
  subFolder: {
    fontSize: 18,
    fontWeight: '400',
    color: '#c43131',
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: -10
  },
  editBtn: {
    right: 0,
    fontSize: 30,
    color: '#555'
  },
  editTextBtn: {
    top: 0,
    fontSize: 30,
  },
  welcomeView: {
    position: 'absolute',
    width: screenWidth,
    // textAlign: 'center',
    // height: 100,
    top: 15
  },
  welcome: {
    top: 0,
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#ccc'
  },
  smallMenuBtn: {
    width: screenWidth / 3,
    padding: 14,
    top: 0,
    height: 90,
    // shadowOffset:{  width: 1,  height: 1,  },
    // shadowColor: '#ddd',
    // shadowOpacity: 1.0,
  },
  folderHeader: {
      color: '#444',
      fontWeight: 'bold',
      marginLeft: 'auto',
      marginRight: 'auto',
      fontSize: 21,
  },
  lastModif: {
      paddingTop: 12,
      marginLeft: 'auto',
      marginRight: 'auto',
      color: '#777'
  },
});
