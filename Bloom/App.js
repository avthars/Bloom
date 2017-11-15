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
  render(){
    return (
          <View style = {{flexDirection: 'row'}}>
            <TouchableOpacity style = {styles.sessionButton}>
              <Text style = {{color: 'white', textAlign: 'center', fontSize: 16, }}> START </Text>
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
