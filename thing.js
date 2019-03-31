'use strict';

const awsIot = require('aws-iot-device-sdk');

module.exports = class Thing{

  constructor(thingName, keyPath,certPath,caPath,clientId, host){
    this.thingName = thingName;
    this.keyPath = keyPath;
    this.certPath = certPath;
    this.caPath = caPath;
    this.clientId=clientId;
    this.host = host;

    this.state = {}
  }

  connect(callback){
    this.thingShadows = awsIot.thingShadow({
      keyPath: this.keyPath,
      certPath: this.certPath,
      caPath: this.caPath,
      clientId: this.thingName,
      host: this.host
    });
    let self = this;

    this.thingShadows.on('connect', function() {
        self.thingShadows.register(self.thingName, {}, function() {
      //    console.log(this);
        self.thingShadows.get(self.thingName);  // do this at the start to fetch any change that might have happend
                                                // when device switched off
        console.log("a thing was registered");
            callback(null)
        });
    });

    this.thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
      // console.log('debug', 'received '+stat+' on '+thingName, stateObject);
      // console.log(stateObject.state);
      if(stateObject.state != undefined){ // this condition to prevent having the err of state.reported undefined
                                        // when the shadow's created by the script not the platform
      self.state = Object.assign(self.state, stateObject.state.reported);
    //  console.log("stateObj in status",stateObject.state);
     // console.log(stateObject.state.desired);
     }
    });

    this.thingShadows.on('delta', function(thingName, stateObject) {
      // console.log('debug', 'received delta on '+thingName, stateObject);
      self.state = Object.assign(self.state, stateObject.state);
      // console.log(stateObject.state);
    //  console.log("stateObj in delta",stateObject.state);
      // console.log( "stateboject.state is ",stateObject.state);
      self.ack();  // this is done to indicate that an actioned was done and the desired state is reached now
      // console.log(stateObject.state);
    });
  }

  update(data){
    var self = this;
    this.thingShadows.update(this.thingName, {
      "state":{
        "reported": data
      }
    });
  }

  ack(){
  var self = this;
  this.thingShadows.update(this.thingName, {
    "state":{
      "desired": null,
      "reported": self.state
    }
  });
}

  onChange(callback){
  let self = this;

  this.thingShadows.on('delta', function(thingName, stateObject) {
    // console.log("delta detected");
    callback(stateObject.state);   // this renders the state that contains only the delta part which's equal to desired
  });

    // the following addition is used with the get() at the start to check
    // if there's a delta when the device was off
  this.thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
    if(stateObject.state.delta != undefined){  // if delta is defined then there was a change
       // console.log(stateObject.state);
       self.state = Object.assign(self.state, stateObject.state.desired); // copy the delta/desired to state vatiable
       self.ack();
      callback(stateObject.state.delta); // we render the delta parts as state variable here contains
                                        // the three parts opposed to only delta part in .on(delta) function
    }
  });
 }
}
