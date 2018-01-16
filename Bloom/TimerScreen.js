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
  
    }
  
    componentWillUnmount() {
      //reset intervals
      this.handleReset();
    }
  
  
  //functions to start/end session when START/STOP button is pressed
  _handleSession = (pressed) => {
    if (pressed) {
      //start session
      this.setState({sessionSuccess: false, inSession: true}, () => {
        this.handleStart();
      });
      
    }
    else{
      this.setState({inSession: false,}, () => {this.handleStop();});
    }
  }
  
  //function that ends a session currently in progress, 
  //then sends session info to the server
  //extend input params to include minutes focused in a session as well
  _endSession = (success, elapsedTime) => {
    console.log("ENDING SESSION");
    //pick a random flower 
    
    var flowers = ['Rose', 'Daisy', 'Sunflower', 'Iris', 'Dahlia', 'Tulip', 'Jasmine', 
  'Marigold', 'Lilac', 'Daffodil', 'Lotus', 'Lily'];
    
  //pick a random flower
    var flowerVariety = flowers[Math.floor(Math.random()*flowers.length)];

    //convert seconds to minutes
    var minutesFocused = Math.ceil(elapsedTime/60);
    var sessionLength = Math.ceil(this.state.sessionLength/60);
    
    //record session in DB
    this.setState({inSession: false},() => {
      console.log('in EndSession');
      
      console.log("SESSION RECORDED" );
      console.log("INITIAL LENGTH" + sessionLength);
      console.log("TIME FOCUSED:" + minutesFocused);
      putFlower(success, 
        this.state.fbname, this.state.fbid,
        this.state.accBuddyName, this.state.accBuddyNumber,
        flowerVariety, Date.now(), 
        minutesFocused, sessionLength ,this.state.userid);
    
/* `Goal: ${sessionLength} minutes`,
      `You focused for: ${minutesFocused} minutes`,
      `Flower unlocked: ${flowerVariety}`, */

        //Display an alert giving feedback to user after session has ended
    Alert.alert(
      //Title
      `Session: ${success ? 'Success :)' : 'Failed :('}`,
      //Msg
      `Goal: ${sessionLength} mins
      You focused for: ${minutesFocused} mins
      Flower unlocked: ${flowerVariety}`,
      //Buttons
      [
        {text: 'OK', onPress: () => console.log('OK pressed')},
      ],
      //Options
      { cancelable: false },
    );
   
   
      });
  
    //change state to display message on the screen
    if (success){
      this.setState({sessionSuccess: true}, () => {
        this.handleStop();
      });
      
    }
    else {
      this.setState({sessionFailure: true}, () => {
        this.handleStop();
      });
      
    }
  }
  
  //Capture and save phone number associated with session
  _onTextChangeNumber = (number) => {
    this.setState({accBuddyNumber: number});
  }

  //Capture and save phone number associated with session
  _onTextChangeName = (name) => {
    this.setState({accBuddyName: name});
  }
  //After user has finished editing buddy number, take final state
  _onEndInputNumber = () => {
    //save the accountability buddy's number
    console.log("Acc buddy number:");
    console.log(this.state.accBuddyNumber);
  }
  //After user has finished editing buddy name, take final state
  _onEndInputName = () => {
    //save the accountability buddy's number
    console.log("Acc buddy Name:");
    console.log(this.state.accBuddyName);
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

    //maybe make a success/ failure version
    handleStop() {
      // this.refs.circularProgress.performLinearAnimation(100, 0); 
      clearInterval(this.state.interval);
      //figure out whether session was a success or failure before putting tint
      this.setState(prevState => {
        return {
          remainingSeconds : prevState.remainingSeconds,
          countDown : false,
          interval : null,
          // tint : "#e74c3c",
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

        <TextInput                             
          style = {styles.numberInput}
          placeholder = "Partner's Name"
          placeholderTextColor = 'lightgray'
          returnKeyType = 'done'
          onChangeText = {this._onTextChangeName}
          onEndEditing = {this._onEndInputName}
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
          onChangeText = {this._onTextChangeNumber}
          onEndEditing = {this._onEndInputNumber}
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

        {timerField}
  
        </View>
        );
    }
  }
  
//----------------------------------------------------
// Timer Component
// Child component of TimerScreen
// Responsible for checking if user is focused or not
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
        //interval: null,
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
      if (this.state.inSession){
        clearInterval(this.interval);
        console.log("Interval cleared");
      }
      AppState.removeEventListener('change', this._handleAppStateChange);
    }

    _handleAppStateChange = (nextAppState) => {
      //transition from active to background iff session is active
      if ((this.state.appState.match(/active/) && nextAppState === 'background') && this.state.inSession)
      {
        console.log('App is in the background! User is distracted :( ');
        this.setState({appState: nextAppState}, () => {this.props.endSession(false, this.state.elapsedTime);});
      }
      //transition from background/inactive to active iff session is active
     /* else if ((this.state.appState.match(/background|inactive/) && nextAppState === 'active')&& this.state.inSession)
      {
        console.log('App is in the foreground. User is focusing :) ')
        //user came back to foreground, do nothing
      } */
    
      //this.setState({appState: nextAppState});
    }

    //whenever state in parent changes, props are updated
    componentWillReceiveProps(nextProps){
      //upon receiving new props from parent, check if user is inSession
      this.setState({targetTime: nextProps.targetTime, inSession: nextProps.inSession}, () => {
        
      /*  if (this.state.inSession){
         
          //set an interval to time user
          var ival = setInterval(() => {
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
              return {elapsedTime: this.state.targetTime};
             }
            });
          }, 1000);
          //set this as state
          this.setState({interval: ival,});
        } */

        //console.log("Timer Draft State When Receive Props:");
        //console.log(this.state);
      });
    }
  
    render() {
      return (
        <Text style = {{fontSize: 30, color: 'white'}}></Text>
      );
    }
  }
  
  //----------------------------------------------------
  //Button which starts and stops a session
  //----------------------------------------------------
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