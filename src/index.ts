// src/index.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { groupsWithWCHR, sortedGroupByWCHRNumbers } from "./rules/ruleWCHR.js";
import { buildPassengersMapById } from "./domain/passenger.utils.js";
import type { Passenger } from "./types/passenger.js";
import {
  createAssignedPassengerMap,
  tryAssignSeatToPassenger,
} from "./domain/seatmap.utils.js";
import { passengersWithFlags } from "./output/passengersWithFlags.js";
import { getWCHRIdsInGroup } from "./domain/special.utils.js";
import { generateAllAisleSeatNumbers } from "./domain/seats.utils.js";
import type { Seat, SeatNumber } from "./types/seats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const passengers = JSON.parse(raw) as Passenger[];

const passengersByIds = buildPassengersMapById(passengersWithFlags);
const allAisleSeats: SeatNumber[] = generateAllAisleSeatNumbers();

let done = false;
const assignedPassengerMap = createAssignedPassengerMap();
for (const group of sortedGroupByWCHRNumbers) {
  if (done) break;
  const IdsOfWCHR = getWCHRIdsInGroup(group, passengersByIds);
  if (IdsOfWCHR.length === 0) continue;

  for (const idOfWCHR of IdsOfWCHR) {
    const passenger = passengersByIds.get(idOfWCHR);
    if (!passenger) continue;

    const seatNumber = allAisleSeats[0] as SeatNumber;
    const seatNumber2 = allAisleSeats[1] as SeatNumber;

    const result = tryAssignSeatToPassenger(
      seatNumber,
      passenger,
      group.id,
      assignedPassengerMap,
    );

    console.log(result);
    console.log(assignedPassengerMap.get(seatNumber2));
    done = true;
    break;
  }
}
