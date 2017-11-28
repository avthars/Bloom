//define identifying account tokens
// taken from twilio account that was set-up
//account sid
console.log('inside the Node.js file');
const accountSid = 'AC40ca87d3e6fdbd696c8b8d64df59a1e0';
//auth token
const authToken = 'df6d2772765f6643a865a51ea66de470';

//create Twilio rest client
const client = require('twilio')(accountSid, authToken);

console.log('created all the constants');

client.messages.create({
    to: '+16093563125',
    from: '+17325888245',
    body: 'Bloom: Test message'
})
.then((message) => console.log(message.sid));

console.log('made it to the end');