import type { AssignedPassengerMap } from "../types/seats.js";
import type { Row } from "../types/seats.js";
import { parseSeatNumber } from "../utils/utils.js";

export const frontRows: Row[] = [1, 2, 3, 4, 5];
export const rearRows: Row[] = [6, 7, 8, 9, 10];

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

export function sumRows(rowWeight: Map<Row, number>, rows: Row[]) {
  return rows.reduce(
    (initial, rowNumber) => initial + (rowWeight.get(rowNumber) ?? 0),
    0,
  );
}
