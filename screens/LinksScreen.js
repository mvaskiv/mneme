import React from 'react';
import { LayoutAnimation } from 'react-native';
import { RkButton, RkModalImg, RkTextInput } from 'react-native-ui-kitten';
import Expo, { Icon, Permissions } from 'expo';
import { Fab } from 'native-base';
import Swipeable from 'react-native-swipeable';
import {
  ScrollView,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  View,
} from 'react-native';
import { Header } from '../constants/header';
import PouchDB from 'pouchdb-react-native'
const db = new PouchDB('mydb')

const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ListItemAnimation = {
  duration: 125,
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
  duration: 275,
  create: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.linear,
  },
  update: {
    property: LayoutAnimation.Properties.opacity,
    type: LayoutAnimation.Types.linear,
  },
  delete: {
    property: LayoutAnimation.Properties.opacity,
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
    this.props.close();
  }

  _selectImage = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    let img = await Expo.ImagePicker.launchImageLibraryAsync();
    console.log(img);
    if (!img.cancelled) {
      
      await this.state.img.push(img);
    }
    this.setState({updated: true});
  }

  _callCamera = async () => {
    await Permissions.askAsync(Permissions.CAMERA);
    let img = await Expo.ImagePicker.launchCameraAsync();
    if (!img.cancelled) {
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
      // console.log('mapped', this.state.img[i]);
      return <RkModalImg
        style={{flexDirection: 'column', maxWidth: screenWidth / 2.3}}
        key={String(i)} source={this.state.img} index={i} />
    }) : null;
  

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={this.props.visible}
        onRequestClose={this.props.close}>
        <TouchableOpacity style={{position: 'absolute', top: 0, height: 140, width: screenWidth, backgroundColor: 'rgba(29,29,29,0)'}} onPress={this.props.hide ? this.props.hide : this.props.close} activeOpacity={1}></TouchableOpacity>
          <ScrollView style={{
            position: 'absolute', 
            bottom: 0,
            height: this.props.view ? screenHeight - 25 : screenHeight - 60,
            width: screenWidth,
            // borderColor: '#ccc',
            // borderRadius: 0,
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
              <View style={{ flexDirection: 'column', position: 'absolute', right: 0, top: -8}} >
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
                      color: '#444',
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
                  style={[ styles.editBtn, {color: '#444'} ]}
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
      removed: false,
      view: false,
    }
    this.newDate = 0;
    // this._initSeparator();

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
      id: this.props._id,
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
            // position: 'absolute',
            left: 18,
            marginTop: 'auto',
            marginBottom: 'auto',
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
          await setTimeout(() => this.props.delete(this.props.id), 300)}}
        >
       <Icon.Ionicons
          style={{
            left: 18,
            marginTop: 'auto',
            marginBottom: 'auto',
            color: '#fff',
            fontSize: 25,
           }}
        name='ios-trash' />
      </TouchableHighlight>
    ];

    let search = new RegExp(this.props.search, 'i');
    if (!this.props.search || (this.props.search && (this.props.text.match(search) || this.props.header.match(search)))) {
      return (
        <View>
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
              await setTimeout(() => this.props.delete(this.props.id), 450);
            }}
            >
          <TouchableHighlight
            underlayColor={'rgba(29, 29, 29, 0.3)'}
            onPress={() => this.props.viewNote(options)} >
              <View style={ styles.item }>
                <Text
                  numberOfLines={1}
                  style={ styles.header }>
                  { this.props.header ? this.props.header : this.props.text }
                </Text>
                <Text
                  numberOfLines={2}
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
          </TouchableHighlight>
          </Swipeable>
        </View>
      );
    } else {
      return null;
    }
  }
}

const SearchBtn = (props) => (
  <Icon.Ionicons
    onPress={() => props.search()}
    style={{
      color: '#444',
      fontSize: 22,
      paddingHorizontal: 15,
    }}
    name='ios-search' />
)

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: '',
    };
    this._getCount();
  }

  _getCount = () => {

  }

  render() {
    return (
      <TouchableHighlight
        style={ styles.smallMenuBtn }
        underlayColor={this.state.edit ? 'transparent' : 'rgba(169, 169, 169, 0.1)'}
        onPress={() => this.props.navigation.navigate('Subfolder', {mode: 'modal', update: this._getUpdate, folder: this.props.navigation.state.params.folder ? this.props.navigation.state.params.folder : 0})}>
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

const NotesSearch = (props) => {
  return (
    <View style={[ styles.searchCnt, {backgroundColor: 'rgba(247,247,250,0.95)', borderBottomColor: '#eeeeee', borderBottomWidth: 1} ]}>
      <RkTextInput
        rkType='rounded'
        returnKeyType='search'
        autoFocus={true}
        clearButtonMode='always'
        label={<Icon.Ionicons style={{fontSize: 20, marginTop: 3}} name={'ios-search'}/>}
        placeholder='Search'
        onChangeText={(text) => {props.go(text)}}
        multiline={false}
        // caretHidden={true}
        style={{
          margin: 0,
          marginBottom: 4,
          bottom: 3,
          padding: 0,
          height: 40,
          paddingHorizontal: 10,
          
        }}
        />
      {/* <TextInput style={ styles.searchInput } /> */}
    </View>
  )
}

export default class Notes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      newItem: '',
      dataSource: [],
      refreshing: false,
      isSwiping: false,
      folders: false,
      route: false,
      trash: '',
      searchVisible: false,
      updated: false,
      searchCriteria: false,
    };
    this.searchDebounce;
    this._bootstrapAsync();
  }
  
  // static navigationOptions = ({ navigation }) => {
  //   return {
  //     headerRight: <MoreBtn search={() => {navigation.state.params.searchVisible ? navigation.state.params.searchVisible = false : navigation.state.params.searchVisible = true; navigation.state.params.updateNotes() }} />,
  //     headerLeft: <MenuBtn nav={navigation} />,
  //   }
  // };

  _bootstrapAsync = async () => {
    await this._getUpdate();
  }

  async componentWillMount() {
    this.props.navigation.state.params.updateNotes = () => {
      LayoutAnimation.configureNext(ListItemAnimation);
      this.setState({updated: !this.state.updated});
    }
  }

  componentWillUnmount() {
    this.props.navigation.state.params.updateToday();
    this.props.navigation.state.params.update();
  }

  _toogleSearch = () => {
    // console.log('asd');
    this.setState({searchVisible: !this.state.searchVisible});
  }

  _toogleModal = async => {
    this.setState({modal: !this.state.modal});
    this._getUpdate();
  }

  _getUpdate = async () => {
    // db.createIndex({
    //   index: {fields: ['type']}
    // })
    db.find({
      selector: {
        'type': 'note',
      },
      sort: ['_id'],
    }).then((res) => {
      this.setState({ searchData: res.docs.reverse() })
    });
  }

  // _getTrash = () => {
  //   if (this.props.navigation.state.params.folder) {
  //     db.transaction(tx => {
  //         tx.executeSql(`select * from notes where folder = ? and deleted = 1 order by id desc;`,[this.props.navigation.state.params.folder], (_, { rows: { _array } }) => this.setState({ dataSource: _array })
  //       );
  //     });
  //   } else {
  //     db.transaction(tx => {
  //         tx.executeSql(`select * from notes where deleted = 1 order by id desc;`,[], (_, { rows: { _array } }) => this.setState({ trash: _array })
  //       );
  //     });
  //   }
  // }

  // _delete = async (id) => {
  //   db.transaction(tx => {
  //     tx.executeSql(`update notes set deleted = 1 where id = ?`, [id]);
  //   });
  //   LayoutAnimation.configureNext( SwipeOutItemAnimation );
  //   this._getUpdate(); 
  //   await this.setState({updated: true});
  // }

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

  _search = (c) => {
    clearTimeout(this.searchDebounce);
    this.searchDebounce = setTimeout(() => this.setState({searchCriteria: c}), 450);
  }

  render() {
    let today = new Date();

    return (
      <View style={{flex: 1}}>
        <Header title='Notes' border={!this.props.navigation.state.params.searchVisible} headerRight={<SearchBtn search={() => {this.props.navigation.state.params.searchVisible ? this.props.navigation.state.params.searchVisible = false : this.props.navigation.state.params.searchVisible = true; this.props.navigation.state.params.updateNotes() }} />} />
        <View style={{position: 'absolute', bottom: this.state.route ? - 100 : 0, backgroundColor: '#eee', width: screenWidth, height: 90, flexDirection: 'row'}}>
          <MenuItem
              navigation={this.props.navigation}
              caption={"Marked"}
              goto={this._goTo}
              route={'marked'}/>
          <MenuItem
              navigation={this.props.navigation}
              caption={"Archive"}
              goto={this._goTo}
              route={'archive'}/>
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

          {this.props.navigation.state.params.searchVisible && <NotesSearch go={this._search} />}
       
        <FlatList
          scrollEnabled={!this.state.isSwiping}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View style={{height: 55, width: screenWidth}}/>}
          data={this.state.searchData}
          style={ styles.listContainer }
          keyExtractor={item => item._id.toString()}
          extraData={this._getUpdate}
          onContentSizeChange={() => this.state.updated ? this.setState({updated: !this.state.updated}) : null}
          renderItem={({ item }) => <NoteItem {...item} search={this.state.searchCriteria} viewNote={this._viewNote} delete={this._delete} update={this._getUpdate} today={today} done={this._done} swiping={this._swipeHandler} />}
          />
        
          {this.state.dataSource === false && 
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
          }
    
          <View style={ styles.editNote }>
              {!this.state.route && <RkButton style={ styles.editL }
                onPress={() => this.props.navigation.navigate('NewNote', {update: this._getUpdate, folder: this.props.navigation.state.params.folder ? this.props.navigation.state.params.folder : 0})} >
                <Icon.Ionicons
                  style={[ styles.editBtn, {color: '#444'} ]}
                  name="ios-create-outline" />
              </RkButton>}
              <Text style={ styles.subFolder }>
                {this.state.route ? this.state.route : null}
              </Text>
              {!this.state.route && <RkButton style={ styles.editR }
                onPress={() => {LayoutAnimation.configureNext(ListItemAnimation); this.setState({folders: !this.state.folders})}}>
                <Icon.Ionicons
                    style={[ styles.editBtn, {color: '#444'} ]}
                    name="ios-archive-outline" />
              </RkButton>}
          </View>

          {/* <AddBtn onPress={this._toogleModal} /> */}
          {/* <TestBtn onPress={this._selectImage} /> */}
          {this.state.deleted && <RecoverBtn onPress={this._recover} />}
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
    height: 90,
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
    color: '#444',
    fontWeight: "600",
    fontSize: 19,
  },
  text: {
    marginTop: 21,
    left: 0,
    paddingTop: 5,
    paddingBottom: 0,
    marginLeft: 3,
    fontSize: 16,
    color: '#555',
    fontWeight: '200'
  },
  textDone: {
    marginTop: 21,
    left: 0,
    paddingTop: 5,
    paddingBottom: 0,
    marginLeft: 3,
    fontSize: 16,
    color: '#c5c5c5',
    fontWeight: '200'
  },

  editNote: {
    position: 'absolute',
    flexDirection: 'row',
    width: screenWidth,
    bottom: 0,
    height: 45,
    backgroundColor: 'rgba(250,250,253,0.95)',
    borderTopWidth: 0.5,
    borderTopColor: '#ddd'
  },
  time: {
    position: 'absolute',
    bottom: 10,
    left: 15.5,
    fontSize: 12,
    color: '#999',
    fontWeight: '200'
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
    bottom: 4,
    right: -35,
  },
  editL: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 4,
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
    color: '#444',
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
  dsCnt: {
    width: screenWidth,
    height: 32,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    // borderTopColor: '#ddd',
    // borderTopWidth: 0.5,
    paddingTop: 5,
  },
  dsText: {
    fontSize: 18,
    color: '#444',
    textAlign: 'right',
    fontWeight: '100',

  },
  searchCnt: {
    
    paddingHorizontal: 12,
    height: 55,
  },
  searchInput: {

  },
});
