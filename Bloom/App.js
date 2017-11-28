import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, AppState, Slider} from 'react-native';

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

//require twilio from local
//const twilio = require('./twilio');

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

    //Count up to 100 + restart
    setInterval(() => {
      this.setState(previousState => 
      {
       if (previousState.elapsedTime != previousState.targetTime){
        return {elapsedTime: previousState.elapsedTime+1};
       }
       else{
        return {elapsedTime: this.state.targetTime};
       }
      });

    }, 1000);
  }

  render() {
    let display = this.state.elapsedTime;
    return (
      <Text style = {{fontSize: 30, color: 'white'}}> {display} seconds focused</Text>
    );
  }
}

//Button which sends SMS to accountability buddy
export class SendSMSButton extends React.Component {
  state = {
    toggle : false
  }

  _onPress() {
    //const newState = !this.state.toggle;
    const newState = true;

    //twilio.messages.create({
    //  body: 'Bloom: Jerry has succeeded in his 60min focus session',
      //Hard coded Avthar's number
    //  to: '+16093563125',
      //Twilio number given
    //  from: '+17325888245',

    //})

    this.setState({toggle: newState})

  }

  render(){
    const {toggle} = this.state;
    const textValue = toggle?"SMS Sent":"Send SMS";
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
    inSession: false}
  }; 

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

  //console.log('In Parent function');

  if (pressed) {
    this.setState({inSession: true,});
  }
  else{
    this.setState({inSession: false,});
  }

}

  render(){
    return (
      <View style = {styles.container}>
      <Text style = {styles.head}> Bloom </Text>
      <TextInput style = {styles.taskInput} placeholder = "What do you want to focus on?" />

      <Image 
        style={{width: 400, height: 400}}
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
      <TimerDraft targetTime = {this.state.selectedTime}/>
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

   SendSMSButton: {
    margin: 10,
    backgroundColor: 'blue',
    flex: 1,
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
