//----------------------------------------------------
// TimerScreen.js
// Code for TimerScreen and related components which
// is main screen user interacts with in the app
//----------------------------------------------------
import React, { Component } from 'react';
import {Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';
//style sheet
import {styles} from './Styles';

//-----------------------------------------------------
// Main screen for session start + timing
//-----------------------------------------------------
export default class TimerScreen extends React.Component {
    constructor(props) {
    super(props);
    this.state =
    { selectedTime: 1,
      appState: AppState.currentState,
      inSession: false,
      accBuddyName: '',
      accBuddyNumber: '',
      sessionSuccess: false,
      sessionFailure: false,
      //get the following from the state in LoginScreen
      fbname: 'Facebook Name',
      fbid: 'dbid1',
      userid: 'randomid',
      fbpic: '',
    }
    };
  
    //Data passed thru navigator
    static navigationOptions = {
      title: 'Focus',
      header: null
    };
  
    //set inSession, sessionSuccess, sessioFailure to false
    _reset = () => {
      this.setState({inSession: false});
      this.setState({sessionSuccess: false});
      this.setState({sessionSuccess: false});
    }
  
    componentDidUpdate(){
    }
  
    //functions for internal App state
    componentDidMount() {
      //check what was passed in navigation
     const stuff = {fbid, fbname, userid, fbpic} = this.props.navigation.state.params;
     
     //update state from stuff in LoginScreen
     this.setState({fbname: stuff.fbname, 
      fbid: stuff.fbid, 
      fbpic: stuff.fbpic,
      userid: stuff.userid,}, () => {
      console.log("State after getting stuff from login");
      console.log(this.state);
    });
  
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
      //call end session function --> send SMS
      //ENABLE FOR DEMO
      //this._sendSMS(false);
      this._endSession(false);
  
    }
    //transition from background/inactive to active iff session is active
    else if ((this.state.appState.match(/background|inactive/) && nextAppState === 'active')&& this.state.inSession)
    {
      console.log('App is in the foreground. User is focusing :) ')
      //user came back to foreground, do nothing
    }
  
    this.setState({appState: nextAppState});
  }
  
  //functions to start/end session when START/STOP button is pressed
  _handleSession = (pressed) => {
    if (pressed) {
  
      //start new session and create new session object
  
      //start session
      this.setState({sessionSuccess: false, inSession: true});
    }
    else{
      this.setState({inSession: false,});
      //end a current session and don't send feedback to user
    }
  }
  
  //function that ends a session currently in progress, 
  //then sends session info to the server
  //extend input params to include minutes focused in a session as well
  _endSession = (success) => {
    
    this.setState({inSession: false},() => {
      let flowerVariety = 'Rose';
      let minutesFocused = 35;
      let sessionLength = 35;
      putFlower(success, 
        this.state.fbname, this.state.fbid,
        this.state.accBuddyName, this.state.accBuddyNumber,
        flowerVariety, Date.now(), 
        minutesFocused, sessionLength ,this.state.userid);
    });
  
    //change state to display message on the screen
    if (success){
      this.setState({sessionSuccess: true});
    }
    else {
      this.setState({sessionFailure: true});
    }
  }
  
  
  //Capture and save phone number associated with session
  _onTextChange = (number) => {
    //console.log(task);
    this.setState({accBuddyNumber: number});
  }
  //After user has finished editing input, take final state
  _onEndInput = () => {
    //save the accountability buddy's number
    console.log("Acc buddy phone number:")
    console.log(this.state.accBuddyNumber);
    this.setState({accBuddyName: 'Felix'}, () => {console.log('accBuddyName:' + this.state.accBuddyName);});
    //send entered number to server
    //this._sendPhoneNum(this.state.accBuddyNumber, 'Felix');
  }
  
    render(){
      //conditionally render time elapsed in session
      let timerField = null;
      if (this.state.inSession){
        timerField = <TimerDraft
        inSession  = {this.props.inSession}
        targetTime = {this.state.selectedTime*60}
        endSession = {this._endSession}
        sendSMS    = {this._sendSMS}/>;
      }
      //conditionally render session success message
      let victoryMsg = null;
  
      if(this.state.sessionSuccess){
        //HILAL: Change styles on this to make look big and nice
        victoryMsg = <Text style = {styles.whiteText}> Session Complete :) </Text>;
      }
      else {
        victoryMsg = null;
      }
      //conditionally render failure message
      let failureMsg = null;
      if(this.state.sessionFailure){
        //HILAL: Change styles on this to make look big and nice
        failureMsg = <Text style = {styles.whiteText}> Session Failed :( </Text>;
      }
      else{
        failureMsg = null;
      }
  
      //for navigation
      const { navigate } = this.props.navigation;
  
      return (
        <View style = {styles.container}>
  
        <TextInput
        style = {styles.numberInput}
        placeholder = "Accountability Buddy's Phone #"
        placeholderTextColor = 'lightgray'
        returnKeyType = 'done'
        keyboardType = 'number-pad'
        onChangeText = {this._onTextChange}
        onEndEditing = {this._onEndInput}
        value = {this.state.accBuddyNumber}
        />
  
        <Image source={require('./flower1.gif')} style = {{height: 340, width: 400, resizeMode : 'stretch',}} />
  
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
        inSession = {this.state.inSession}
        />
  
        <Text style = {styles.whiteText}> In Session = {this.state.inSession ? 'ACTIVE':'INACTIVE'} </Text>
        {timerField}
        {victoryMsg}
        {failureMsg}
        </View>
        );
    }
  }
  
//----------------------------------------------------
// Timer Component
// Child component of TimerScreen
//----------------------------------------------------
// Initial version of Timer
export class TimerDraft extends React.Component {
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
          this.props.endSession(true);
          //this.props.sendSMS(true);
          return {elapsedTime: this.state.targetTime};
         }
        });
  
      }, 1000);
  
    }
  
    //before this component exits the screen, clear the timer
    componentWillUnmount(){
      clearInterval(this.interval);
    }
  
    render() {
      return (
        <Text style = {{fontSize: 30, color: 'white'}}> {this.state.elapsedTime} seconds focused</Text>
      );
    }
  }
  
  //Button which starts and stops a session
  export class SessionButton extends React.Component {
    state = {
      toggle : this.props.inSession
    }
  
    //Start new session or end current session when button is pressed
    _onPress() {
      const newState = !this.state.toggle;
  
      this.setState({toggle: newState})
  
      this.props.handleSession(newState);
    }
  
    render(){
      const textValue = this.props.inSession?"IN SESSION":"START";
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
  
  
  