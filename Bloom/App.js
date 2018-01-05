import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Video, TextInput, Button, TouchableOpacity, AppState, Slider,
  Platform, AppRegistry, Alert, FlatList} from 'react-native';
import {List, ListItem} from 'react-native-elements';
import { StackNavigator, TabNavigator, DrawerNavigator } from 'react-navigation';
import { withMappedNavigationProps as mapProps} from 'react-navigation-props-mapper';
//session object
import {Session} from './session';
//functions to interface with server and DB
import {putFlower, getFlowers} from './communication.js';


//----------------------------------------------------
// Main App Component
//----------------------------------------------------
//containts info accessible to all other components in the app via props

export default class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {};
  }
  render() {
    return (<SimpleApp/>);
  }
}

//----------------------------------------------------
// Login Component -- should change
//----------------------------------------------------
class LoginScreen extends React.Component {
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
        `Hi ${profile.name}! Your userID is ${userid}`,
        [
          {text: 'Logout', onPress: () => console.log('Logout Requested')},
          {text: 'Next', onPress: () => navigate('Home', {fbid: this.state.fbid, fbname: this.state.fbname, userid: this.state.userid, fbpic: this.state.fbpic})},
        ],
        { cancelable: false },
      );});
    }
  }

  //register user and get unique userid
  async registerUserAndGetUserID(fbname, fbid, fbProfilePicURL) {
    try {
      let API_ROOT = 'http://10.8.173.153:55555/v1';
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
      <View style = {styles.container}>

       <Text style = {styles.head}> Bloom </Text>
    <Text style = {styles.desc}> The Focus and Accountability App</Text>

     <Text style = {styles.head}>  </Text>
      <Image source={require('./flower2.gif')} style = {{height: 340, width: 400, resizeMode : 'stretch',}} />
         <Text style = {styles.head}>  </Text>

        <Button
      onPress = {this.logIn.bind(this)}
      title   = 'Login with Facebook'
      />

        <Button
          onPress={() => navigate('Home')}
          title="skip"
        />


      </View>
    );
  }
}


//----------------------------------------------------
// Progress Screen Component
// shows user history and total stats
// Uses react-native-elements List and ListItem, 
// See docs for styling and implementation tips
//----------------------------------------------------
class ProgressScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      flowers: [],
    };
  }

  //when component has mounted, get the flowers
  componentDidMount(){
    var that = this;
    //get all flowers from database
    //shefali: http://10.8.68.109:55555/v1/flowers
    //avthar: http://10.8.173.153:55555/v1/flowers

    return fetch('http://10.8.173.153:55555/v1/flowers')
    .then((res) => res.json())
    .then((resJson) => {
      that.setState({
        flowers: resJson.flowers,
      })
    })
    .catch((err) => console.log(err));
  }

  //individual item in the list
  renderItemFunc = ({item}) => {
    <ListItem
    title = {item.variety}
    subtitle = {item.complete ? 'Complete': 'Fail'}
    />
  }

  static navigationOptions = {
    /*title: 'Bloom',*/
    headerTintColor: 'black',
    BackgroundColor: 'black',
    header: null
  };


//TO do: figure out how to style stuff in this list properly
// Display stats of user above session history
  render(){
    console.log(this.state.flowers);
    return(
      <View>
      <Text style = {styles.head}> Bloom </Text>
      <Text style = {styles.desc}> Your Progress</Text>
      <List>
        <FlatList
        data = {this.state.flowers}
        renderItem = {({item}) => (
          <ListItem
          title = {item.variety}
          subtitle = {item.complete ? 'Complete': 'Fail'}
          
          />
        )}
        keyExtractor = {item => item._id}
        />
      </List>
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
        //this.props.sendSMS(true);
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
  super(props);
  this.state =
  { selectedTime: 1,
    appState: AppState.currentState,
    inSession: false,
    accBuddyName: '',
    accBuddyNumber: '',
    sessionSuccess: false,
    sessionFailure: false,
    //get the following from the state in LoginScreen
    fbname: 'Facebook Name',
    fbid: 'dbid1',
    userid: 'randomid',
    fbpic: '',
  }
  };

  //Data passed thru navigator
  static navigationOptions = {
    title: 'Focus',
    header: null
  };

  //set inSession, sessionSuccess, sessioFailure to false
  _reset = () => {
    this.setState({inSession: false});
    this.setState({sessionSuccess: false});
    this.setState({sessionSuccess: false});
  }

  componentDidUpdate(){
  }

  //functions for internal App state
  componentDidMount() {
    //check what was passed in navigation
   console.log('component didMound -- we got this from navProps:');
   const stuff = {fbid, fbname, userid, fbpic} = this.props.navigation.state.params;
   
   //update state from stuff in LoginScreen
   this.setState({fbname: stuff.fbname, 
    fbid: stuff.fbid, 
    fbpic: stuff.fbpic,
    userid: stuff.userid,
  }, () => {
    console.log("State after getting stuff from login");
    console.log(this.state);
  });

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
    this.setState({sessionSuccess: false, inSession: true});
  }
  else{
    this.setState({inSession: false,});
    //end a current session and don't send feedback to user
  }
}

//function that ends a session currently in progress, 
//then sends session info to the server
//extend input params to include minutes focused in a session as well
_endSession = (success) => {
  
  this.setState({inSession: false},() => {
    let flowerVariety = 'Rose';
    let minutesFocused = 35;
    let sessionLength = 35;
    putFlower(success, 
      this.state.fbname, this.state.fbid,
      this.state.accBuddyName, this.state.accBuddyNumber,
      flowerVariety, Date.now(), 
      minutesFocused, sessionLength ,this.state.userid);
  });

  //change state to display message on the screen
  if (success){
    this.setState({sessionSuccess: true});
  }
  else {
    this.setState({sessionFailure: true});
  }
}


//Capture and save phone number associated with session
_onTextChange = (number) => {
  //console.log(task);
  this.setState({accBuddyNumber: number});
}
//After user has finished editing input, take final state
_onEndInput = () => {
  //save the accountability buddy's number
  console.log("Acc buddy phone number:")
  console.log(this.state.accBuddyNumber);
  this.setState({accBuddyName: 'Felix'}, () => {console.log('accBuddyName:' + this.state.accBuddyName);});
  //send entered number to server
  //this._sendPhoneNum(this.state.accBuddyNumber, 'Felix');
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

      <Image source={require('./flower1.gif')} style = {{height: 340, width: 400, resizeMode : 'stretch',}} />

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
// Tab Nav for homescreen
//----------------------------------------------------
const HomeScreen = TabNavigator(
  {
  Timer: {screen: TimerScreen},
  History: {screen: ProgressScreen},
  },{
    tabBarOptions : {
      style: {
        backgroundColor: '#613b83',
      }
    }

});

//----------------------------------------------------
// Stack Nav for login and home (could change later)
//----------------------------------------------------
const SimpleApp = StackNavigator({
  //list of screens in app
  Login: {screen: LoginScreen},
  Home: {screen: HomeScreen},
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
