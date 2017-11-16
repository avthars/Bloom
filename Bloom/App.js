import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, AppState, Slider} from 'react-native';

//require twilio from local
//const twilio = require('./twilio');


//App
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
       <Intro/>
      </View>
    );
  }
}

// Initial version of Timer
class TimerDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time:0
    };

    // Toggle the state every second
    setInterval(() => {
      this.setState(previousState => 
      {
       
       if (previousState.time == 100){
        return {time: 0};
       }
       else{
        return {time: previousState.time + 1};
       }
      });

    }, 1000);
  }

  render() {
    let display = this.state.time;
    return (
      <Text style = {{fontSize: 30, color: 'white'}}> {display} seconds focused</Text>
    );
  }
}


//App state
export class AppStateTing extends React.Component {

  state = {
    appState: AppState.currentState
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    
    //transition from active to background
    if (this.state.appState.match(/active/) && nextAppState === 'background') {
      console.log('App is in the background! User is distracted :( ')
    }
    //transition from background/inactive to active
    else if (this.state.appState.match(/background|inactive/) && nextAppState === 'active'){
      console.log('App is in the foreground. User is focusing :) ')
    }

    this.setState({appState: nextAppState});
  }

  render() {
    return (
      <Text style = {{fontSize: 16, color: 'white'}}>current state: {this.state.appState}</Text>
    );
  }

}

//Button which starts and stops a session
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

  _onPress() {
    const newState = !this.state.toggle;
    this.setState({toggle: newState})

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
export class Intro extends React.Component {
  
  constructor(props) {
  super(props)
  this.state = { time: 60 }
  } 
  getTime(val){
  console.warn(val);
  }   
 
  
  render(){
    return (
      <View style = {styles.container}>
      <Text style = {styles.head}> Bloom </Text>
      <Text></Text>
      <Image 
        style={{width: 400, height: 400}}
        source={require('./bloom.png')} />
      <Text></Text>
      <Text></Text>

      <TextInput style = {styles.taskInput} placeholder = "What do you want to focus on?" />
      
      <Text style = {styles.whiteText}>
      focus for {this.state.time} minutes
      </Text>
      
      <Slider
            style={{ width: 300 }}
            step={5}
            minimumValue={5}
            maximumValue={120}
            value={this.state.time}
            onValueChange={val => this.setState({ time: val })}
            />
            
      <SessionButton/>
      <AppStateTing/>
      <TimerDraft/>
      {/* <SendSMSButton/> */}
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
    fontSize: 12,
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
  },

});
