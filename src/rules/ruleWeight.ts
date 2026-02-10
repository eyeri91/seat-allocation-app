import type { AssignedPassengerMap } from "../types/seats.js";
import type { Row } from "../types/seats.js";
import { parseSeatNumber } from "../utils/utils.js";

export function getTotalWeightOfRow(
  assignedPassengerMap: AssignedPassengerMap,
  rows: Row[],
): Map<Row, number> {
  const rowWeight = new Map<Row, number>();
  for (const r of rows) rowWeight.set(r, 0);
  for (const [seat, assigned] of assignedPassengerMap.entries()) {
    const { row } = parseSeatNumber(seat);
    if (!rowWeight.has(row)) continue;

    rowWeight.set(row, (rowWeight.get(row) ?? 0) + assigned.passenger.weight);
  }
  return rowWeight;
}
