'use strict';

const SerialPort = require('serialport')
const port = new SerialPort('/dev/ttyUSB0', {
  baudRate: 57600
})

const Thing = require("./thing.js")

module.exports = class TempSensor extends Thing{
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


  processEnoceanTemp(callback){

var appData = '';   // to store the raw data
var tempValue= 25;
var stream = '';
var sync = '';

let self = this;

port.on('data', function (data) {
  // console.log('Data:', data)
  callback();  // ideally should be put at the bottom line
  appData = appData + data.toString('hex');// change data to string and then store
  stream = appData.substr(0,48);// cut data so we can process only one telegram
  //console.log('Data:', stream)

  sync = stream[0] + stream[1];
  // console.log('Data:', stream.length);
  if(stream.length == 48 && sync == '55'){
    console.log('4BS Data:', stream);
    //console.log(stream.length);
    var tempByte = stream[18] + stream[19];
    //console.log("tempByte: " + tempByte);
    var tempByteInDec= Number('0x' + tempByte);
    //console.log(tempByteInDec);
    var multiplier = 40/255;
    tempValue = multiplier*(255-tempByteInDec);
    console.log(tempValue);

    self.updateValues = tempValue;

    setTimeout(function(){

     appData = '';
     sync = '';
     }, 50);
    }
  });
}
}
