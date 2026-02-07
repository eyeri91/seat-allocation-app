// src/index.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { groupsWithWCHR, sortedGroupByWCHRNumbers } from "./rules/ruleWCHR.js";
// import { buildPassengersMapById } from "./domain/passenger.js";
import type { Passenger } from "./types/passenger.js";
// import { passengersWithFlags } from "./output/passengersWithFlags.js";
// import { error } from "node:console";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const passengers = JSON.parse(raw) as Passenger[];

console.log(sortedGroupByWCHRNumbers);
// const passengersByIds = buildPassengersMapById(passengersWithFlags);
// const firstGroup = sortedGroupByWCHRNumbers[0];
// if (!firstGroup) {
//   throw error;
// } else {
//   const membersIds = firstGroup.membersIds;
//   let count = 0;
//   for (const id of membersIds) {
//     const pas = passengersByIds.get(id);

//     if (pas?.isWCHR) count += 1;
//   }

//   console.log(count);
// }
