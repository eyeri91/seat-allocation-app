import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { makeGroup } from "./domain/groups.js";
import type { Passenger } from "./types/passenger.js";
import { addSpecialFlags } from "./domain/special-category.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../data/dataset.json");
const groupsOutputPath = path.join(__dirname, "./output/groups.ts");
const passengersWithFlagsOutputPath = path.join(
  __dirname,
  "./output/passengersWithFlags.ts",
);

const raw = fs.readFileSync(inputPath, "utf-8");
const passengers: Passenger[] = JSON.parse(raw);

const passengersWithFlags = addSpecialFlags(passengers);
const groups = makeGroup(passengersWithFlags);

const sortedGroupData = `
import type { Group } from "../types/groups.js";

export const groups: Group[] = ${JSON.stringify(groups, null, 2)};
`;

const passengersWithFlagsData = `
import type { PassengerWithFlags } from "../types/special.js";

export const passengersWithFlags: PassengerWithFlags[] = ${JSON.stringify(passengersWithFlags, null, 2)};
`;

const prevGroup = fs.existsSync(groupsOutputPath)
  ? fs.readFileSync(groupsOutputPath, "utf-8")
  : "";

if (prevGroup !== sortedGroupData) {
  fs.writeFileSync(groupsOutputPath, sortedGroupData);
} else {
  console.log("Sorted group.ts unchanged");
}

const prevSpecial = fs.existsSync(passengersWithFlagsOutputPath)
  ? fs.readFileSync(passengersWithFlagsOutputPath, "utf-8")
  : "";

if (prevSpecial !== passengersWithFlagsData) {
  fs.writeFileSync(passengersWithFlagsOutputPath, passengersWithFlagsData);
} else {
  console.log("Sorted passengersWithFlags.ts unchanged");
}
