import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { Icon } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
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
  Animated,
} from 'react-native';

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
      position="bottomLeft"
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

class Popup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      dueDate: '',
    }
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
  
  render() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <TouchableOpacity style={{flex: 1}} onPress={this.props.close} activeOpacity={1}>
          <View style={{
            position: 'absolute',
            bottom: 0,
            height: screenHeight > 800 ? 365 : 292,
            width: screenWidth,
            borderColor: '#ccc',
            borderRadius: 11,
            shadowColor: '#999',
            padding: 5,
            // shadowOffset: 2,
            shadowOpacity: 0.2,
            shadowRadius: 5,
            borderWidth: 1,
            backgroundColor: '#fff'
          }}>
            <TextInput
              placeholder='Type it in'
              maxLength={30}
              autoCorrect={false}
              name="text"
              underlineColorAndroid="#fff"
              onChangeText={(text) => {LayoutAnimation.configureNext( SwipeItemAnimation ); this.setState({text})}}
              blurOnSubmit={false}
              style={{fontSize: 16, padding: 11, paddingRight: 40}}
              autoFocus={true} />
              <RkButton
                style={styles.submitBtn}
                onPress={async () => {
                  await this.state.text ? this.props.add(this.state.text, this.state.dueDate) : null;
                  this.setState({text: ''});
                }}
                rkType='rounded'>
                <Icon.MaterialIcons
                  name='add'
                  style={{
                    position: 'absolute',
                    color: '#fff',
                    top:5,
                    fontSize: 20,
                  }} />
                  {/* <Text
                    style={{
                      position: 'absolute',
                      color: '#fff',
                      top:5,
                      fontSize: 15,
                    }}> A </Text> */}
              </RkButton>
              <View
                style={{flexDirection: 'row'}}>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('today')} >
                <Text
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'today' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    Today
                  </Text>
                </RkButton>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('tomorrow')} >
                <Text 
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'tomorrow' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    Tomorrow
                  </Text>
                </RkButton>
                <RkButton
                  style={ styles.dueDate }
                  onPress={() => this._addDueDate('week')} >
                <Text
                  style={{ 
                    top: -8,
                    color: this.state.dueDate === 'week' ? '#c43131' : '#555',
                    fontSize: 16,
                    }}>
                    This Week
                  </Text>
                </RkButton>
                <RkButton
                  style={{top: -5,
                    width: 110,
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    left: this.state.text.length > 0 ? -20 : 50
                    }}>
                  <Text
                    style={{ 
                      top: -6,
                      left: -24,
                      color: this.state.text.length >= 30 ? '#c43131' : '#555',
                      fontSize: 13,
                    }}>{this.state.text.length}/30</Text>
                </RkButton>
              </View>
          </View>
        </TouchableOpacity>
      </Modal>
    );
  }
}

class ListItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
      edit: false,
      newText: '',
      editText: false,
      removed: false,
    }    
    
    const rightButtons = [
      <TouchableHighlight><Text>Button 1</Text></TouchableHighlight>,
      <TouchableHighlight><Text>Button 2</Text></TouchableHighlight>
    ];
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
      return 'Some day';
    }
  }

  _getSetDate = () => {
    if (this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
      let hr = this.props.hours < 10 ? '0' + this.props.hours : this.props.hours;
      let min = this.props.minutes < 10 ? '0' + this.props.minutes : this.props.minutes;
      return hr + ':' + min;
    } else if (this.props.day === 6 ? this.props.today.getDay() == 0 : this.props.today.getDay() == this.props.day && this.props.today.getMonth() == this.props.month) {
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

  // handleUserBeganScrollingParentView() {
  //   LayoutAnimation.configureNext(SwipeItemAnimation);
  //   this.swipeable.recenter();
  // }

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
        onPress={() => {this.swipeable.recenter(); this.props.done(this.props.index)}}
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
          </TouchableHighlight>      ,
      // <TouchableHighlight style={{
      //   flex: 1,
      //   padding: 15,
      //   backgroundColor: this.state.swipeOpen ? '#31a2ac' : '#890202',
      //   }}
      //   underlayColor={this.state.swipeOpen ? '#31a2ac' : '#890202'}
      //   onPress={() => this.props.hide(this.props.index)}
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

    if (!this.props.archive) {
      return (
        <Swipeable
          onRef={ref => this.swipeable = ref}
          style={{
            left: this.state.removed ? 400 : 0,
          }}
          leftButtons={leftContent}
          leftButtonWidth={0}
          leftActionActivationDistance={100}
          onLeftActionActivate={ () => this._swipeActivation(1) }
          onLeftActionDeactivate={ () => this._swipeActivation(0) }
          onLeftActionRelease={async () => {
            await LayoutAnimation.configureNext(SwipeItemAnimation);
            await setTimeout(() => this.setState({removed: true}), 0);
            await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
            await setTimeout(() => this.props.done(this.props.index), 0);
            await setTimeout(() => this.setState({removed: false}), 150);
            await setTimeout(() => this.setState({swipeOpen: false}), 400);
          }}
          >
          <TouchableWithoutFeedback
            onLongPress={() => { LayoutAnimation.configureNext( FadeItemAnimation ); this.setState({edit: true})}}>
            { this.state.edit
              ? 
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
                    onPress={() => {LayoutAnimation.configureNext(SwipeOutItemAnimation); this.props.delete(this.props.index)}}>
                    <Icon.Ionicons
                      style={[ styles.editBtn, {color: '#c43131'} ]}
                      name="ios-trash-outline" />
                  </RkButton>
                </View>
              :
              <View style={ this.state.swipeOpen ? styles.itemDone : styles.item }>
                { this.state.editText ?
                  <TextInput
                    defaultValue={this.props.text}
                    maxLength={30}
                    autoCorrect={false}
                    name="newText"
                    underlineColorAndroid="#fff"
                    onChangeText={(newText) => this.setState({newText})}
                    blurOnSubmit={true}
                    style={{
                      top: -5,
                      marginLeft: 8,
                      fontSize: 16,
                      color: '#191919',
                      width: screenWidth - 45,
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
                  <Text style={ this.state.swipeOpen ? styles.textDone : styles.text }>
                    { this.props.text }
                  </Text>
                }
                <Text style={styles.time}>
                  { this._getSetDate() }
                </Text>

                { this.state.editText ?
                  <View style={{flex: 1, flexDirection: 'row', left: -80}}>
                    <RkButton style={{width: 50, backgroundColor: 'transparent'}}
                      onPress={ async () => {await this.props.editItem(this.props.index, this.state.newText); this.setState({editText: false})} }>
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
                : <Text style={styles.due}>
                  { this.props.completed ? 'done' : this._getDueDate() }
                  </Text>
                }
              </View> 
            }
          </TouchableWithoutFeedback>
        </Swipeable>
      );
    } else {
      return null;
    }
  }
}

export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      modal: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
    };
    this._bootstrapAsync();
  }
  static navigationOptions = {
    header: null,
  };

  _bootstrapAsync = async () => {
    // await AsyncStorage.clear();
    const items = await AsyncStorage.getItem('todos');
    if (items) {
      await this.setState({dataSource: JSON.parse(items)});
    }
  }

  ComponentDidUpdate() {
    // if (this.state.updated) {
    //   this.setState({updated: false});
    // }
  }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
    // let newItem = {
    //   id: 3,
    //   text: '1',
    //   completed: false,
    // };
    // await this.state.dataSource.push(newItem);
    
  }

  _addItem = async (i, due) => {
    let date = await new Date();
    await this.setState({newItem: i});
    await this._toogleModal();
    // console.warn(this.state.dataSource[2])
    if (this.state.dataSource[0]) {
      let n = this.state.dataSource.length;
      let newItem = {
        index: this.state.dataSource[n - 1].index + 1,
        text: i,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        day: date.getDay(),
        date: date.getDate(),
        month: date.getMonth(),
        due: due === '' ? null :
          due === 'tomorrow' ? date.getDay() + 1 :
            due === 'today' ? date.getDay() : 7,
        completed: false,
        archive: false,
      }
      await this.state.dataSource.push(newItem);
    } else {
      let newItem = {
        index: '0',
        text: i,
        hours: date.getHours(),
        minutes: date.getMinutes(),
        day: date.getDay(),
        date: date.getDate(),
        month: date.getMonth(),
        due: due === '' ? null :
          due === 'tomorrow' ? date.getDay() + 1 :
            due === 'today' ? date.getDay() : 7,     
        completed: false,
        archive: false,
      }
      this.setState({dataSource: [newItem]});
    }
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    LayoutAnimation.configureNext( ListItemAnimation );
    await this.setState({deleted: false});    
    await this.setState({updated: true});
  }

  _done = async (i) => {
    let d = await AsyncStorage.getItem('todos');   
    let n = await this.state.dataSource.findIndex(x => x.index === i);
    LayoutAnimation.configureNext( ListItemAnimation );        
    this.state.dataSource[n].archive = !this.state.dataSource[n].archive;
    this.state.dataSource[n].completed = !this.state.dataSource[n].completed;
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    await this.setState({dismissed: i});
    await this.setState({updated: true});
  }

  _edit = async (i, text) => {
    let d = await AsyncStorage.getItem('todos');
    let n = await this.state.dataSource.findIndex(x => x.index === i);
    LayoutAnimation.configureNext( ListItemAnimation );        
    this.state.dataSource[n].text = await text;    
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    await this.setState({updated: true});
  }

  _archive = async (i) => {
    let n = await this.state.dataSource.findIndex(x => x.index === i);
    LayoutAnimation.configureNext( ListItemAnimation );        
    this.state.dataSource[n].archive = !this.state.dataSource[n].archive;
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    await this.setState({updated: true});
  }

  _delete = async (i) => {
    let d = await AsyncStorage.getItem('todos');
    let n = await this.state.dataSource.findIndex(x => x.index === i);
    LayoutAnimation.configureNext( ListItemAnimation );        
    await this.state.dataSource.splice(n, 1);
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    await this.setState({deleted: JSON.parse(d)});
    await this.setState({updated: true});
  }

  _recover = async () => {
    await this._done(this.state.dismissed);
    await this.setState({dismissed: false});
    await this.setState({deleted: false});
  }

  _restore = async () => {
    let n = await this.state.deleted;
    await LayoutAnimation.configureNext( ListItemAnimation );        
    await this.setState({dataSource: n});
    await AsyncStorage.setItem('todos', JSON.stringify(n));
    await this.setState({deleted: false});
    await this.setState({dismissed: false});
    await this.setState({updated: true});
  }

  _update = async () => {
    await this.setState({updated: true});
    await this._bootstrapAsync();
    await this.setState({updated: false});
  }

  render() {
    let today = new Date();

    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this._update}
          data={this.state.dataSource}
          style={ styles.container }
          keyExtractor={item => item.index}
          // extraData={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <ListItem {...item} delete={this._delete} editItem={this._edit} today={today} done={this._done} hide={this._archive} />}
          />
        <Popup visible={this.state.modal}
          close={this._toogleModal}
          add={this._addItem}
          change={this._onChange} />
        <AddBtn onPress={this._toogleModal} />
        {this.state.deleted ? <RecoverBtn onPress={this.state.deleted ? this._restore : this.state.dismissed ? this._recover : null} /> :
          this.state.dismissed ? <RecoverBtn onPress={this.state.deleted ? this._restore : this.state.dismissed ? this._recover : null} /> : null}
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
    minHeight: 55,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  itemDone: {
    flex: 1,
    padding: 12,
    minHeight: 55,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    opacity: 0.3,
  },
  text: {
    top: -5,
    marginLeft: 8,
    fontSize: 16,
    color: '#191919',
  },
  textDone: {
    top: -5,
    marginLeft: 8,
    fontSize: 16,
    color: '#191919',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  time: {
    position: 'absolute',
    bottom: 5,
    left: 20,
    fontSize: 12,
    color: '#777',
  },
  due: {
    position: 'absolute',
    top: 10,
    right: 17,
    fontSize: 14,
    color: '#777',
  },
  edit: {
    backgroundColor: 'transparent',
    left: -20,
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
});
