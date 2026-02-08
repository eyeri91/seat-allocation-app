// getLeftSeatNumber
import { SEATCODE } from "../types/seats.js";
import type { Row, SeatCode, SeatNumber } from "../types/seats.js";

const seatCode = SEATCODE;

export function parseSeatNumber(seatNumber: SeatNumber) {
  const code = seatNumber.slice(-1) as SeatCode;
  const rowStr = seatNumber.slice(0, -1);
  const row = Number(rowStr);

  return { row, code };
}

export function getLeftSeatNumber(seatNumber: SeatNumber): SeatNumber | null {
  const { row, code } = parseSeatNumber(seatNumber);
  const index = seatCode.indexOf(code);
  if (index <= 0) return null;

  const leftCode = seatCode[index - 1];

  return `${row}${leftCode}` as SeatNumber;
}

export function getRightSeatNumber(seatNumber: SeatNumber): SeatNumber | null {
  const { row, code } = parseSeatNumber(seatNumber);
  const kiloSeat = seatCode.length - 1;
  const index = seatCode.indexOf(code);
  if (index === -1 || index >= kiloSeat) return null;

  const rightCode = seatCode[index + 1];

  return `${row}${rightCode}` as SeatNumber;
}

//
