// src/index.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Passenger } from "./types/passenger.js";
import { run } from "./app/run.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const passengers = JSON.parse(raw) as Passenger[];

run();
