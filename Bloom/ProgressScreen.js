//----------------------------------------------------
// ProgressScreen.js
// Code for ProgressScreen which displays user 
// history
//----------------------------------------------------
import React, { Component } from 'react';
import {Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
import {List, ListItem, Avatar} from 'react-native-elements';
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

        //sort response by date

        this.setState({flowers: resJson.reverse(), 
          fbid: stuff.fbid, 
          userid: stuff.userid,
          fbname: stuff.fbname,
          fbpic: stuff.fbpic},() => {

          console.log("State of flowers:");
          console.log(this.state.flowers);

          //Loop thru all the flowers and add up the total number of flowers and the total minutes focused
          var fetchedFlowers = this.state.flowers;

          //sort flowers by date
          //fetchedFlowers.sort((a,b) => {return a.endTime.getTime() - b.endTime.getTime()});
          //fetchedFlowers.sort(function(a, b){return a - b});

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
      let userpic = this.state.fbpic;

      return(
        //<View style = {{backgroundColor: '#2c3e50',}}>
        <View style = {{backgroundColor: 'black',}}>
         <View style={styles.image_view}>
          <Avatar
            medium
            rounded
            source={{uri: userpic}}
            onPress={() => console.log("Works!")}
            activeOpacity={0.7} />
          <Text style = {styles.subhead}> {fbname}'s Flower Garden </Text>
          <Text style = {styles.whiteText}> Number of Sessions: {totalSessions}  </Text>
          <Text style = {styles.whiteText}> Total Minutes Focused: {totalMinutes}  </Text>
        </View>
        
          <Text style = {styles.head}> History </Text>

        <List>
          <FlatList
          data = {this.state.flowers}
          renderItem = {({item}) => (
            <ListItem
            roundAvatar
            avatar = {{uri: item.complete ? 'http://www.newdesignfile.com/postpic/2009/07/flower-icon_86893.png':'https://d30y9cdsu7xlg0.cloudfront.net/png/13906-200.png'}}
            title = {item.minutes +'/'+ item.sessionLength+ ' mins'}
            subtitle = {item.complete ? 'Complete': 'Fail'}
            rightTitle = {'Buddy: ' + item.buddyName}
            hideChevron = {true}
            />
          )}
          keyExtractor = {item => item._id}
          />
        </List>
        </View>
      );
    }
  }
  
