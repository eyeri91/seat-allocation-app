// src/index.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { groupsWithWCHR, sortedGroupByWCHRNumbers } from "./rules/ruleWCHR.js";
import { buildPassengersMapById } from "./domain/passenger.utils.js";
import type { Passenger } from "./types/passenger.js";
import { createAssignedPassengerMap } from "./domain/seatmap.utils.js";
import { passengersWithFlags } from "./output/passengersWithFlags.js";
import { getWCHRIdsInGroup } from "./domain/special.utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const passengers = JSON.parse(raw) as Passenger[];

const passengersByIds = buildPassengersMapById(passengersWithFlags);

const assignedPassengerMap = createAssignedPassengerMap();
for (const group of sortedGroupByWCHRNumbers) {
  // get WCHR ids from each group
  //   tryAssignSeatToPassenger
}
