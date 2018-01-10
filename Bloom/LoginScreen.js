//----------------------------------------------------
// LoginScreen.js
// Code LoginScreen - the first screen that user
// interacts with in the app
//----------------------------------------------------
import React, { Component } from 'react';
import {Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';
import {styles} from './Styles';

//----------------------------------------------------
// Login Component
//----------------------------------------------------
export default class LoginScreen extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loggedIn: false,
        fbid: '',
        fbname: '',
        fbpic: '',
        userid: '',
      };
    }
  
    logOut(){
       this.setState({
        loggedIn: false,
        fbid: '',
        fbname: '',
        fbpic: '',
       })
    }
  
    //----------------------------------------------------
    // Function that logs user in on facebook
    // and gets user data from fb login
    //----------------------------------------------------
    async logIn() {
      const { navigate } = this.props.navigation;
      const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('1537482253004166', {
          permissions: ['public_profile', 'email', 'user_friends'],
        });
      if (type === 'success') {
        this.setState({
          loggedIn: true,
        })
        // Get the user's name using Facebook's Graph API
        const response = await fetch(
          `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`);
          // Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`,);
        const profile = await response.json();
        console.log("Data from fb profile");
        console.log(profile);
        // still figuring out how to get and render the profile picture
        // register this user with the DB and get their userid
        let userid = await this.registerUserAndGetUserID(profile.name, profile.id, profile.picture.data.url);
        //set app state with values from FB and DB
        this.setState({
          fbid: profile.id,
          fbname: profile.name,
          fbpic: profile.picture.data.url,
          userid: userid,
        }, () => {
          //only display this after state has updated
          Alert.alert(
          'Logged in!',
          `Hi ${profile.name}!`,
          [
            {text: 'Logout', onPress: () => console.log('Logout Requested')},
            {text: 'Next', onPress: () => navigate('Home', {fbid: this.state.fbid, fbname: this.state.fbname, userid: this.state.userid, fbpic: this.state.fbpic})},
          ],
          { cancelable: false },
        );});
      }
    }
  
    //------------------------------------------------------
    // Function that registers user 
    // and retrieves their unique userid from the database
    //------------------------------------------------------
    async registerUserAndGetUserID(fbname, fbid, fbProfilePicURL) {
      try {
        let API_ROOT = 'https://safe-forest-34189.herokuapp.com/v1';
        let response = await fetch(API_ROOT+'/users/register', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fbname: fbname,
            fbid: fbid,
            fbProfilePicURL: fbProfilePicURL,
          }),
        });
        //userID corresponds to key message: userid
        let responseJson = await response.json()
        console.log("USER obj FROM DB:")
        console.log(responseJson);
        let userid = responseJson.userid;
        return userid
      } catch (error) {
        console.error(error);
      }
    }
  
    componentWillUpdate(){
      //console.log("printing state upon update");
      //console.log(this.state);
  }
  
    //nav data: title of screen
    static navigationOptions = {
      /*title: 'Bloom',*/
      headerTintColor: 'black',
      BackgroundColor: 'black',
      header: null
    };
  
    render() {
      const { navigate } = this.props.navigation;
      return (
        <View style = {{
              flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: '#000',
        }}>
  
        <Text style = {styles.paragraph}> Bloom </Text>
        <Text style = {styles.desc}> The Focus and Accountability App</Text>
  
        <Text style = {styles.head}>  </Text>
        <Image source={require('./flower2.gif')} style = {{height: 340, width: 400, resizeMode : 'stretch',}} />
           <Text style = {styles.head}>  </Text>
  


          <TouchableOpacity
            style = {styles.sessionButton}
            onPress = {this.logIn.bind(this)}
            >
            <Text style = {{color: 'white', textAlign: 'center', fontSize: 20, }}> Login with Facebook </Text>
          </TouchableOpacity>

        </View>
      );
    }
  }
