import {
  type AisleSeatCode,
  type Seat,
  type SeatMap,
  type SeatNumber,
  type AssignedPassenger,
  type AssignedPassengerMap,
  AISLE_SEAT_CODES,
  ROW,
  SEATCODE,
} from "../types/seats.js";

import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";

export function isAisle(seat: Seat): boolean {
  return AISLE_SEAT_CODES.includes(seat.code as AisleSeatCode);
}

export function isEmpty(
  seatNumber: SeatNumber,
  assignedPassengerMap: AssignedPassengerMap,
): boolean {
  return !assignedPassengerMap.has(seatNumber);
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

export function createEmptySeatMap(seatNumbers: SeatNumber[]): SeatMap {
  const seatMap: SeatMap = new Map();
  for (const seat of seatNumbers) {
    seatMap.set(seat, null);
  }
  return seatMap;
}

export function getAssignedPassenger(
  seatNumber: SeatNumber,
  assignedPassengerMap: AssignedPassengerMap,
): AssignedPassenger {
  const assignedPassenger = assignedPassengerMap.get(seatNumber);
  if (!assignedPassenger) {
    throw new Error(`No passenger assigned to seat ${seatNumber}`);
  }
  return assignedPassenger;
}
