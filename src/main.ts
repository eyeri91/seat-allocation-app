import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { makeGroup} from "./domain/groups.js"
import type { Passenger } from "./types/passenger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, "../data/dataset.json");

const outputPath = path.join(__dirname, "./output/groups.ts");

const raw = fs.readFileSync(inputPath, "utf-8");
const passengers: Passenger[] = JSON.parse(raw);

const groups = makeGroup(passengers);

const sortedData = `
import type { Group } from "../types/groups.js";

export const groups: Group[] = ${JSON.stringify(groups, null, 2)};
`;

const prev = fs.existsSync(outputPath)
    ? fs.readFileSync(outputPath, "utf-8")
    : "";

if (prev !== sortedData) {
    fs.writeFileSync(outputPath, sortedData)
} else {
    console.log("Sorted group.ts unchanged")
}
