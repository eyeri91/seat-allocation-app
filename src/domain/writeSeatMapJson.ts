import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Passenger } from "../types/passenger.js";
import type { OutputRow } from "../types/seats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeSeatMapInOriginalStructure(data: Passenger[]) {
  const outputDir = path.join(__dirname, "../../output");
  const outputPath = path.join(outputDir, "finalSeatmap.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}

export function writeSeatMapJsonWithRowInfo(data: { rows: OutputRow[] }) {
  const outputDir = path.join(__dirname, "../../output");
  const outputPath = path.join(outputDir, "seatmapWithRow.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}
