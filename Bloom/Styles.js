//----------------------------------------------------
// Styles.js
// Stylesheet object used to determine styles in all
// screens of the app
//----------------------------------------------------
import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
//----------------------------------------------------
// Stylesheet classes
//----------------------------------------------------
export const styles = StyleSheet.create({
    head: {
      fontSize: 30,
      textAlign: 'left',
      color: '#fff',
      marginTop: 20,
      justifyContent: 'space-between',
    },

    subhead: {
      fontSize: 30,
      textAlign: 'center',
      color: '#fff',
      marginTop: 20,
      justifyContent: 'space-between',
    },
    
    //container: {
    //  flex: 1,
    //  backgroundColor: '#000',
    //  alignItems: 'center',
    //  justifyContent: 'center',
    //},
    whiteText: {
      fontSize: 16,
      textAlign: 'center',
      color: '#fff',
      justifyContent: 'space-between',
    },
  
  
    sessionButton: {
      margin: 10,
      height: 50,
      width: 250,
      borderWidth: 0,
      // backgroundColor: '#2ecc71',
      backgroundColor: 'rgba(142,68,173,0.7)',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
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

    container: {
      flex: 1,
      //marginLeft: 20,
      //marginRight: 20, // needs some tweaking
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: '#000', 
      // backgroundColor: '#2c3e50',
    },
    paragraph: {
      margin: 24,
      fontSize: 40,
      fontWeight: 'bold',
      textAlign: 'center',
      // color: '#27ae60',
      color: 'white',
    },
    space: {
      margin: 5,
      fontSize: 5,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#27ae60',
    },
    timer: {
      margin: 24,
      fontSize: 50,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#ecf0f1',
    },
  
    numberInput: {
      height: 35,
      width: 250,
      borderWidth: 0,
      color: '#fff',
      // backgroundColor: '#d35400',
      backgroundColor: 'rgba(190,144,212, 0.8)',
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });
  
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
