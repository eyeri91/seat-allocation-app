import {
  type AisleSeatCode,
  type Row,
  type Seat,
  type SeatCode,
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
  const seatNumber = [...seats];

  return seatNumber;
}

// export function createEmptySeatMap(): SeatMap {
//   return seatMap;
// }
