import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton, RkModalImg } from 'react-native-ui-kitten';
import ImageViewer from 'react-native-image-zoom-viewer';
import Expo, { Icon, SQLite, Notifications, Permissions, Camera } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';
import Swipeable from 'react-native-swipeable';
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

// class NoteItem extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       swipeOpen: false,
//       removed: false,
//       edit: false,
//       view: false,
//     }
//     const rightButtons = [
//       <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
//       <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
//     ];
//   }

//   _getSetDate = () => {
//     if (this.data.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
//       let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
//       let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
//       return 'Today at ' + hr + ':' + min;
//     } else if (this.props.today.getDay() - 1 == this.props.day && this.props.today.getMonth() == this.props.month) {
//       let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
//       let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
//       return 'Yesterday at ' + hr + ':' + min;
//     } else {
//       let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
//       let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
//       let day = this.props.date < 10 ? '0' + this.props.date : this.props.date;
//       let month = this.props.month < 10 ? '0' + this.props.month : this.props.month;
//       return day + '/' + month + ' at ' + hr + ':' + min;
//     }
//   } 

//   // _toogleModal = async => {
//   //   this.setState({view: !this.state.view});
    
//   // }

//   _hideNote = () => {
//     this.setState({view: false});
//     this.props.update()
//   }

//   render() {
//     let creationDate = this._getSetDate();
//     return (
//       <TouchableWithoutFeedback
//         onPress={() => this.setState({view: true})}
//         onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
//         {
//           this.state.edit ? 
//           <View style={ styles.item }>
//             <RkButton style={ styles.edit }
//               onPress={() => {LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: false})}}>
//               <Icon.Ionicons
//                 style={ styles.editBtn }
//                 name="ios-arrow-dropleft-outline" />
//             </RkButton>
//             <RkButton style={ styles.edit }
//               onPress={() => {LayoutAnimation.configureNext(FadeItemAnimation); this.setState({editText: true}); this.setState({edit: false})}}>
//               <Icon.Ionicons
//                 style={[ styles.editBtn, {color: '#4286f4'} ]}
//                 name="ios-create-outline" />
//             </RkButton>
//             <RkButton style={ styles.edit }
//               onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.props.delete(this.props.id)}}>
//               <Icon.Ionicons
//                 style={[ styles.editBtn, {color: '#c43131'} ]}
//                 name="ios-trash-outline" />
//             </RkButton>
//           </View>
//         :
//           <View style={ styles.item }>
//             <Text
//               numberOfLines={1}
//               style={ styles.header }>
//               { this.props.header ? this.props.header : this.props.text }
//             </Text>
//             <Text
//               numberOfLines={3}
//               style={ this.props.text ? styles.text : styles.textDone }>
//               { this.props.text ? this.props.text : 'No additional data' }
//             </Text>
//             <Text style={styles.time}>
//               { creationDate }
//             </Text>
//             {this.state.view && <Popup
//               caption={this.props.header}
//               text={this.props.text}  
//               view={true}
//               id={this.props.id}
//               created={creationDate}
//               updated={null}
//               delete={this.props.delete}
//               hide={this._hideNote}
//               close={this._toogleModal}
//               change={this._onChange} />}
//           </View>
//         }
//       </TouchableWithoutFeedback>
//     );
//   }
// }

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      refreshing: false,
      text: this.props.navigation.state.params.text ? this.props.navigation.state.params.text : '',
      header: this.props.navigation.state.params.caption ? this.props.navigation.state.params.caption : '',
      img: [],
      dueDate: '',
      updated: false,
    };
    this.data = this.props.navigation.state.params;
    this._bootstrapAsync();
  }
  static navigationOptions = {
    header: null,
  };

  _bootstrapAsync = async () => {
    this._getUpdate();
    console.log(this.props);
  }

  componentDidMount() {
    this._getPictures();
  }

  componentDidUpdate() {
    this.state.updated ? this.setState({updated: false}) : null;
  }

  _getUpdate = () => {
    db.transaction(tx => {
        tx.executeSql(`select * from notes;`,[], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
      );
    });
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

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
    this._getUpdate();
  }

  _getPictures = async () => {
    let id = await this.data.id;
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

  _getSetDate = () => {
    if (this.data.today.getDay() == this.data.day && this.data.today.getMonth() == this.data.month) {
      let hr = this.data.hours < 10 ? '0' + this.data.hours : this.data.hours;
      let min = this.data.minutes < 10 ? '0' + this.data.minutes : this.data.minutes;
      return 'Today at ' + hr + ':' + min;
    } else if (this.data.today.getDay() - 1 == this.data.day && this.data.today.getMonth() == this.data.month) {
      let hr = this.data.hours < 10 ? '0' + this.data.hours : this.data.hours;
      let min = this.data.minutes < 10 ? '0' + this.data.minutes : this.data.minutes;
      return 'Yesterday at ' + hr + ':' + min;
    } else {
      let hr = this.data.hours < 10 ? '0' + this.data.hours : this.data.hours;
      let min = this.data.minutes < 10 ? '0' + this.data.minutes : this.data.minutes;
      let day = this.data.date < 10 ? '0' + this.data.date : this.data.date;
      let month = this.data.month < 10 ? '0' + this.data.month : this.data.month;
      return day + '/' + month + ' at ' + hr + ':' + min;
    }
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

  _editNote = () => {
    if (this.state.header != this.data.caption || this.state.text != this.data.text) {
      db.transaction(tx => {
          tx.executeSql(`update notes set header = ?, text = ? where id = ?`,[this.state.header, this.state.text, this.data.id]
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
  

  _delete = async (id) => {
    db.transaction(tx => {
      tx.executeSql(`delete from notes where id = ?`, [id]);
    });
    LayoutAnimation.configureNext( SwipeItemAnimation );
    this._getUpdate(); 
    await this.setState({updated: true});
  }

  render() {
    let today = new Date();
    // let creationDate = this._getSetDate();
    let imageMap = this.state.img ? this.state.img.map((picture, i) => {
        console.log('mapped', this.state.img[i]);
        return <RkModalImg
          
          // resizeMethod='scale'
          style={{flexDirection: 'column', maxWidth: screenWidth / 2.4}}
          key={String(i)} source={this.state.img} index={i} />
      }) : null;

    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            height: this.data.view ? screenHeight - 25 : screenHeight - 140,
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
              editable={ this.data.view ? 
                this.state.editText ? true : false : true  
              }
              value={ this.data.caption ? this.state.header : null }
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
              autoFocus={ this.data.view ? false : true } />
            <TextInput
              ref={ref => this.noteTextIn = ref}
              editable={ this.data.view ? 
                this.state.editText ? true : false : true  
              }
              placeholder='Additional text'
              value={ this.data.text ? this.state.text : null }
              numberOfLines={17}
              autoCorrect={false}
              multiline={true}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {this.setState({text})}}
              blurOnSubmit={false}
              style={{fontSize: 16, padding: 11, paddingTop: 5, paddingRight: 50, paddingBottom: 20}}/>
              { !this.data.view ?
              <View style={{ flexDirection: 'column', position: 'absolute', right: 0, top: -3}} >
                <RkButton
                  style={styles.editBtnRow}
                  onPress={async () => {
                    await this.state.text ? this.data.add([this.state.header, this.state.text], this.state.dueDate, this.state.img) :
                      this.state.header ? this.data.add([this.state.header, this.state.text], this.state.dueDate, this.state.img) : null;
                      this.setState({text: ''});
                  }}
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
                  onPress={this.data.hide}
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
              { this.data.view && <View style={ styles.editNote }>
                <RkButton style={ styles.editL }
                onPress={async () => {await this.setState({editText: true}); this.noteTextIn.focus()}}>
                <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#4286f4'} ]}
                  name="ios-create-outline" />
              </RkButton>
            <Text style={ styles.noteCreated }>
            Created {this.data.created}
            </Text>
            <RkButton style={ styles.editR }
            onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.data.delete(this.data.id)}}>
            <Icon.Ionicons
                style={[ styles.editBtn, {color: '#c43131'} ]}
                name="ios-trash-outline" />
            </RkButton>
        </View>}
        { this.state.img && <View style={{ maxWidth: screenWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            { imageMap }
        </View> }
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
    bottom: 5,
    right: -30,
  },
  editL: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 5,
    left: -30,
  },
  editNote: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth,
    bottom: 5,
    backgroundColor: 'transparent',
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
    bottom: 23,
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
