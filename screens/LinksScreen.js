import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton, RkModalImg } from 'react-native-ui-kitten';
import ImageViewer from 'react-native-image-zoom-viewer';
import Expo, { Icon, SQLite, Notifications, Permissions, Camera } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-swipeable';
// import Modal from 'react-native-modalbox';
import CountdownCircle from 'react-native-countdown-circle'
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

// const localNoti = {
//   title: 'Hello',
//   body: 'World',
//   ios: {
//     sound: true,
//   },
// }

// let t = new Date();
// t.setSeconds(t.getSeconds() + 5);

// const schedulingOptions = {
//   time: t,
// }


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

const RecoverBtn = ({onPress}) => (
  <Fab
      direction="up"
      containerStyle={{ }}
      style={{ backgroundColor: 'rgba(22,22,22,0.53)' }}
      position="bottomRight"
      onPress={onPress}>
      <Icon.MaterialIcons name={'restore'} />
  </Fab>
)

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

const TestBtn = ({onPress}) => (
  <Fab
      direction="up"
      containerStyle={{ }}
      style={{ backgroundColor: '#c43131' }}
      position="bottomLeft"
      onPress={onPress}>
      <Icon.MaterialIcons name={'add'} />
  </Fab>
)

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text ? this.props.text : '',
      header: this.props.caption ? this.props.caption : '',
      img: [],
      dueDate: '',
      updated: false,
    }
  }

  componentDidMount() {
    this._getPictures();
  }

  componentDidUpdate() {
    this.state.updated ? this.setState({updated: false}) : null;
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

  _closePrompt = () => {
    // if (this.state.text || this.state.header) {
    //   if (confirm("Your changes won't be saved. Are you sure you want to continue?")) {
        this.props.close();
    //   }
    // }
  }

  _getPictures = async () => {
    let id = await this.props.id;
    if (id) {
        db.transaction(tx => {
          tx.executeSql(`select * from img where note = ?`, [id],
            async (_, { rows: { _array } }) => {
              if (_array) {
                _array.map(async (pic) => {
                  console.log(JSON.parse(pic.src));
                  await this.state.img.push(JSON.parse(pic.src));
                  LayoutAnimation.configureNext( ListItemAnimation );
                  await this.setState({updated: true});
                })
              }
            }
        );
     });
    }
    await this.setState({updated: true});
  }

  _editNote = () => {
    if (this.state.header != this.props.caption || this.state.text != this.props.text) {
      db.transaction(tx => {
          tx.executeSql(`update notes set header = ?, text = ? where id = ?`,[this.state.header, this.state.text, this.props.id]
        );
      });
    }
    this.setState({editText: false});
  }

  _selectImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let img = await Expo.ImagePicker.launchImageLibraryAsync();
    if (img) {
      await this.state.img.push(img);
    }
    this.setState({updated: true});
  }

  _callCamera = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let img = await Expo.ImagePicker.launchCameraAsync();
    if (img) {
      await this.state.img.push(img);
    }
    this.setState({updated: true});
  }
  
  _upload = async () => {
    if (this.state.text || this.state.header) {
       this.props.add([this.state.header, this.state.text], this.state.dueDate, this.state.img);
       this.setState({text: ''});
       this.setState({img: []});
    }
  }

  render() {
    let imageMap = this.state.img ? this.state.img.map((picture, i) => {
      console.log('mapped', this.state.img[i]);
      return <RkModalImg
        style={{flexDirection: 'column', minWidth: screenWidth / 2.2}}
        key={String(i)} source={this.state.img} index={i} />
    }) : null;

  // let imageMap = (
  //   <Modal visible={true} transparent={true} >
  //     <ImageViewer enableSwipeDown={true} imageUrls={this.state.img} />
  //   </Modal>
  // )    

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <TouchableOpacity style={{position: 'absolute', top: 0, height: 140, width: screenWidth, backgroundColor: 'rgba(255,255,255,0)'}} onPress={this.props.hide ? this.props.hide : this.props.close} activeOpacity={1}></TouchableOpacity>
          <ScrollView style={{
            position: 'absolute', 
            bottom: 0,
            height: this.props.view ? screenHeight - 25 : screenHeight - 140,
            width: screenWidth,
            borderColor: '#ccc',
            borderRadius: 0,
            // borderBottomLeftRadius: 0,
            // borderBottomRightRadius: 0,
            shadowColor: '#999',
            padding: 5,
            // shadowOffset: 2,
            shadowOpacity: 0.2,
            shadowRadius: 5,
            borderWidth: 1,
            backgroundColor: '#fff'
          }}>
            <TextInput
              placeholder='Caption'
              editable={ this.props.view ? 
                this.state.editText ? true : false : true  
              }
              value={ this.props.caption ? this.state.header : null }
              // numberOfLines={1}
              autoCorrect={false}
              multiline={false}
              maxLength={30}
              name="header"
              underlineColorAndroid="#fff"
              onChangeText={(header) => {this.setState({header})}}
              blurOnSubmit={false}
              onSubmitEditing={() => this.noteTextIn.focus()}
              style={{fontSize: 18, fontWeight: '700', padding: 11, paddingRight: 50, paddingBottom: 10}}
              autoFocus={ this.props.view ? false : true } />
            <TextInput
              ref={ref => this.noteTextIn = ref}
              editable={ this.props.view ? 
                this.state.editText ? true : false : true  
              }
              placeholder='Additional text'
              value={ this.props.text ? this.state.text : null }
              numberOfLines={17}
              autoCorrect={false}
              multiline={true}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {this.setState({text})}}
              blurOnSubmit={false}
              style={{fontSize: 16, padding: 11, paddingTop: 5, paddingRight: 50, paddingBottom: 20}}/>
              { !this.props.view ?
              <View style={{ flexDirection: 'column', position: 'absolute', right: 0, top: -3}} >
                <RkButton
                  style={styles.editBtnRow}
                  onPress={this._upload}
                  rkType='rounded'>
                    <Text
                      style={{
                        position: 'absolute',
                        color: '#4286f4',
                        top:5,
                        fontSize: 15,
                        paddingRight: 5,
                        fontWeight: '700'
                      }}> Save </Text>
                </RkButton>
                <RkButton
                  style={styles.editBtnRow}
                  onPress={async () => this._selectImage()}
                  rkType='rounded'>
                  <Icon.Ionicons
                    style={{
                      position: 'absolute',
                      color: '#4286f4',
                      top:5,
                      fontSize: 25,
                    }}
                    name="md-images" />
                </RkButton>
                <RkButton
                  style={styles.editBtnRow}
                  onPress={async () => this._callCamera()}
                  rkType='rounded'>
                  <Icon.Ionicons
                    style={{
                      position: 'absolute',
                      color: '#4286f4',
                      top:5,
                      fontSize: 25,
                    }}
                    name="md-camera" />
                </RkButton>
                <RkButton
                  style={styles.editBtnRow}
                  onPress={async () => this._callCamera()}
                  rkType='rounded'>
                  <Icon.Ionicons
                    style={{
                      position: 'absolute',
                      color: '#4286f4',
                      top:5,
                      fontSize: 25,
                    }}
                    name="md-mic" />
                </RkButton>
                </View> :
              this.state.editText ?
                <RkButton
                style={styles.submitBtn}
                onPress={async () => {
                  this._editNote();
                }}
                rkType='rounded'>
                  <Text
                    style={{
                      position: 'absolute',
                      color: '#c43131',
                      top:5,
                      fontSize: 15,
                    }}> Save </Text>
                </RkButton> :
                <RkButton
                  style={styles.submitBtn}
                  onPress={this.props.hide}
                  rkType='rounded'>
                    <Icon.Ionicons
                      style={{
                        position: 'absolute',
                        color: '#4286f4',
                        top:5,
                        left: 15,
                        fontSize: 25,
                      }}
                      name="ios-close-circle-outline" />
                </RkButton>
              }
              
            { this.state.img && <View style={{ maxWidth: screenWidth, flexDirection: 'row', flexWrap: 'wrap', marginBottom: 65, justifyContent: 'flex-start' }}>
              { imageMap }
            </View> }
          </ScrollView>
          { this.props.view && <View style={{position: 'absolute', bottom: 0, height: 48, backgroundColor: 'rgba(255,255,255,0.9)', width: screenWidth}}>
            <View style={ styles.editNote }>
              <RkButton style={ styles.editL }
                onPress={async () => {await this.setState({editText: true}); this.noteTextIn.focus()}}>
                <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#4286f4'} ]}
                  name="ios-create-outline" />
              </RkButton>
              <Text style={ styles.noteCreated }>
                Created {this.props.created}
              </Text>
              <RkButton style={ styles.editR }
                onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.props.delete(this.props.id)}}>
                <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#c43131'} ]}
                  name="ios-trash-outline" />
              </RkButton>
              </View>
            </View>}
      </Modal>
    );
  }
}

class NoteItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      removed: false,
      edit: false,
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

  

  render() {
    let creationDate = this._getSetDate();
    // let options = {
    //   caption: this.props.header,
    //   text: this.props.text,
    //   view: true,
    //   id: this.props.id,
    //   created: creationDate,
    //   updated: null,
    //   delete: this.props.delete,
    //   hide: this._hideNote,
    //   close: this._toogleModal,
    //   change: this._onChange,
    //   today: this.props.today,
    // }
    return (
      <TouchableWithoutFeedback
        onPress={() => this.setState({view: true})}
        // onPress={() => this.props.viewNote(options)}
        onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
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
      </TouchableWithoutFeedback>
    );
  }
}

export default class Notes extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      newItem: '',
      dataSource: null,
      refreshing: false,
    };
    this._bootstrapAsync();
  }
  static navigationOptions = {
    header: null,
  };

  _bootstrapAsync = async () => {
    // db.transaction(tx => {
    //   tx.executeSql(
    //     // `drop table notes; drop table img;`
    //     // `create table if not exists notes (id integer primary key not null, header text, text text, hours int, minutes int, day int, date int, month int, due int, completed int, archive int);
    //     `create table if not exists img (id integer primary key not null, src text, note int);`
    //   );
    // });
    this._getUpdate();
  }

  // componentDidMount() {
  //   Permissions.askAsync(Permissions.NOTIFICATIONS);
  //   Notifications.scheduleLocalNotificationAsync(localNoti, schedulingOptions);
  // }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
    this._getUpdate();
  }

  _addItem = async (i, due, img) => {
    let date = await new Date();
    let thisID = 0;
  
    await this._toogleModal();
    await db.transaction(async tx => {
        await tx.executeSql(`insert into notes (header, text, hours, minutes, day, date, month, due, completed, archive) values
          (?, ?, ?, ?, ?, ?, ?, ?, 0, 0); select last_insert_rowid();`, [
            i[0],
            i[1],
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
    await db.transaction(async tx => {
      if (img) {
        img.map((pic, i) => {
          tx.executeSql(`insert into img (src, note) values (?, ?);`, [JSON.stringify(pic), thisID],
            async (_, res) => {
              console.log(res);
            }
          );
        });
      }
    });
    await this._getUpdate();
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({deleted: false});    
    await this.setState({updated: true});
  }

  _getUpdate = () => {
    db.transaction(tx => {
        tx.executeSql(`select * from notes;`,[], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
      );
    });
  }

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

  // _done = async (i) => {
  //   let date = await new Date();
  //   let d = await AsyncStorage.getItem('todos');
  //   let n = await this.state.dataSource.findIndex(x => x.index === i);
  //   LayoutAnimation.configureNext( ListItemAnimation );        
  //   this.state.dataSource[n].completed = !this.state.dataSource[n].completed;
  //   this.state.dataSource[n].archive = !this.state.dataSource[n].archive;
  //   await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
  //   await this.setState({updated: true});
  // }

  // _recover = async () => {
  //   let n = await this.state.deleted;
  //   LayoutAnimation.configureNext( ListItemAnimation );        
  //   await this.setState({dataSource: n});
  //   await AsyncStorage.setItem('todos', JSON.stringify(n));
  //   await this.setState({deleted: false});
  //   await this.setState({updated: true});
  // }

  // _update = async () => {
  //   await this.setState({updated: true});
  //   await this._bootstrapAsync();
  //   await this.setState({updated: false});
  // }

  render() {
    let today = new Date();

    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this._update}
          data={this.state.dataSource}
          style={ styles.container }
          keyExtractor={item => item.id.toString()}
          extraData={this._getUpdate}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <NoteItem {...item} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._done} />}
          />
          <Image source={this.state.img} />
        <Popup visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem}
          addImg={this._selectImage}
          change={this._onChange} />
        <AddBtn onPress={this._toogleModal} />
        {/* <TestBtn onPress={this._selectImage} /> */}
        {this.state.deleted && <RecoverBtn onPress={this._recover} />}
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
    bottom: 0,
    right: -35,
  },
  editL: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
    left: -35,
  },
  editNote: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth,
    bottom: 5,
 
    zIndex: 3,
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
  editBtn: {
    right: 0,
    fontSize: 30,
    color: '#555'
  },
  editTextBtn: {
    top: 0,
    fontSize: 30,
  },
});
