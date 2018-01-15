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
        totalMins: 0,
        totalSessions: 0,
        fbname: null,
        fbpic: null,
        userid: null,
        fbid: null,
      };
    }
  
    //when component has mounted, get the flowers
    componentDidMount(){
    //check what was passed in navigation
     const stuff = {fbid, fbname, userid, fbpic} = this.props.navigation.state.params;
     var that = this;
     //get all flowers from database
    var API = 'https://safe-forest-34189.herokuapp.com/v1/flowers/query'; 
    return fetch(API, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fbid: stuff.fbid,
        })
      })
      .then((res) => res.json())
      .then((resJson) => {
        //console.log(resJson);
        //console.log("Flowers on server");
        this.setState({flowers: resJson, 
          fbid: stuff.fbid, 
          userid: stuff.userid,
          fbname: stuff.fbname,
          fbpic: stuff.fbpic},() => {

          console.log("State of flowers:");
          console.log(this.state.flowers);

          //Loop thru all the flowers and add up the total number of flowers and the total minutes focused
          var fetchedFlowers = this.state.flowers;
          var sumMins = 0;
          fetchedFlowers.forEach(flower => {
            
            //sum up stats
            sumMins += flower.minutes;
          });

          //set state
          this.setState({totalMins: sumMins, totalSessions: fetchedFlowers.length}, () => {
            console.log("Total Sessions: " + fetchedFlowers.length);
            console.log("Total Minutes Focused: " + this.state.totalMins);
          });

        });
      })
      .catch((err) => {
        console.error(err);
      });

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
      
      let totalSessions = this.state.totalSessions;
      let totalMinutes = this.state.totalMins;
      let fbname = this.state.fbname;

      return(
        //<View style = {{backgroundColor: '#2c3e50',}}>
        <View style = {{backgroundColor: 'black',}}>


          <Text style={styles.space}>   </Text>
          <Text style={styles.space}>   </Text>

          <Text style = {styles.subhead}> {fbname}'s Flower Garden </Text>
          <Text style = {styles.whiteText}> Number of Sessions: {totalSessions}  </Text>
          <Text style = {styles.whiteText}> Total Minutes Focused: {totalMinutes}  </Text>


          <Text style={styles.space}>   </Text>
          <Text style = {styles.head}> History </Text>

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
  
