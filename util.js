const path = require("path");
const fs = require("fs");
const util = require("util");
const fsReadFile = util.promisify(fs.readFile);

const loadFile = filePath =>
  fsReadFile(path.resolve(path.join(__dirname, filePath)), "utf-8");

const filterWithKeys = (pred, obj) =>
  R.pipe(R.toPairs, R.filter(R.apply(pred)), R.fromPairs)(obj);

module.exports = {
  loadFile,
  filterWithKeys
};
