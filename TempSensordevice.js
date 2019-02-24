'use strict';

const Thing = require("./thing.js")

module.exports = class Led extends Thing{
  constructor(keyPath,certPath,caPath,clientId, host){
    super("TempSensor", keyPath,certPath,caPath,clientId, host)
  }


set updateValues(value){
  this.update({
    "temperature": value
  })
}

get temperature(){
  return this.state.temperature || 0;
 }
}
