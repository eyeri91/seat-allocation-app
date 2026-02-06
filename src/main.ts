import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { makeGroup} from "./domain/groups.js"
import type { Passenger } from "./types/passenger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(jsonPath, "utf-8");

const passengers: Passenger[] = JSON.parse(raw);

const groups = makeGroup(passengers);

const output = `
import { Group } from "../types.js";

export const groups: Group[] = ${JSON.stringify(groups, null, 2)};
`;

const outPath = path.join(__dirname, "./output/groups.ts");
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, output.trim());
