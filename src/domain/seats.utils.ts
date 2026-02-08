import {
  type AisleSeatCode,
  type AssignedPassengerMap,
  type SeatMap,
  type SeatNumber,
  type NeighboringSeatInfo,
  AISLE_SEAT_CODES,
  ROW,
  SEATCODE,
} from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";

import {
  getLeftSeatNumber,
  getRightSeatNumber,
  parseSeatNumber,
} from "../utils/utils.js";
import { getAssignedPassenger } from "./seatmap.utils.js";

export function isAisle(seatNumber: SeatNumber): boolean {
  const { row, code } = parseSeatNumber(seatNumber);
  return AISLE_SEAT_CODES.includes(code as AisleSeatCode);
}

export function generateAllSeatNumbers(): SeatNumber[] {
  const seats: SeatNumber[] = [];
  for (const r of ROW) {
    for (const code of SEATCODE) {
      let seatNumber = `${r}${code}`;
      seats.push(seatNumber as SeatNumber);
    }
  }
  const seatNumbers = [...seats];

  return seatNumbers;
}

export const allAisleSeats: SeatNumber[] = generateAllAisleSeatNumbers();

export function createEmptySeatMap(seatNumbers: SeatNumber[]): SeatMap {
  const seatMap: SeatMap = new Map();
  for (const seat of seatNumbers) {
    seatMap.set(seat, null);
  }
  return seatMap;
}

export function generateAllAisleSeatNumbers(): SeatNumber[] {
  const results: SeatNumber[] = [];

  for (const r of ROW) {
    for (const code of AISLE_SEAT_CODES) {
      results.push(`${r}${code}` as SeatNumber);
    }
  }

  return results;
}

export function getAllEmptySeatNumbers(
  seatNumbers: SeatNumber[],
  assignedPassengerMap: AssignedPassengerMap,
): SeatNumber[] {
  const results: SeatNumber[] = [];
  for (const s of seatNumbers) {
    if (!assignedPassengerMap.has(s)) results.push(s);
  }
  return results;
}

export function getEligibleSeatsForSpecial(
  emptySeats: SeatNumber[],
  assignedPassengerMap: AssignedPassengerMap,
  isEligible: (
    seatNumber: SeatNumber,
    neighbors: NeighboringSeatInfo,
  ) => boolean,
): SeatNumber[] {
  const eligibleSeats: SeatNumber[] = [];

  for (const seat of emptySeats) {
    const leftSeat = getLeftSeatNumber(seat);
    const rightSeat = getRightSeatNumber(seat);

    const leftAssigned = leftSeat
      ? getAssignedPassenger(leftSeat, assignedPassengerMap)
      : null;
    const rightAssigned = leftSeat
      ? getAssignedPassenger(leftSeat, assignedPassengerMap)
      : null;

    const leftPassenger = leftAssigned ? leftAssigned.passenger : null;
    const rightPassenger = rightAssigned ? rightAssigned.passenger : null;

    if (
      isEligible(seat, { leftSeat, rightSeat, leftPassenger, rightPassenger })
    ) {
      eligibleSeats.push(seat);
    }
  }
  return eligibleSeats;
}
