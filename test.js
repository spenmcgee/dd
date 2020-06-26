class X {
  constructor() {
    this.x = 55;
  }
  toString() {
    return JSON.stringify(this);
  }
}

var k = new X();
console.log(k)
console.log(`here ${k} is k`)
