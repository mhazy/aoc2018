const R = require("ramda");

const util = require("./util");

const isFlippedEquivalent = (a, b) => {
  // Lower cased equivalent is the same, but they're un-equal
  return a.toLowerCase() === b.toLowerCase() && a !== b;
};

const collapseString = inputStr => {
  let cursor = 0,
    collapsedStr = inputStr.trim();
  while (collapsedStr[cursor + 1] !== undefined) {
    if (isFlippedEquivalent(collapsedStr[cursor], collapsedStr[cursor + 1])) {
      collapsedStr =
        collapsedStr.slice(0, cursor) +
        collapsedStr.slice(cursor + 2, collapsedStr.length);
      cursor = Math.max(0, cursor - 1);
    } else {
      cursor = cursor + 1;
    }
  }
  return collapsedStr;
};

const solvePartOne = input => {
  return collapseString(input).length;
};

const solvePartTwo = input => {
  const collapsedInput = collapseString(input);

  return R.pipe(
    R.map(val => {
      const letter = String.fromCharCode(val + 97);
      const pattern = new RegExp(letter, "gi");
      const cleanedInput = collapsedInput.replace(pattern, "");
      const reCollapsed = collapseString(cleanedInput);
      return {
        letter,
        length: reCollapsed.length
      };
    }),
    R.sortBy(R.prop("length")),
    R.head,
    R.prop("length")
  )(R.range(0, 26));
};

util.loadFile("./inputs/day05").then(input => {
  const answerOne = solvePartOne(input);
  const answerTwo = solvePartTwo(input);
  console.log(`Day 5, part one: ${answerOne}`);
  console.log(`Day 5, part two: ${answerTwo}`);
});
