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
      backgroundColor: '#613b83',
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
      backgroundColor: '#613b83',
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