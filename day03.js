const R = require("ramda");
const util = require("./util");

const claimPattern = /^#(\d+)\s@\s(\d+),(\d+): (\d+)x(\d+)/;

const formatInput = R.pipe(
  R.split(/\n+/g),
  R.map(
    R.pipe(
      R.match(claimPattern),
      ([_, id, x, y, width, height]) => ({
        id,
        x: Number(x),
        y: Number(y),
        width: Number(width),
        height: Number(height)
      })
    )
  )
);

const overlapsFromClaims = claims => {
  let overlaps = {};
  for (i = 0; i < claims.length; i++) {
    let { x, y, width, height } = claims[i];
    let maxX = x + width;
    let maxY = y + height;
    while (y < maxY) {
      x = claims[i].x;
      while (x < maxX) {
        const key = `${x},${y}`;
        if (overlaps[key] === undefined) {
          overlaps[key] = 0;
        }
        overlaps[key] = overlaps[key] + 1;
        x = x + 1;
      }
      y = y + 1;
    }
  }

  return overlaps;
};

const claimHasNoOverlap = (overlaps, claim) => {
  let { x, y, width, height } = claim;
  let maxX = x + width;
  let maxY = y + height;
  while (y < maxY) {
    x = claim.x;
    while (x < maxX) {
      const key = `${x},${y}`;
      if (overlaps[key] > 1) {
        return false;
      }
      x = x + 1;
    }
    y = y + 1;
  }
  return true;
};

const solvePartOne = claims => {
  const overlaps = overlapsFromClaims(claims);
  return Object.values(overlaps).reduce((acc, val) => {
    return acc + (val >= 2 ? 1 : 0);
  }, 0);
};

const solvePartTwo = claims => {
  const overlaps = overlapsFromClaims(claims);
  let i = 0;
  while (i < claims.length) {
    if (claimHasNoOverlap(overlaps, claims[i])) {
      return claims[i].id;
    }
    i = i + 1;
  }
  return "Failed to find non-overlapping claim";
};

util
  .loadFile("./inputs/day03")
  .then(formatInput)
  .then(solvePartOne)
  .then(answer => console.log(`Day 3, answer 1: ${answer}`));

util
  .loadFile("./inputs/day03")
  .then(formatInput)
  .then(solvePartTwo)
  .then(answer => console.log(`Day 3, answer 2: ${answer}`));

// This is kinda quick and dirty, will come back and do a scan line version
