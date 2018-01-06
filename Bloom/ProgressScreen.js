//----------------------------------------------------
// ProgressScreen.js
// Code for ProgressScreen which displays user 
// history
//----------------------------------------------------
import React, { Component } from 'react';
import {Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
import {List, ListItem} from 'react-native-elements';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';
import {styles} from './Styles';
//----------------------------------------------------
// Progress Screen Component
// shows user history and total stats
// Uses react-native-elements List and ListItem, 
// See docs for styling and implementation tips
//----------------------------------------------------
export default class ProgressScreen extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        flowers: [],
      };
    }
  
    //when component has mounted, get the flowers
    componentDidMount(){
      var that = this;
      //get all flowers from database
      //shefali: http://10.8.68.109:55555/v1/flowers
      //avthar: http://10.8.173.153:55555/v1/flowers
  
      return fetch('http://10.8.173.153:55555/v1/flowers')
      .then((res) => res.json())
      .then((resJson) => {
        that.setState({
          flowers: resJson.flowers,
        })
      })
      .catch((err) => console.log(err));
    }
  
    //individual item in the list
    renderItemFunc = ({item}) => {
      <ListItem
      title = {item.variety}
      subtitle = {item.complete ? 'Complete': 'Fail'}
      />
    }
  
    static navigationOptions = {
      /*title: 'Bloom',*/
      headerTintColor: 'black',
      BackgroundColor: 'black',
      header: null
    };
  
  
  //TO do: figure out how to style stuff in this list properly
  // Display stats of user above session history
    render(){
      console.log(this.state.flowers);
      return(
        <View>
        <Text style = {styles.head}> Bloom </Text>
        <Text style = {styles.desc}> Your Progress</Text>
        <List>
          <FlatList
          data = {this.state.flowers}
          renderItem = {({item}) => (
            <ListItem
            title = {item.variety}
            subtitle = {item.complete ? 'Complete': 'Fail'}
            
            />
          )}
          keyExtractor = {item => item._id}
          />
        </List>
        </View>
      );
    }
  }
  