//------------------------------------------------------------------------------
// communication.js
//
// functions to handle app-server communication
//------------------------------------------------------------------------------

import { Platform } from 'react-native';

// adds a flower to the database
export const putFlower = (variety, complete, fromUser, toUser) => {
  var API = Platform.OS === 'android'
  ? 'http://10.9.9.30:55555/v1/flowers'
  : 'http://localhost:55555/v1/flowers';

   //temp overwrite for Avthar's computer
   API = 'http://10.8.173.153:55555/v1/flowers'

  fetch(API, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      variety: variety,
      complete: complete,
      from: fromUser,
      to: toUser,
    })
  })
  .then((res) => res.json())
  .catch((err) => {
    console.error(err);
  });
}

// registers a user with the database
export const registerUser = (username) => {
  var API = Platform.OS === 'android'
  ? 'http://10.9.9.30:55555/v1/users'
  : 'http://localhost:55555/v1/users';

  //temp overwrite for Avthar's computer
  API = 'http://10.8.173.153:55555/v1/flowers'
  
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
  .catch((err) => {
    console.error(err);
  });
}

// returns all flowers in JSON
export const getFlowers = () => {
  var API = Platform.OS === 'android'
  ? 'http://10.9.9.30:55555/v1/flowers'
  : 'http://localhost:55555/v1/flowers';

  //temp overwrite for Avthar's computer
  API = 'http://10.8.173.153:55555/v1/flowers'

  fetch(API)
  .then(function(res) {
    return res.json()
  })
  .catch((err) => {
    console.error(err);
  })
}
