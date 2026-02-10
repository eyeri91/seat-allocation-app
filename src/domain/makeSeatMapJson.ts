import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import type { OutputRow } from "../types/seats.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function writeSeatMapJson(data: { rows: OutputRow[] }) {
  const outputDir = path.join(__dirname, "../output");
  const outputPath = path.join(outputDir, "finalSeatMap.json");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
}
