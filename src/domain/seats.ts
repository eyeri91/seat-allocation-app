import {
  type AisleSeatCode,
  type Seat,
  type SeatMap,
  type SeatNumber,
  AISLE_SEAT_CODES,
  ROW,
  SEATCODE,
} from "../types/seats.js";

export function isAisleSeat(seat: Seat): Boolean {
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
