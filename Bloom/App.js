import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, AppState

} from 'react-native';

//require twilio from local
//const twilio = require('./twilio');


//App
export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
       <Intro/>
        <Text>Shake your phone to open the developer menu.</Text>
      </View>
    );
  }
}

// Initial version of Timer
class TimerDraft extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time:60
    };

    // Toggle the state every second
    setInterval(() => {
      this.setState(previousState => {
        return { time: previousState.time - 1};
      });
    }, 1000);
  }

  render() {
    let display = this.state.time;
    return (
      <Text>{display}</Text>
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
      <Text>Bloom current state: {this.state.appState}</Text>
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
    const textValue = toggle?"ACTIVE SESSION":"INACTIVE SESSION";
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
  render(){
    return (
      <View style = {styles.container}>

       <Text>Welcome to the Bloom Prototype</Text>
        <Text> Focus for 60s:</Text>
        <Text> I want to focus on: </Text>
        <TextInput style = {styles.taskInput} placeholder = "What do you want to focus on?" />
        <SessionButton/>
        <AppStateTing/>
        <TimerDraft/>
        <SendSMSButton/>
      </View>
      );
  }
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  sessionButton: {
    margin: 10,
    backgroundColor: 'blue',
    flex: 1,
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
    color: 'black',
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
