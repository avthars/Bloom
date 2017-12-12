import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps as mapProps} from 'react-navigation-props-mapper';
//session object
import {Session} from './session';

  //local database    .
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

//----------------------------------------------------
// Main App Component
//----------------------------------------------------
//containts info accessible to all other components in the app via props
//
export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      //get these values from the DB when the app starts
      totalSessions: 0,
      totalSuccesses: 0,
      totalFailures:0,
      totalTime:0,
      //Arr of session objects to display in results
      sessionHistory: [],
    };
  }

  //method to record end of session
  _recordSession = (session, success) => {

    //incr total sessions
    if (success) {
      //incr totalSuccesses
    }
    else {
      //incr totalFailures
    }

    //add session to sessionHistory

    //add session.time to totalTime focused

  }


  render() {
    return (<SimpleApp
    />);
  }
}


//----------------------------------------------------
// Login Component -- should change
//----------------------------------------------------
class LoginScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  
  //----------------------------------------------------
  //--------------login attempt 1 ----------------------
  async logIn() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1537482253004166', {
        permissions: ['public_profile'],
      });
    if (type === 'success') {
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );
    }
  }
  
  static navigationOptions = {
    title: 'Welcome to Bloom',
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View>
        
        <Button
      onPress = {this.logIn.bind(this)}
      title   = 'Login with Facebook'
      />
        
        <Button
          onPress={() => navigate('Home')}
          title="Go to Timer"
        />


      </View>
    );
  }
}


//----------------------------------------------------
// Timer Component
//----------------------------------------------------
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
        this.props.endSession(true);
        this.props.sendSMS(true);
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

//-----------------------------------------------------
// Main screen for session start + timing
//-----------------------------------------------------
export class TimerScreen extends React.Component {
  constructor(props) {
  super(props)
  this.state = 
  { selectedTime: 1,
    appState: AppState.currentState,
    inSession: false,
    accBuddyNumber: '',
    sessionSuccess: false,
    sessionFailure: false,
  }
  };

  //Data passed thru navigator
  static navigationOptions = {
    title: 'Timer Screen'
  };
  
  //set inSession, sessionSuccess, sessioFailure to false
  _reset = () => {
    this.setState({inSession: false});
    this.setState({sessionSuccess: false});
    this.setState({sessionSuccess: false});
  }

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
    this.setState({inSession: true,});
    
  }
  else{
    this.setState({inSession: false,});
    //end a current session and don't send feedback to user
  }
}

//function to make HTTP Req to send SMS to accountability buddy
_sendSMS = (success) => {
  
  //var SMS = Platform.OS === 'android'
  //? 'http://10.8.173.153:55555/sms'
  //: 'http://localhost:55555/sms';

  //successful message
  var SMS = 'http://10.8.173.153:55555/sms';
  if (!success){
    //failure message
    SMS = 'http://10.8.173.153:55555/smsfail';
  }
  
  fetch(SMS)
  .then((response) => response.json())
  .catch((error) => {
    //should display error on screen if SMS cannot be sent
    console.error(error);
  });
}

//function that ends a session currently in progress
_endSession = (success) => {
  //end session
  this.setState({inSession: false});

  if (success){
    this.setState({sessionSuccess: true});
    this.setState({inSession: false});
  }
  else {
    this.setState({sessionFailure: true});
    this.setState({inSession: false})
  }

  //create new Session object + update results



}


//Capture and save task associated with session
_onTextChange = (number) => {
  //console.log(task);
  this.setState({accBuddyNumber: number});
}
//After user has finished editing input, take final state
_onEndInput = () => {
  //save the accountability buddy's number
  console.log(this.state.accBuddyNumber);
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
      <Text style = {styles.head}> Bloom </Text>
      <Text style = {styles.desc}> The Focus and Accountability App</Text>
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
// Navigation
//----------------------------------------------------
const SimpleApp = StackNavigator({
  //list of screens in app
  Login: {screen: LoginScreen},
  Home: {screen: TimerScreen},
});

//----------------------------------------------------
// Stylesheet classes
//----------------------------------------------------
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

  numberInput: {
    height: 40,
    width: 600,
    borderWidth: 0,
    color: 'white',
    backgroundColor: '#c0392b',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center',
  },
  desc: {
    height: 40,
    width: 600,
    borderWidth: 0,
    color: 'white',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16,
    textAlign: 'center',
  },


});
