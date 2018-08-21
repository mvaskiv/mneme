import React, { Component } from 'react';
import { Icon } from 'expo';
import { Fab } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
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
import { styles } from '../assets/styles';

export default class ListItem extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        swipeOpen: false,
      }
      // var swipeoutBtns = [
      //   {
      //     text: 'DONE',
      //     backgroundColor: '#c43131',
      //     color: '#fff',
      //     onPress: () => this.props.delete(this.props.index)
      //   },
      // ];
  
      
      
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
          backgroundColor: this.state.swipeOpen ? '#c43131' : '#edbb31',
          }}
          underlayColor={this.state.swipeOpen ? '#c43131' : '#edbb31'}
          onPress={() => this.props.delete(this.props.index)}
          >
          {!this.state.swipeOpen ? <Icon.MaterialIcons
            style={{
              position: 'absolute',
              right: 22,
              top: 15,
              fontSize: 25,
              color: '#fff'}}
            name='archive' /> : <Icon.MaterialIcons
            style={{
              position: 'absolute',
              right: 22,
              top: 15,
              fontSize: 25,
              color: '#fff'}}
            name='delete' /> }
        </TouchableHighlight>,
        <TouchableHighlight style={{
          flex: 1,
          padding: 15,
          backgroundColor: this.props.completed ? '#edbb31' :
                  this.state.swipeOpen ? '#c43131' : '#119b6a',
          }}
          underlayColor={ this.state.swipeOpen ? '#c43131' : '#119b6a'}
          onPress={() => {this.swipeable.recenter(); this.props.done(this.props.index)}}
          >
          {!this.state.swipeOpen ? <Icon.MaterialIcons
            style={{
              position: 'absolute',
              right: 22,
              top: 15,
              fontSize: 25,
              color: '#fff'}}
          name={this.props.completed ? 'undo' : 'done'} /> : <Text></Text> }
        </TouchableHighlight>      
      ];
  
      return (
        <Swipeable
          onRef={ref => this.swipeable = ref}
          leftButtons={leftContent}
          leftButtonWidth={70}
          leftActionActivationDistance={185}
          onLeftActionActivate={ () => this._swipeActivation(1) }
          onLeftActionDeactivate={ () => this._swipeActivation(0) }
          onLeftActionRelease={() => this.props.delete(this.props.index)}
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
    }
  }
