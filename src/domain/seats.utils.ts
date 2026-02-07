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

export function generateAllAisleSeatNumbers(): SeatNumber[] {
  const results: SeatNumber[] = [];

  for (const r of ROW) {
    for (const code of AISLE_SEAT_CODES) {
      results.push(`${r}${code}` as SeatNumber);
    }
  }

  return results;
}
