const random = require('random');

function generator(dieSize) {
  var gen = random.normal(dieSize*2/3, dieSize/3);
  return x => {
    var r = gen();
    var x = r;
    if (r < 1) r = 1;
    if (r > dieSize) r = dieSize;
    console.log(x, Math.ceil(r))
    return Math.ceil(r);
  }
}

var gen = generator(6);

var numbers = [];
for (var i=0; i<100; i++) {
  var r = gen();
  //console.log(r)
  numbers.push(r);
}

//var avg = numbers.reduce((av,n) => {  }, 0);
var sum = 0;
for (var i=0; i<numbers.length; i++) {
  sum += numbers[i];
}
console.log("DONE", sum, sum/numbers.length)
