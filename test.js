var i;

var print = function (){

  console.log(i);
}

for(i=0;i<10;i++){

(function(valueOfi){
      // or (var valueOfi=i;) instead of rendering i, valueOfi to the functions
  setTimeout(function (){
    console.log(valueOfi);
   },1000);
 })(i);
}
