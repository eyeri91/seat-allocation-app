import {
  type AisleSeatCode,
  type AssignedPassengerMap,
  type SeatMap,
  type SeatNumber,
  AISLE_SEAT_CODES,
  ROW,
  type Row,
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

export function generateABJKSeats(rows: readonly Row[]): SeatNumber[] {
  const seatNumbers: SeatNumber[] = [];
  const code = ["A", "B", "J", "K"] as const;

  for (const row of rows) {
    for (const c of code) {
      seatNumbers.push(`${row}${c}` as SeatNumber);
    }
  }
  return seatNumbers;
}

export function isPassengerAssigned(
  paxId: string,
  assignedPassengerMap: AssignedPassengerMap,
): boolean {
  for (const assigned of assignedPassengerMap.values()) {
    if (assigned.passenger.id === paxId) return true;
  }
  return false;
}

export function getSeatsWithEmptyNeighbor(
  emptySeats: SeatNumber[],
  assignedPassengerMap: AssignedPassengerMap,
): SeatNumber | undefined {
  return emptySeats.find((seat) => {
    const leftSeat = getLeftSeatNumber(seat);
    const rightSeat = getRightSeatNumber(seat);

    const leftEmpty = leftSeat && !assignedPassengerMap.has(leftSeat);
    const rightEmpty = rightSeat && !assignedPassengerMap.has(rightSeat);

    return Boolean(leftEmpty || rightEmpty);
  });
}
