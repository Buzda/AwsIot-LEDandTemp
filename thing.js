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
            self.thingShadows.get(self.thingName);
            console.log("a thing was registered");
            callback(null)
        });
    });

    this.thingShadows.on('status', function(thingName, stat, clientToken, stateObject) {
      // console.log('debug', 'received '+stat+' on '+thingName, stateObject);
      if(stateObject.state != undefined){ // this condition to prevent having the err of state.reported undefined
                                        // when the shadow's created by the script not the platform
      self.state = Object.assign(self.state, stateObject.state.reported);
    //  console.log("stateObj in status",stateObject.state);
    }
    });

    this.thingShadows.on('delta', function(thingName, stateObject) {
      // console.log('debug', 'received delta on '+thingName, stateObject);
      self.state = Object.assign(self.state, stateObject.state);
    //  console.log("stateObj in delta",stateObject.state);
      // console.log( "stateboject.state is ",stateObject.state);
      self.ack();  // this is done to indicate that an actioned was done and the desired state is reached now
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
    console.log("delta detected");
    callback(stateObject.state)
  });
 }
}
