import type {
  AssignedPassenger,
  SeatNumber,
  AssignedPassengerMap,
} from "../types/seats.js";

export function createAssignedPassengerMap(): AssignedPassengerMap {
  return new Map<SeatNumber, AssignedPassenger>();
}
