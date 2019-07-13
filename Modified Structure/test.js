var moment = require("moment");
var _ = require("lodash");

// var dateOfToday = moment().format("YYYY-MM-DD");
// console.log(dateOfToday);
// console.log("2019-05-10")

var dateOfToday = moment().format("YYYY-MM-DD");

var nowlll = moment(new Date()).format('HH:mm');
var endlll = moment(new Date(endlll)).format('HH:mm');

console.log(nowlll);
console.log(endlll);

//
// var list = ["foo", "bar"];
// var data = list;
// var obj = "baz";
// data.push({obj});
//
// console.log(data);
//
// var number = 14;
// console.log(_.inRange(number, 1, 10));
