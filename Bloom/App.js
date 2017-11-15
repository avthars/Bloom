import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, Button, TouchableOpacity, 


} from 'react-native';

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
