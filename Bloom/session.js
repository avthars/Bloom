//***********************************************************/
// Session object
//***********************************************************/
function Session(date, result, time, buddy){
    this.date = date;
    this.result = result;
    this.time = time;
    this.buddy = buddy;
} 
//getters for each property 
Session.prototype.getDate = () => {return this.date;}
Session.prototype.getResult = () => {return this.result;}
Session.prototype.getTime = () => {return this.time;}
Session.prototype.getBuddy = () => {return this.buddy;}

