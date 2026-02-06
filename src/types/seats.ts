export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

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

export type AisleSeatCode = "C" | "D" | "G" | "H";

export const AISLE_SEAT_CODES: AisleSeatCode[] = ["C", "D", "G", "H"] as const;

export interface Seat {
  row: Row;
  code: SeatCode;
}
