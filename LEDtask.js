

const config = require('./config.js');

const LEDdevice = require("./LEDdevice.js")

// var Gpio = require('onoff').Gpio,
//     LedPin = new Gpio(18, 'out');

var MyLED = new LEDdevice(config.MyLEDkeyPath,
        config.MyLEDcertPath,
        config.MyLEDcaPath,
        config.MyLEDclientId,
        config.MyLEDhost);


MyLED.connect(function(){
  // console.log("Done");

    MyLED.onSwitchOn(function(){
      // LedPin.writeSync(1);
      console.log("LED is on");
    })

    MyLED.onSwitchOff(function(){
      // LedPin.writeSync(0);
      console.log("LED is off");
        })
    });
