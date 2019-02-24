
const bluetooth = require('node-bluetooth');

// create bluetooth device instance
const device = new bluetooth.DeviceINQ();

device.listPairedDevices(console.log);

const config = require('./config.js');

const LEDdevice = require("./LEDdevice.js")

var Gpio = require('onoff').Gpio,
    LedPin = new Gpio(18, 'out');

var MyLED = new LEDdevice(config.MyLEDkeyPath,
        config.MyLEDcertPath,
        config.MyLEDcaPath,
        config.MyLEDclientId,
        config.MyLEDhost);


MyLED.connect(function(){
  // console.log("Done");

  bluetooth.connect('00:18:E5:03:67:DA', '1', function(err, connection){
  
    MyLED.onSwitchOn(function(){
      LedPin.writeSync(1);
      connection.write(new Buffer('1', 'utf-8'), () => {
        console.log("wrote");
      });
      console.log("LED is on");
    })

    MyLED.onSwitchOff(function(){
      LedPin.writeSync(0);
      connection.write(new Buffer('0', 'utf-8'), () => {
        console.log("wrote");
      });
      console.log("LED is off");
        })
     });
    });
