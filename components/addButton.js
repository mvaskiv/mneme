import React, { Component } from 'react';
import Fab from 'native-base';
import { Icon } from 'expo';
import { MaterialIcons } from '@expo/vector-icons';

export default AddBtn = ({onPress}) => (
  <Fab
      direction="up"
      containerStyle={{ }}
      style={{ backgroundColor: '#c43131' }}
      position="bottomRight"
      onPress={onPress}>
      <Icon.MaterialIcons name={'add'} />
  </Fab>
);
