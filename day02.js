const R = require("ramda");
const util = require("./util");

const formatInput = R.split(/\s+/g);

const splitAndFilterGroups = R.pipe(
  R.split(""),
  R.sort((a, b) => (a < b ? -1 : 1)),
  R.join(""),
  R.match(/(.)\1*/g),
  R.filter(str => str.length >= 2),
  R.map(R.length),
  R.uniq
);

const processAnswerOne = inputs => {
  let twos = 0;
  let threes = 0;
  let i;

  for (i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const groups = splitAndFilterGroups(input);
    if (groups.includes(2)) {
      twos = twos + 1;
    }
    if (groups.includes(3)) {
      threes = threes + 1;
    }
  }

  return R.multiply(twos, threes);
};

const difference = (stringOne, stringTwo) => {
  const valOne = R.split("", stringOne);
  const valTwo = R.split("", stringTwo);

  let i = Math.max(valOne.length, valTwo.length);
  let diff = 0;
  while (i > 0) {
    i = i - 1;
    if (valOne[i] !== valTwo[i]) {
      diff = diff + 1;
    }
  }

  return diff;
};

const sameChars = (stringOne, stringTwo) => {
  const valOne = R.split("", stringOne);
  const valTwo = R.split("", stringTwo);

  let i = Math.max(valOne.length, valTwo.length);
  let same = "";
  while (i > 0) {
    i = i - 1;
    if (valOne[i] === valTwo[i]) {
      same = valOne[i] + same;
    }
  }

  return same;
};

const processAnswerTwo = inputs => {
  let i, j;

  for (i = 0; i < inputs.length; i++) {
    for (j = inputs.length - 1; j > i; j--) {
      const diff = difference(inputs[i], inputs[j]);
      if (diff === 1) {
        return sameChars(inputs[i], inputs[j]);
      }
    }
  }
  return false;
};

util
  .loadFile("./inputs/day02")
  .then(formatInput)
  .then(processAnswerOne)
  .then(answer => console.log(`Day 2, answer 1: ${answer}`));

util
  .loadFile("./inputs/day02")
  .then(formatInput)
  .then(processAnswerTwo)
  .then(answer => console.log(`Day 2, answer 2: ${answer}`));
