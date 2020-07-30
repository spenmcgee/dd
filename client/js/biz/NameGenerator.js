var adjectives = [
  "adult",
  "dirty",
  "erotic",
  "fleshy",
  "moist",
  "immoral",
  "nude",
  "romantic",
  "sensual",
  "sexual",
  "tshirtless",
  "hot",
  "horny",
  "hard",
  "honorable"
];

var nouns = [
  "mcsexface",
  "sexer",
  "boner",
  "giz",
  "lace gloves",
  "candles",
  "dinner",
  "face",
  "panties",
  "edible underwear",
  "marriage"
];

class NameGenerator {

  static generate() {
    var r1 = Math.floor(Math.random() * adjectives.length);
    var r2 = Math.floor(Math.random() * nouns.length);
    var name = `${adjectives[r1]} ${nouns[r2]}`;
    return name;
  }
}

export { NameGenerator }
