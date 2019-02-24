'use strict';

const Thing = require("./thing.js")

module.exports = class Led extends Thing{
  constructor(keyPath,certPath,caPath,clientId, host){
    super("LED", keyPath,certPath,caPath,clientId, host)
  }

  get active(){
    return this.state.active || 0;
  }

  onSwitchOn(callback){
    this.onChange(function(state){
      if(state.active == 1){
        callback();
      }
    })
  }

  onSwitchOff(callback){
    this.onChange(function(state){
      if(state.active == 0){
        callback();
      }
    })
  }

}