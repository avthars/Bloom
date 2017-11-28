//require twilio module 
const twilio = require('twilio');


//define identifying account tokens
// taken from twilio account that was set-up
//account sid
const accountSid = 'AC40ca87d3e6fdbd696c8b8d64df59a1e0';
//auth token
const authToken = 'df6d2772765f6643a865a51ea66de470';

module.exports = new twilio.Twilio(accountSid, authToken); 