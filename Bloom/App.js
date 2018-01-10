import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import { StackNavigator, TabNavigator} from 'react-navigation';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';
import ProgressScreen from './ProgressScreen';
import TimerScreen from './TimerScreen';
import LoginScreen from './LoginScreen';
import {styles} from './Styles';

//----------------------------------------------------
// HomeScreen
// Contains Timer screen and progress screen split into
// two tabs
//----------------------------------------------------
const HomeScreen = TabNavigator(
  {
  Timer: {screen: TimerScreen},
  History: {screen: ProgressScreen},
  },{
    tabBarOptions : {
      style: {
        // backgroundColor: '#27ae60',
        backgroundColor: 'rgba(155,89,182, 0.7)'
      }
    }
});

//----------------------------------------------------
// Simple App
// Contains Home screena and login screen in a stack
// Allows us to navigate from login to home
//----------------------------------------------------
const SimpleApp = StackNavigator({
  //list of screens in app
  Login: {screen: LoginScreen},
  Home: {screen: HomeScreen},
});

//----------------------------------------------------
// Main App Component
//----------------------------------------------------
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    return (<SimpleApp/>);
  }
}



