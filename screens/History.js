import React, { Component } from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton } from 'react-native-ui-kitten';
import { Icon } from 'expo';
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
  Animated,
} from 'react-native';
import HomeScreen from './HomeScreen';

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

class ArchiveItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      swipeOpen: false,
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
    await LayoutAnimation.configureNext( SwipeItemAnimation );
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
      <TouchableHighlight style={{
        flex: 1,
        padding: 15,
        backgroundColor: this.state.swipeOpen ? '#c43131' : '#fff',
        }}
        underlayColor={this.state.swipeOpen ? '#c43131' : '#fff'}
        onPress={() => {this.swipeable.recenter(); this.props.done(this.props.index)}}
        >
        {!this.state.swipeOpen ? <Icon.MaterialIcons
          style={{
            position: 'absolute',
            left: 22,
            top: 15,
            fontSize: 25,
            color: '#222'}}
        name={'undo'} /> : <Icon.MaterialIcons
        style={{
          position: 'absolute',
          left: 22,
          top: 15,
          fontSize: 25,
          color: !this.state.swipeOpen ? '#c43131' : '#fff'}}
      name={'delete'} /> }
      </TouchableHighlight>,
      <TouchableHighlight style={{
        flex: 1,
        padding: 15,
        backgroundColor: this.state.swipeOpen ? '#c43131' : '#fff',
        }}
        underlayColor={this.state.swipeOpen ? '#c43131' : '#fff'}
        onPress={async () => {
          await LayoutAnimation.configureNext(SwipeItemAnimation);
          await setTimeout(() => this.setState({removed: true}), 0);
          await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
          await setTimeout(() => this.props.delete(this.props.index), 0);
          // await setTimeout(() => this.setState({removed: false}), 150);
        }}
        >
      {!this.state.swipeOpen ? <Icon.MaterialIcons
          style={{
            position: 'absolute',
            left: 22,
            top: 15,
            fontSize: 25,
            color: '#c43131'}}
        name={'delete'} /> : <Text></Text> }
      </TouchableHighlight>,   
    ];

    if (this.props.archive) {
      return (
        <Swipeable
          style={{
            right: this.state.swipeOpen ? this.state.removed ? 280 : 80 : this.state.removed ? 400 : 0,
          }}
          onRef={ref => this.swipeable = ref}
          rightButtons={leftContent}
          rightButtonWidth={70}

          rightActionActivationDistance={190}
          onRightActionActivate={ () => this._swipeActivation(1) }
          onRightActionDeactivate={ () => this._swipeActivation(0) }
          onRightActionRelease={async () => {
            await LayoutAnimation.configureNext(SwipeItemAnimation);
            await setTimeout(() => this.setState({removed: true}), 0);
            await setTimeout(() => LayoutAnimation.configureNext(SwipeOutItemAnimation), 500);
            await setTimeout(() => this.props.delete(this.props.index), 0);
            // await setTimeout(() => this.setState({removed: false}), 150);
          }}

          >
          <TouchableWithoutFeedback>
            <View style={ this.props.completed ? styles.itemDone : styles.item }>
              <Text style={ this.props.completed ? styles.textDone : styles.text }>
                { this.props.text }
              </Text>
              <Text style={styles.time}>
                { this._getSetDate() }
              </Text>
              <Text style={styles.due}>
                { this.props.completed ? 'done' : this._getDueDate() }
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </Swipeable>
      );
    } else {
      return null;
    }
  }
}

export default class Archive extends React.Component {
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
    const items = await AsyncStorage.getItem('todos');
    if (items) {
      await this.setState({dataSource: JSON.parse(items)});
    }
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

  _done = async (i) => {
    let date = await new Date();
    let d = await AsyncStorage.getItem('todos');
    let n = await this.state.dataSource.findIndex(x => x.index === i);
    LayoutAnimation.configureNext( ListItemAnimation );        
    this.state.dataSource[n].completed = !this.state.dataSource[n].completed;
    this.state.dataSource[n].archive = !this.state.dataSource[n].archive;
    await AsyncStorage.setItem('todos', JSON.stringify(this.state.dataSource));
    await this.setState({updated: true});
  }

  _recover = async () => {
    let n = await this.state.deleted;
    LayoutAnimation.configureNext( ListItemAnimation );        
    await this.setState({dataSource: n});
    await AsyncStorage.setItem('todos', JSON.stringify(n));
    await this.setState({deleted: false});
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
        <View style={styles.navbar} >
          {/* <Text style={{position: 'absolute', marginLeft: 'auto', marginRight: 'auto'}}>
            History
          </Text> */}
          <RkButton
            onPress={() => this.props.navigation.navigate('Main')}
            style={{backgroundColor: '#fff', }}>
            <Icon.SimpleLineIcons
              style={ styles.backIcon }
              name="arrow-left" /><Text style={{fontSize: 16, color: '#444', lineHeight: 31, left: -10}}>Back</Text>
          </RkButton>
          
        </View>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this._update}
          data={this.state.dataSource}
          style={ styles.container }
          keyExtractor={item => item.index}
          // extraData={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <ArchiveItem {...item} delete={this._delete} today={today} done={this._done} />}
          />
        {this.state.deleted && <RecoverBtn onPress={this._recover} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: 0,
    paddingTop: 35,
    backgroundColor: '#fff',

  },
  navbar: {
    position: 'absolute',
    top: 24,
    width: screenWidth,
    zIndex: 3,
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
  },
  backIcon: {
    position: 'absolute',
    top: 15,
    left: 12,
    color: '#555',
    fontSize: 16,
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
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 8,
    maxWidth: screenWidth - 120,
    fontSize: 16,
    color: '#191919',
  },
  textDone: {
    top: -5,
    lineHeight: 23,
    paddingBottom: 5,
    marginLeft: 8,
    maxWidth: screenWidth - 120,
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
    color: '#555',
  },
  due: {
    position: 'absolute',
    top: 10,
    right: 17,
    fontSize: 14,
    color: '#555',
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
