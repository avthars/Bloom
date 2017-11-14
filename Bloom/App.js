import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

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

// Test component for getting started
export class Intro extends React.Component {
  render(){
    return (
      <View style = {styles.container}>
       <Text>Welcome to the Bloom Prototype</Text>
        <Text> Focus for 60s:</Text>
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
});
