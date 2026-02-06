import fs from 'fs'

const data = JSON.parse(
  fs.readFileSync("./data/dataset.json", "utf-8")
);

console.log(data.length);