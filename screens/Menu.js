import React, { Component } from 'react';
import { RkButton } from 'react-native-ui-kitten';
import { SQLite, Icon } from 'expo';
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
    db.transaction(async tx => {
        tx.executeSql(`select count(*) from ` + this.props.route + `;`, [],
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
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'Add',
        onPress: () => null,
      },
    ]);
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
          {/* {this.state.edit && <View style={{position: 'absolute', right: 20, top:40}}>
            
          </View> } */}
          <TouchableHighlight
            onLongPress={this.props.custom ? () => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})} : () => null}
            style={[ this.props.small ? styles.smallMenuBtn : styles.menuBtn, this.state.edit && { width: screenWidth / 2 } ]}
            underlayColor={'rgba(29, 29, 29, 0.1)'}
            onPress={() => this.props.navigation.navigate(this.props.route, {update: this._getCount})}>
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
      <ScrollView style={styles.container} contentContainerStyle={{justifyContent: 'flex-start', flexDirection:'row', flexWrap: 'wrap', width: screenWidth * 2 }}>
        {/* <Image style={{position: 'absolute', top: 0, height: screenHeight, opacity: 0.2, flex: 1}} source={require('../assets/images/paper.jpg')} /> */}
        {/* {this.state.preferences.today && 
          <MenuItem
              navigation={this.props.navigation}
              caption={"Today"}
              route={'today'} />
        } */}
          <View style={{width: screenWidth}}>
            <MenuItem
              navigation={this.props.navigation}
              caption={"To Do's"}
              route={'todos'} />
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
                custom={ true } />} 
              />
            <MenuItem
              navigation={this.props.navigation}
              caption={"Add"}
              route={'Add'}
              _toogleModal={this._toogleModal} />
          </View>

          <View style={{width: screenWidth, flexDirection: 'row', flexWrap: 'wrap'}}>
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
                small={true} />
            <MenuItem
                navigation={this.props.navigation}
                caption={"Add"}
                route={'Add'}
                small={true} />
          </View>
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
});
