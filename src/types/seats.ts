import type { Group } from "./groups.js";
import type { PassengerWithFlags } from "./special.js";

export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export const ROW: Row[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export type SeatCode =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "G"
  | "H"
  | "J"
  | "K";

export const SEATCODE: SeatCode[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
];

export type AisleSeatCode = "C" | "D" | "G" | "H";

export const AISLE_SEAT_CODES: AisleSeatCode[] = ["C", "D", "G", "H"] as const;

export type SeatNumber = `${Row}${SeatCode}`;

export type SeatMap = Map<SeatNumber, string | null>;

export type AssignedPassenger = {
  passenger: PassengerWithFlags;
  groupId: string;
};
export type AssignedPassengerMap = Map<SeatNumber, AssignedPassenger>;

export type NeighboringSeatInfo = {
  leftSeat: SeatNumber | null;
  rightSeat: SeatNumber | null;
  leftPassenger: PassengerWithFlags | null;
  rightPassenger: PassengerWithFlags | null;
};


