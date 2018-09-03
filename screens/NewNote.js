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

const AttachmentRow = (props) => {
    return (
        <View
            style={ styles.attRow } >
            {/* <RkButton
                style={styles.editBtnRow}
                onPress={async () => props._callCamera()}
                rkType='rounded'>
                <Icon.Ionicons
                    style={ styles.topIcon }
                    name="md-mic" />
            </RkButton> */}
            <RkButton
                style={styles.editBtnRow}
                onPress={async () => props._selectImage()}
                rkType='rounded'>
                <Icon.Ionicons
                    style={ styles.topIcon }
                    name="md-images" />
            </RkButton>
            <RkButton
                style={styles.editBtnRow}
                onPress={async () => props._callCamera()}
                rkType='rounded'>
                <Icon.Ionicons
                    style={ styles.topIcon }
                    name="md-camera" />
            </RkButton>
            
        </View>
    )
}

export default class NewNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      refreshing: false,
      text: '',
      header: '',
      img: [],
      dueDate: '',
      updated: false,
    };
    // this.data = this.props.navigation.state.params;
    this._bootstrapAsync();
  }
  componentWillMount() {
    this.props.navigation.setParams({
        RightRow: <AttachmentRow />
    });
  // this._getPictures();
  }

  static navigationOptions = ({ navigation }) => {
      console.log(navigation)
      return {
        headerRight: navigation.state.params ? navigation.state.params.RightRow : null,
        // headerBackTitleStyle: {
        //     color: '#fff'
        // }
    }
  };

  _bootstrapAsync = async () => {
    this._getUpdate();
  }

  

  componentDidUpdate() {
    this.state.updated ? this.setState({updated: false}) : null;
  }

  async componentWillUnmount() {
      await this._addItem();
      this.props.navigation.state.params.update();
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

//   _toogleModal = async => {
//     this.setState({modal: !this.state.modal});
//     this._getUpdate();
//   }

//   _getPictures = async () => {
//     let id = await this.data.id;
//     if (id) {
//         db.transaction(tx => {
//           tx.executeSql(`select * from img where note = ?`, [id],
//             async (_, { rows: { _array } }) => {
//               if (_array) {
//                 _array.map(async (pic) => {
//                   console.log(JSON.parse(pic.src));
//                   await this.state.img.push(JSON.parse(pic.src));
//                   LayoutAnimation.configureNext( ListItemAnimation );
//                   await this.setState({updated: true});
//                 })
//               }
//             }
//         );
//      });
//     }
//     await this.setState({updated: true});
//   }

  _getSetDate = () => {
      let today = new Date();
      let hour = today.getHours();
      let minutes = today.getMinutes();
      let hr = hour < 10 ? '0' + hour : hour;
      let min = minutes < 10 ? '0' + minutes : minutes;
      return 'Today at ' + hr + ':' + min;
  } 

  _addItem = async () => {
    let date = await new Date();
    let thisID = 0;
    // await this._toogleModal();
    if (this.state.header || this.state.text) {
      await db.transaction(async tx => {
          await tx.executeSql(`insert into notes (header, text, hours, minutes, day, date, month, deleted, archive) values
            (?, ?, ?, ?, ?, ?, ?, 0, 0); select last_insert_rowid();`, [
              this.state.header,
              this.state.text,
              date.getHours(),
              date.getMinutes(),
              date.getDay(),
              date.getDate(),
              date.getMonth(),
            ], async (_, res) => {
              thisID = await res['insertId'];
            }
          );
        }
      );
      await db.transaction(async tx => {
        if (this.state.img) {
          this.state.img.map((pic, i) => {
            tx.executeSql(`insert into img (src, note) values (?, ?);`, [JSON.stringify(pic), thisID],
              async (_, res) => {
                console.log(res);
              }
            );
          });
        }
      });
      // await this._getUpdate();
      LayoutAnimation.configureNext( ListItemAnimation );
    }
    // await this.setState({deleted: false});    
    // await this.setState({updated: true});
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
    // let today = new Date();
    // let creationDate = this._getSetDate();
    // let imageMap = this.state.img ? this.state.img.map((picture, i) => {
    //     console.log('mapped', this.state.img[i]);
    //     return <RkModalImg
    //       // resizeMethod='scale'
    //       style={{flexDirection: 'column', maxWidth: screenWidth / 3.2}}
    //       key={String(i)} source={this.state.img} index={i} />
    //   }) : null;

    return (
        <View style={{
            flex: 1,
            backgroundColor: '#fff'
          }}>
          <KeyboardAvoidingView
          enabled={true}
            behavior='height'
            keyboardVerticalOffset={100}
            style={{
                flex: 1,
                padding: 5,
                backgroundColor: '#fff'
            }}>
            <TextInput
              placeholder='Caption'
              editable={ true }
              multiline={false}
              maxLength={30}
              name="header"
              underlineColorAndroid="#fff"
              onChangeText={(header) => {this.setState({header})}}
              blurOnSubmit={false}
              onSubmitEditing={() => this.noteTextIn.focus()}
              style={{fontSize: 18, fontWeight: '700', padding: 11, paddingRight: 50, paddingBottom: 10}}
              autoFocus={ true } />
            <TextInput
              ref={ref => this.noteTextIn = ref}
              editable={ true }
              placeholder='Additional text'
              multiline={true}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {this.setState({text})}}
              blurOnSubmit={false}
              style={{fontSize: 16, padding: 11, paddingTop: 5, paddingRight: 50, paddingBottom: 20}}/>
              {/* { !this.data.view ?
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
                null
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
        </View> } */}
        </KeyboardAvoidingView>
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
    bottom: 15,
    backgroundColor: 'transparent',
  },
  attRow: {
    top: -5,
    flexDirection: 'row'
  },
  topIcon: {
    position: 'absolute',
    color: '#c43131',
    top: 0,
    fontSize: 25,
  },
  editBtnRow: {
    width: 50,
    marginTop: 15,
    height: 30,
    right: 5,
    backgroundColor: '#fff',
    top: 0,
  },
  noteCreated: {
    fontSize: 12,
    fontWeight: '100',
    color: '#777',
    marginLeft: 'auto',
    marginRight: 'auto',
    bottom: 17,
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
