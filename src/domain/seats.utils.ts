import {
  type AisleSeatCode,
  type SeatMap,
  type SeatNumber,
  AISLE_SEAT_CODES,
  ROW,
  SEATCODE,
} from "../types/seats.js";

import {
  getLeftSeatNumber,
  getRightSeatNumber,
  parseSeatNumber,
} from "../utils/utils.js";

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
