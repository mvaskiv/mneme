import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton, RkModalImg, RkGalleryImage, RkGallery } from 'react-native-ui-kitten';
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
  StatusBar,
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
                  name="md-attach" />
          </RkButton>
          {/* <RkButton
              style={styles.editBtnRow}
              onPress={async () => props._callCamera()}
              rkType='rounded'>
              <Icon.Ionicons
                  style={ styles.topIcon }
                  name="md-camera" />
          </RkButton> */}
          
      </View>
  )
}

export default class Note extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      refreshing: false,
      text: this.props.navigation.state.params.text ? this.props.navigation.state.params.text : '',
      header: this.props.navigation.state.params.caption ? this.props.navigation.state.params.caption : '',
      img: [],
      imgView: false,
      dueDate: '',
      updated: false,
    };
    this.data = this.props.navigation.state.params;
    this._bootstrapAsync();
  }

  // componentWillMount() {
  //   this.props.navigation.setParams({
  //       RightRow: <AttachmentRow />
  //   });
  // // this._getPictures();
  // }

  // static navigationOptions = ({ navigation }) => {
  //     console.log(navigation)
  //     return {
  //           headerRight: navigation.state.params ? navigation.state.params.RightRow : null
  //       }
  // };

  _bootstrapAsync = async () => {
    this._getUpdate();
    console.log(this.props);
  }

  componentDidMount() {
   setTimeout(() => this._getPictures(), 500);
  }

  componentDidUpdate() {
    this.state.updated ? this.setState({updated: false}) : null;
  }

  async componentWillUnmount() {
    await this._editNote();
    // LayoutAnimation.configureNext(ListItemAnimation);
    // this.data.update();
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
    let array = [];
    let id = await this.data.id;
    if (id) {
        db.transaction(tx => {
          tx.executeSql(`select * from img where note = ?`, [id],
            async (_, { rows: { _array } }) => {
              if (_array) {
                _array.map(async (pic) => {
                  await array.push(JSON.parse(pic.src));
                });
                // LayoutAnimation.configureNext( ListItemAnimation );
                await this.setState({img: array});
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
        await tx.executeSql(`insert into notes (header, text, hours, minutes, day, date, month, due, deleted, archive) values
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
      this.data.update();
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
    // LayoutAnimation.configureNext( SwipeItemAnimation );
    this.data.update();
    this.props.navigation.navigate('Notes');
    // this._getUpdate(); 
    // await this.setState({updated: true});
  }

  render() {
    let today = new Date();
    // let creationDate = this._getSetDate();
    // let imageMap = this.state.img ? this.state.img.map((picture, i) => {
    //     console.log('mapped', this.state.img[i]);
    //     return <RkModalImg
    //       // resizeMethod='scale'
    //       style={{flexDirection: 'column', maxWidth: screenWidth / 3.2}}
    //       key={String(i)} source={picture} index={i} />
    //   }) : null;

    return (
        <View style={{
            flex: 1,
            height: this.data.view ? screenHeight - 55 : screenHeight - 140,
            width: screenWidth,
            // borderBottomLeftRadius: 0,
            // borderBottomRightRadius: 0,
            // shadowColor: '#999',
            padding: 5,
            // shadowOffset: 2,
            // shadowOpacity: 0.2,
            // shadowRadius: 5,
            // borderWidth: 1,
            backgroundColor: '#fff'
          }}>
          
          <KeyboardAvoidingView behavior='height' nes style={ styles.noteBody } keyboardVerticalOffset={70} enabled={true}>
            <TextInput
              placeholder='Caption'
              editable={ this.data.view ? 
                this.state.editText ? true : false : true  
              }
              value={ this.data.caption ? this.state.header : null }
              // numberOfLines={1}
              autoCorrect={false}
              multiline={true}
              scrollEnabled={false}
              name="header"
              underlineColorAndroid="#fff"
              onChangeText={(header) => {this.setState({header})}}
              blurOnSubmit={false}
              // onSubmitEditing={() => this.noteTextIn.focus()}
              style={{fontSize: 18, fontWeight: '500', padding: 11, height: 'auto', paddingRight: 50, paddingBottom: 10}}
              autoFocus={ this.data.view ? false : true } />
            <TextInput
              ref={ref => this.noteTextIn = ref}
              editable={ this.data.view ? 
                this.state.editText ? true : false : true  
              }
              placeholder='Additional text'
              value={ this.data.text ? this.state.text : null }
              // numberOfLines={17}
              autoCorrect={false}
              multiline={true}
              scrollEnabled={false}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {this.setState({text})}}
              blurOnSubmit={false}
              style={{fontSize: 16, padding: 11, paddingTop: 5, height: 'auto', paddingRight: 50, paddingBottom: 80}}/>
            { this.state.img[0] && <View style={{ maxWidth: screenWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                {/* { imageMap } */}
                <RkGallery
                  style={{height: screenHeight}}
                  previewFooter={<View style={{height: 50, width: screenWidth, backgroundColor: 'rgba(0,0,0,0.5)'}} />}
                  // onGridItemClick={() => StatusBar.setHidden(true)}
                  spanCount={3}
                  items={this.state.img}/>
            </View> }
          </KeyboardAvoidingView>
              { this.data.view && <View style={ styles.editNote }>
                <RkButton style={ styles.editL }
                onPress={async () => {await this.setState({editText: true}); this.noteTextIn.focus()}}>
                <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#c43131'} ]}
                  name="ios-create-outline" />
              </RkButton>
              <Text style={ styles.noteCreated }>
              Created {this.data.created}
              </Text>
              <RkButton style={ styles.editR }
              onPress={() => {this._delete(this.data.id); this.props.navigation.navigate('Notes')}}>
              <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#c43131'} ]}
                  name="ios-trash-outline" />
              </RkButton>
          </View>}
          
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
    bottom: 7,
    right: -35,
  },
  editL: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 7,
    left: -35,
  },
  editNote: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth,
    // paddingBottom: 7,
    bottom: 0,
    height: 47,
    backgroundColor: '#fff',
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
    bottom: -8,
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
  noteBody: {
    flex: 1,
    height: 'auto',
    paddingBottom: 80,
  }
});
