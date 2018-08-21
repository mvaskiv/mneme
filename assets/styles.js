import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
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
      color: '#555',
    },
    due: {
      position: 'absolute',
      top: 10,
      right: 17,
      fontSize: 14,
      color: '#555',
    },
  });