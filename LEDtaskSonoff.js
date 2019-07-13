
const mqtt = require('mqtt')
const client = mqtt.connect('mqtt://192.168.1.101')

const config = require('./config.js');

const LEDdevice = require("./LEDdeviceSonoff.js")

client.on('connect', () => {
  // Inform controllers that garage is connected
  client.subscribe('stat/Buzdasonoff/POWER');
  console.log("subscribed to stat")
});

client.on('message', (topic, message) => {
  if(topic === 'stat/Buzdasonoff/POWER') {
    // console.log(message.toString());

    if(message.toString() === "ON"){
      MyLED.updateValues = 1;
      console.log("The Switch is on");
    }else if (message.toString() === "OFF"){
      MyLED.updateValues = 0;
      console.log("The Switch is off");
    }
  }
});

var MyLED = new LEDdevice(config.MyLEDkeyPath,
        config.MyLEDcertPath,
        config.MyLEDcaPath,
        config.MyLEDclientId,
        config.MyLEDhost);

MyLED.connect(function(){
  // console.log("Done");
   client.publish('cmnd/Buzdasonoff/backlog', 'power1');  // As soon as the RPi connects to AWSIoT it receives the stat mssg
                                                        // as a result of publishing this cmnd
  MyLED.onSwitchOn(function(){
    client.publish('cmnd/Buzdasonoff/POWER', 'ON');
    console.log("LED is on");
  })

  MyLED.onSwitchOff(function(){
    client.publish('cmnd/Buzdasonoff/POWER', 'OFF');
    console.log("LED is off");
      })
    });
