import type {
  AssignedPassenger,
  SeatNumber,
  AssignedPassengerMap,
} from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";

export function createAssignedPassengerMap(): AssignedPassengerMap {
  return new Map<SeatNumber, AssignedPassenger>();
}

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

export function assginRestPassengers(
  unassignedPassengers: PassengerWithFlags[],
  emptySeats: SeatNumber[],
  assignedPassengerMap: AssignedPassengerMap,
) {
  let assigned = 0;
  for (let i = 0; i < unassignedPassengers.length && i < emptySeats.length; ) {
    const pax = unassignedPassengers[i] as PassengerWithFlags;
    const seat = emptySeats.shift() as SeatNumber;

    const groupId = pax?.group[0] as string;
    const successful = tryAssignSeatToPassenger(
      seat,
      pax,
      groupId,
      assignedPassengerMap,
    );

    if (successful) {
      unassignedPassengers.splice(i, 1);
      assigned++;
    } else {
      i++;
    }
  }
}
