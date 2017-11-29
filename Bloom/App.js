import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform} from 'react-native';
import ApiUtils from './api-utils.js';
//local database
//var db = require('react-native-sqlite3');

// sends request to server to put flower in database
// sample usage: putFlower('xxxxx', 'tigerlily', 'true');
function putFlower(id, variety, complete) {
  var API = Platform.OS === 'android'
  ? 'http://10.9.9.30:55555/v1/flowers'
  : 'http://localhost:55555/v1/flowers';

  fetch(API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: id,
      variety: variety,
      complete: complete,
      time: Date.now()
    })
  })
  .then((res) => res.json())
  .catch((err) => {
    console.error(err);
  });
}

//Main App Component
//containts main app state
export default class App extends React.Component {
  constructor(props){
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
       <TimerScreen/>
      </View>
    );
  }
}

// Initial version of Timer
class TimerDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetTime: this.props.targetTime,
      elapsedTime: 0
    };

    //count up to target time + then stop
    //interval for rerendering component
    
    this.interval = setInterval(() => {
      this.setState(previousState => 
      {
      //continue if not yet reached target and session is active
       if ((previousState.elapsedTime != this.props.targetTime)){
        return {elapsedTime: previousState.elapsedTime +1};
       }
       //stop if reached target and session is active
       else {
        //call session complete function
        //this.props.sessionComplete(true)
        return {elapsedTime: this.state.targetTime};
       }
      });
    
    }, 1000);  
  
  }

  componentWillUnmount(){
    clearInterval(this.interval);
  }

  render() {
    return (
      <Text style = {{fontSize: 30, color: 'white'}}> {this.state.elapsedTime} seconds focused</Text>
    );
  }
}

//Button which sends SMS to accountability buddy
export class SMSButton extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      toggle: false
    }
  }


  getMoviesFromApiAsync() {
    return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson.movies;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  //function which contacts server, which sends GET request to server to send SMS
  _sendSMS = () => {
    var SMS = Platform.OS === 'android'
    ? 'http://10.8.173.153:55555/sms'
    : 'http://localhost:55555/sms';
    
    fetch(SMS)
    .then((response) => response.json())
    .catch((error) => {
      console.error(error);
    });
  }

  _onPress() {
    //change state
    const newState = !this.state.toggle;
    this.setState({toggle: newState})

    //call send message function
    this._sendSMS();
  }

  render(){
    const {toggle} = this.state;
    const textValue = toggle?"SMS Sent":"Send SMS";
    return (
            <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity 
            style = {styles.sessionButton}
            onPress = {()=> this._onPress()}>
            <Text style = {{color: 'white', textAlign: 'center', fontSize: 16, }}> {textValue} </Text>
            </TouchableOpacity>
            </View>
      );
  }
}

//Button which starts and stops a session
export class SessionButton extends React.Component {
  state = {
    toggle : false
  }

  //Start new session or end current session when button is pressed
  _onPress() {
    const newState = !this.state.toggle;

    this.setState({toggle: newState})

    this.props.handleSession(newState);
  }

  render(){
    const {toggle} = this.state;
    const textValue = toggle?"STOP":"START";
    return (
          <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity 
            style = {styles.sessionButton}
            onPress = {()=> this._onPress()}
            >
              <Text style = {{color: 'white', textAlign: 'center', fontSize: 16, }}> {textValue} </Text>
            </TouchableOpacity>
          </View>
      );
  }
}

// Test component for getting started
export class TimerScreen extends React.Component {
  constructor(props) {
  super(props)
  this.state = 
  { selectedTime: 1,
    appState: AppState.currentState,
    inSession: false,
    sessionTask: ''
  }
  }; 

  //functions for internal App state
  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
  //transition from active to background iff session is active
  if ((this.state.appState.match(/active/) && nextAppState === 'background') && this.state.inSession)
  {
    console.log('App is in the background! User is distracted :( ')
  }
  //transition from background/inactive to active iff session is active
  else if ((this.state.appState.match(/background|inactive/) && nextAppState === 'active')&& this.state.inSession)
  {
    console.log('App is in the foreground. User is focusing :) ')
  }

  this.setState({appState: nextAppState});
}

//functions to start/end session when START/STOP button is pressed
_handleSession = (pressed) => {
  if (pressed) {
    this.setState({inSession: true,});
  }
  else{
    this.setState({inSession: false,});
  }
}

//function to make HTTP Post Request to Twilio

//Capture and save task associated with session
_onTextChange = (task) => {
  //console.log(task);
  this.setState({sessionTask: task});
}

//After user has finished editing input, take final state
_onEndInput = () => {
  console.log(this.state.sessionTask);
}

  render(){

    //conditionally render time elapsed in session
    const isInSession = this.state.inSession;
    let timerField = null;
    if (isInSession){
      timerField = <TimerDraft 
      inSession = {this.props.inSession} 
      targetTime = {this.state.selectedTime*60}/>;
    }

    return (
      <View style = {styles.container}>
      <Text style = {styles.head}> Bloom </Text>
      <TextInput 
      style = {styles.taskInput} 
      placeholder = "What do you want to focus on?"
      onChangeText = {this._onTextChange}
      onEndEditing = {this._onEndInput}
      />
      <SMSButton/>
      <Image 
        style={{width: 300, height: 300}}
        source={require('./bloom.png')} />      
      
      <Text style = {styles.whiteText}>
      Focus for {this.state.selectedTime} minutes
      </Text>

      <Slider
            style={{ width: 300 }}
            step={0.5}
            minimumValue={0.5}
            maximumValue={5}
            value={this.state.selectedTime}
            //thumbTouchSize={width: 80, height: 80}
            onValueChange={val => this.setState({selectedTime: val })}
            />
      
      <SessionButton 
      handleSession = {this._handleSession}
      />
      <Text style = {styles.whiteText}> In Session = {this.state.inSession ? 'ACTIVE':'INACTIVE'} </Text>
      {timerField}
      </View>
      );
  }
}




const styles = StyleSheet.create({
  head: {
    fontSize: 40,
    textAlign: 'center',
    color: '#fff',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  whiteText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
    justifyContent: 'space-between',
  },


  sessionButton: {
    margin: 10,
    backgroundColor: '#c0392b',
    borderRadius: 15,
    flex: .5,
    height: 60,
    justifyContent: 'center',
  },

  taskInput: {
    height: 40,
    width: 250,
    borderWidth: 0,
    color: 'white',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center',
  },

});
