import React from 'react';
import { LayoutAnimation } from 'react-native';
import {  RkModalImg } from 'react-native-ui-kitten';
import Expo, { Permissions } from 'expo';
import {
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import PouchDB from 'pouchdb-react-native'
const db = new PouchDB('mydb')

import { Header } from '../constants/header';

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;

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
  }

  componentDidUpdate() {
    this.state.updated ? this.setState({updated: false}) : null;
  }

  async componentWillUnmount() {
      !this.state.cancel && await this._addItem();
      this.props.navigation.state.params.update ?
      this.props.navigation.state.params.update() : null
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

  _getSetDate = () => {
      let today = new Date();
      let hour = today.getHours();
      let minutes = today.getMinutes();
      let hr = hour < 10 ? '0' + hour : hour;
      let min = minutes < 10 ? '0' + minutes : minutes;
      return 'Today at ' + hr + ':' + min;
  } 

  _addItem = async () => {
    if (this.state.header || this.state.text) {
      let date = await new Date();
      db.put({
        '_id': date.getTime().toString(),
        'type': 'note', 'text': this.state.text,
        'header': this.state.header,
        'hours': date.getHours(), 'minutes': date.getMinutes(),
        'day': date.getDay(), 'date': date.getDate(), 'month': date.getMonth(),
        'tag': null, 'archive': 0, 'origin': 'Mobile' })
      LayoutAnimation.configureNext( ListItemAnimation );
    }
  }

  _selectImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let img = await Expo.ImagePicker.launchImageLibraryAsync();
    if (img && !img.cancelled) {
      await this.state.img.push(img);
    }
    this.setState({updated: true});
  }

  _callCamera = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let img = await Expo.ImagePicker.launchCameraAsync();
    if (img && !img.cancelled) {
      await this.state.img.push(img);
    }
    this.setState({updated: true});
  }
  
  render() {
    // let today = new Date();
    // let creationDate = this._getSetDate();
    let imageMap = this.state.img ? this.state.img.map((picture, i) => {
        console.log('mapped', this.state.img[i]);
        return <RkModalImg
          // resizeMethod='scale'
          style={{flexDirection: 'column', maxWidth: screenWidth / 3.2}}
          key={i.toString()} source={this.state.img} index={i} />
      }) : null;

    return (
      <View style={ styles.container }>
        <Header title='New Note' headerRight={
          <View style={ styles.headerNav }>
            <Text onPress={() => {
                this.setState({cancel: true}, () => {
                  this.props.navigation.goBack()
                })}
              } style={[styles.headerText, {color: '#c41313'}]}>CANCEL</Text>
            <Text style={styles.headerText}> | </Text>
            <Text onPress={() => this.props.navigation.goBack()} style={styles.headerText}>SAVE</Text>
          </View>
        }/>
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
            placeholder={'Caption'}
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
          {this.state.img &&
            <View style={{ maxWidth: screenWidth, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
              { imageMap }
            </View>
          }       
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
  headerNav: {
    position: 'relative',
    bottom: 0,
    right: 12,
    height: 20,
    width: 'auto',
    zIndex: 9,
    flexDirection: 'row'
  },
  headerText: {
    color: '#292929',
    fontWeight: 'normal',
    fontSize: 16,
    textAlign: 'center',
  }
});
