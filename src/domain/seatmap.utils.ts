import type {
  AssignedPassenger,
  SeatNumber,
  AssignedPassengerMap,
} from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";

export function createAssignedPassengerMap(): AssignedPassengerMap {
  return new Map<SeatNumber, AssignedPassenger>();
}

// const assignedPassengerMap = createAssignedPassengerMap();
// main에서 쓸것

export function isEmpty(
  seatNumber: SeatNumber,
  assignedPassengerMap: AssignedPassengerMap,
): boolean {
  return !assignedPassengerMap.has(seatNumber);
}

export function tryAssignSeatToPassenger(
  seatNumber: SeatNumber,
  passenger: PassengerWithFlags,
  groupId: string,
  assignedPassengerMap: AssignedPassengerMap,
): boolean {
  if (assignedPassengerMap.has(seatNumber)) return false;
  assignedPassengerMap.set(seatNumber, { passenger, groupId });
  return true;
}

export function getAssignedPassenger(
  seatNumber: SeatNumber,
  assignedPassengerMap: AssignedPassengerMap,
): AssignedPassenger {
  const assignedPassenger = assignedPassengerMap.get(seatNumber);
  if (!assignedPassenger) {
    throw new Error(`No passenger assigned to seat ${seatNumber}`);
  }
  return assignedPassenger;
}
