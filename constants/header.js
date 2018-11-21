import React from 'react';
import { Text, View } from 'react-native';
import Icon from '@expo/vector-icons';
const Dimensions = require('Dimensions');
const screenWidth = Dimensions.get('window').width;

export const Header = (props) => (
    <View style={{zIndex: 3000, top: 0, height: 64, borderBottomColor: '#eeeeee', borderBottomWidth: props.border ? 1 : 0, overflow: 'hidden', paddingTop: 10, paddingLeft: 12, paddingBottom: 7, backgroundColor: 'rgba(250,250,253,0.95)'}}>
      { props.back && <Icon.SimpleLineIcons name='arrow-left' onPress={props.nav ? () => props.nav.goBack() : null} style={{position: 'absolute', fontSize: 26, top: 23, left: 8}} />}
      <Icon.Feather name='minus' style={{position: 'absolute', width: screenWidth, textAlign: 'center', right: 0, fontSize: 50, fontWeight: 900, top: -15, color: '#99a' }} />
      <Text
          style={{position: 'absolute', top: 15, left: props.back ? 36 : 12, fontSize: 35, fontWeight: '700', color: '#333'} }>
            {
                props.back
                ? 'Back' 
                : props.title
            }
      </Text>
      <View style={{position: 'absolute', right: 2, bottom: 10}}>
        {props.headerRight}
      </View>
  </View>
)

Header.defaultProps = {
    border: true,
    back: false,
    nav: null,
}