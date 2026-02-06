import {
  type AisleSeatCode,
  type Seat,
  AISLE_SEAT_CODES,
} from "../types/seats.js";

export function isAisleSeat(seat: Seat): Boolean {
  return AISLE_SEAT_CODES.includes(seat.code as AisleSeatCode);
}
