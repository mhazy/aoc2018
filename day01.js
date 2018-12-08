const R = require("ramda");
const util = require("./util");

const stringToNumber = string => {
  return Number(string);
};

const formatInput = R.pipe(
  R.trim,
  R.split(/\s+/g),
  R.map(stringToNumber)
);

const processAnswerOne = R.reduce(R.add, 0);

const processAnswerTwo = inputs => {
  let frequencies = { 0: true };
  let frequency = 0;
  let i;
  while (true) {
    for (i = 0; i < inputs.length; i++) {
      frequency = frequency + inputs[i];
      if (frequencies.hasOwnProperty(frequency)) {
        return frequency;
      }
      frequencies[frequency] = true;
    }
  }
};

// First Answer
util
  .loadFile("./inputs/day01")
  .then(formatInput)
  .then(processAnswerOne)
  .then(answer => console.log(`Day 1, answer 1: ${answer}`))
  .catch(err => console.log("Day 1 Blew Up", err));

// Second Answer
util
  .loadFile("./inputs/day01")
  .then(formatInput)
  .then(processAnswerTwo)
  .then(answer => console.log(`Day 1, answer 2: ${answer}`));

module.exports = {
  stringToNumber,
  formatInput
};
