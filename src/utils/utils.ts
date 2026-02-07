// getLeftSeatNumber
import { SEATCODE } from "../types/seats.js";
import type { Seat, SeatNumber } from "../types/seats.js";

const seatCode = SEATCODE;

export function getLeftSeatNumber(seat: Seat): SeatNumber | null {
  const index = seatCode.indexOf(seat.code);
  if (index <= 0) return null;

  const leftCode = seatCode[index - 1];

  return `${seat.row}${leftCode}` as SeatNumber;
}

export function getRightSeatNumber(seat: Seat): SeatNumber | null {
  const kiloSeat = seatCode.length - 1;
  const index = seatCode.indexOf(seat.code);
  if (index === -1 || index >= kiloSeat) return null;

  const rightCode = seatCode[index + 1];

  return `${seat.row}${rightCode}` as SeatNumber;
}
