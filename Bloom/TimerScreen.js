//----------------------------------------------------
// TimerScreen.js
// Code for TimerScreen and related components which
// is main screen user interacts with in the app
//----------------------------------------------------
import React, { Component } from 'react';
import {Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';
//style sheet
import {styles, slider} from './Styles';


// NEW UI
import {StyleSheet} from 'react-native';
import Slider from "react-native-slider";
import { AnimatedCircularProgress } from 'react-native-circular-progress';


//-----------------------------------------------------
// Main screen for session start + timing
//-----------------------------------------------------
export default class TimerScreen extends React.Component {
    constructor(props) {
    super(props);
    this.state =
    { 
      //appState: AppState.currentState,
      inSession: false,
      accBuddyName: '',
      accBuddyNumber: '',
      sessionSuccess: false,
      sessionFailure: false,
      sessionLength: 0,
      //get the following from the state in LoginScreen
      fbname: 'Facebook Name',
      fbid: 'dbid1',
      userid: 'randomid',
      fbpic: '',

      // CIRCULAR TIMER 
      countDown : false,
      remainingSeconds : 20 * 60,
      interval : null,
      sliderValue : 1200,
      fill : 0,
      tint : "#2ecc71",
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
  
      //AppState.addEventListener('change', this._handleAppStateChange);
    }
  
    componentWillUnmount() {
      //AppState.removeEventListener('change', this._handleAppStateChange);
    }
  
    /*
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
  */
  
  //functions to start/end session when START/STOP button is pressed
  _handleSession = (pressed) => {
    if (pressed) {
  
      //start new session and create new session object
  
      //start session
      this.setState({sessionSuccess: false, inSession: true});
      this.handleStart()
    }
    else{
      this.setState({inSession: false,});
      this.handleStop()
      //end a current session and don't send feedback to user
    }
  }
  
  //function that ends a session currently in progress, 
  //then sends session info to the server
  //extend input params to include minutes focused in a session as well
  _endSession = (success, elapsedTime) => {
    
    this.setState({inSession: false},() => {
      console.log('in EndSession');
      let flowerVariety = 'Rose';
      let minutesFocused = elapsedTime;
      let sessionLength = this.state.sessionLength;
      console.log("SESSION RECORDED: " );
      console.log("INITIAL LENGTH" + sessionLength);
      console.log("TIME FOCUSED:" + minutesFocused);
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
      this.handleStop()
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
    console.log("Acc buddy phone number:");
    console.log(this.state.accBuddyNumber);
    this.setState({accBuddyName: 'Felix'}, () => {console.log('accBuddyName:' + this.state.accBuddyName);});
  }
  

  // -------------------------|
  // CIRCULAR TIMER FUNCTIONS |
  // -------------------------|

    handleStart() {  
      this.refs.circularProgress.performLinearAnimation(100, this.state.remainingSeconds * 1000); 
      var ival = setInterval(() => {
        if ((this.state.remainingSeconds > 0) && this.state.countDown) {
          this.setState(prevState => {
            return {remainingSeconds : prevState.remainingSeconds - 1};
          });
        }
      }, 1000);

      this.setState(prevState => {
        return {
          remainingSeconds : prevState.remainingSeconds, 
          countDown : true,
          interval : ival,
          //tint : "#2ecc71",
          backgroundColor : "#3d5875",
        };
      });
    }

    handleStop() {
      this.refs.circularProgress.performLinearAnimation(100, 0); 
      clearInterval(this.state.interval);
      this.setState(prevState => {
        return {
          remainingSeconds : prevState.remainingSeconds,
          countDown : false,
          interval : null,
          tint : "#e74c3c",
          fill : 0,
        };
      });
    }

    handleReset() {
      clearInterval(this.state.interval);
      this.setState(() => {
        return {
          remainingSeconds : 20 * 60, 
          countDown : false,
        };
      });
    }

    formatRemainingSeconds(remainingSeconds) {
      let numMinutes = Math.floor(remainingSeconds / 60);
      let numSeconds = remainingSeconds % 60;
      let formattedTime = "";

      if (numMinutes.toString().length == 1) {
        formattedTime += '0';
        formattedTime += numMinutes.toString();
      } else {
        formattedTime += numMinutes.toString();
      }

      formattedTime += ":";

      if (numSeconds.toString().length == 1) {
        formattedTime += '0';
        formattedTime += numSeconds.toString();
      } else {
        formattedTime += numSeconds.toString();
      }

      return formattedTime;
    }
  // -------------------------|


    render(){
      //conditionally render time elapsed in session
      let timerField = null;
      if (this.state.inSession){
        timerField = <TimerDraft
        inSession  = {this.state.inSession}

        //targetTime = {this.stat}
        // WHAT IT SHOULD BE: remainingSeconds  --> not working tho for reason stated below    vvv

        targetTime = {this.state.sessionLength} 
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
  

        <Text style={styles.paragraph}>
          Bloom
        </Text>

        <TextInput                              //  <--- NEEDS FIXING (SAVE INPUT AND USE IT)
          style = {styles.numberInput}
          placeholder = "Partner's Name"
          placeholderTextColor = 'lightgray'
          returnKeyType = 'done'
          onEndEditing = {this._onEndInput}
          value = {this.state.accBuddyName}
        />

        <Text style={styles.space}>   </Text>


        <TextInput
          style = {styles.numberInput}
          placeholder = "Phone Number"
          placeholderTextColor = 'lightgray'
          returnKeyType = 'done'
          keyboardType = 'number-pad'
          maxLength = {10}
          onChangeText = {this._onTextChange}
          onEndEditing = {this._onEndInput}
          value = {this.state.accBuddyNumber}
        />

        <Text style={styles.space}>   </Text>
        <Text style={styles.space}>   </Text>

        <AnimatedCircularProgress
          ref='circularProgress'
          size={240}
          width={25}
          fill={this.state.fill}
          tintColor={this.state.tint}
          backgroundColor="#3d5875"
          >
          {
            (fill) => (
              <Text style={styles.timer}> 
                {this.formatRemainingSeconds(this.state.remainingSeconds)} 
              </Text>
            )
          }
        </AnimatedCircularProgress>

        <Text style={styles.space}>   </Text>
        <Text style={styles.space}>   </Text>

        <Slider
          trackStyle={sliderStyles.track}
          thumbStyle={sliderStyles.thumb}
          minimumTrackTintColor='#eecba8'
          minimumValue={ 1 * 60}
          maximumValue={60 * 60}
          step={60}
          value={this.state.sliderValue}
          //onValueChange={value => this.setState({ sliderValue : value })}
          onValueChange={value => this.setState({ sessionLength: value, remainingSeconds: value,})}
        />

        <SessionButton
        handleSession = {this._handleSession}
        inSession = {this.state.inSession}
        />
  
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
        appState: AppState.currentState,
        inSession: this.props.inSession,
        targetTime: this.props.targetTime,
        elapsedTime: 0,
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
          this.props.endSession(true, previousState.elapsedTime);
          //this.props.sendSMS(true);
          return {elapsedTime: this.state.targetTime};
         }
        });
  
      }, 1000);
  
    }
  

    componentDidMount(){
      AppState.addEventListener('change', this._handleAppStateChange);
    }

    //before this component exits the screen, clear the timer
    componentWillUnmount(){
      clearInterval(this.interval);
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
      //transition from active to background iff session is active
      if ((this.state.appState.match(/active/) && nextAppState === 'background') && this.state.inSession)
      {
        console.log('App is in the background! User is distracted :( ')
        this.props.endSession(false, this.state.elapsedTime);
    
      }
      //transition from background/inactive to active iff session is active
      else if ((this.state.appState.match(/background|inactive/) && nextAppState === 'active')&& this.state.inSession)
      {
        console.log('App is in the foreground. User is focusing :) ')
        //user came back to foreground, do nothing
      }
    
      this.setState({appState: nextAppState});
    }

    //whenever state in parent changes, props are updated
    componentWillReceiveProps(nextProps){
      this.setState({targetTime: nextProps.targetTime, inSession: nextProps.inSession}, () => {
      });

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
  
  
  
  var sliderStyles = StyleSheet.create({
    track: {
      width: 250,
      height: 30,
      borderRadius: 5,
      backgroundColor: '#d0d0d0',
    },
    thumb: {
      width: 10,
      height: 40,
      borderRadius: 5,
      backgroundColor: '#eb6e1b',
    }
  });