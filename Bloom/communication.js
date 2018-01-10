//------------------------------------------------------------------------------
// communication.js
//
// functions to handle app-server communication
//------------------------------------------------------------------------------
import { Platform } from 'react-native';

var MSEC_IN_MIN = 60000.0;
/* var API_ROOT = Platform.OS === 'android'
? 'http://10.8.68.109:55555/v1/'
: 'http://localhost:55555/v1/'; */

//API Root for avthar's loalhost
//change when server is migrated to clouds
//shefali
// API_ROOT = 'http://10.8.68.109:55555/v1/'
API_ROOT = 'http://10.8.173.153:55555/v1/'

function checkStatus(res) {
  if (res.status >= 200 && res.status < 300) {
    return res;
  } else {
    let err = new Error(res.statusText);
    err.response = res;
    throw error;
  }
}

// sends flower info to the server to be added to the DB
// will also send notifiation to buddyNumber sent in request
export const putFlower =(complete, userName, fbid, buddyName, buddyNumber,variety, endTime, minutes, sessionLength, userID) => 
{
  var API = API_ROOT + "flowers";
  fetch(API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      complete: complete,
      userName: userName,
      fbid: fbid,
      buddyName: buddyName,
      buddyNumber: buddyNumber,
      variety: variety,
      endTime: endTime,
      minutes: minutes,
      sessionLength: sessionLength,
      userID: userID,
    })
  })
  .then((res) => res.json())
  .then((resJson) => {
    //console.log(resJson);
    console.log("Message back from server!");
    console.log(resJson.message);
  })
  .catch((err) => {
    console.error(err);
  });
}

// registers a user with the database
//not used, see registerUserAndGetUserId function in Login page
export const registerUser = (username) => {
  var API = API_ROOT + "users";

  fetch(API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: username,
    })
  })
  .then((res) => res.json())
  .then((resJson) => {
    return resJson.message;
  })
  .catch((err) => {
    console.error(err);
  });
}

// returns all flowers in JSON
export const getFlowers = () => {
  var API = API_ROOT + "flowers";

  fetch(API)
  .then((res) => res.json())
  .then((resJson) => {
    //console.log(resJson);
    console.log("received flowers!");
    return resJson.flowers
  })
  .catch((err) => {
    console.error(err);
  })
}
