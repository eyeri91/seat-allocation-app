// getLeftSeatNumber
import { SEATCODE } from "../types/seats.js";
import { ROW } from "../types/seats.js";
import type { Row, SeatCode, SeatNumber } from "../types/seats.js";

const seatCode = SEATCODE;

export function parseSeatNumber(seatNumber: SeatNumber): {
  row: Row;
  code: SeatCode;
} {
  const code = seatNumber.slice(-1) as SeatCode;
  const rowStr = seatNumber.slice(0, -1);
  const rowNum = Number(rowStr);
  if (!ROW.includes(rowNum as Row)) {
    throw new Error(`Invalid seat row: ${seatNumber}`);
  }

  return {
    row: rowNum as Row,
    code,
  };
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
