
const config = require('./config.js');

const TempSensordevice = require("./TempSensordevice2.js")


var TempSensor = new TempSensordevice(config.TempSensorkeyPath,
        config.TempSensorcertPath,
        config.TempSensorcaPath,
        config.TempSensorclientId,
        config.TempSensorhost);


TempSensor.connect(function(){
  // console.log("Done");

      TempSensor.processEnoceanTemp(function(){
        console.log("temperature processed");
      });
  });

//TempSensor.TempChange(function(){
  // console.log("temp change");
//});
