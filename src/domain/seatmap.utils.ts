import type {
  AssignedPassenger,
  SeatNumber,
  AssignedPassengerMap,
} from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";
import { generateAllSeatNumbers } from "./seats.utils.js";
import type { AssignRestData } from "../types/seats.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";

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

export function assignRestNextToAnchor(inputs: AssignRestData) {
  const {
    groupId,
    unassignedMembersId,
    anchorSeatNumbers,
    passengersByIds,
    assignedPassengerMap,
  } = inputs;

  const neededSeats = unassignedMembersId.length;
  if (neededSeats === 0) return true;

  const emptySeatsToAssignRest: SeatNumber[] = [];
  let anchorSeats: SeatNumber[] = [...anchorSeatNumbers];

  const fillEmptySeatsFromAnchors = (
    anchors: SeatNumber[],
    getNextSeat: (seat: SeatNumber) => SeatNumber | null,
  ) => {
    const usedAnchors = new Set<SeatNumber>();

    for (const anchor of anchors) {
      let currentSeat = anchor;
      while (emptySeatsToAssignRest.length < neededSeats) {
        const next = getNextSeat(currentSeat);
        if (!next) break;
        if (assignedPassengerMap.has(next)) break;

        emptySeatsToAssignRest.push(next);
        usedAnchors.add(anchor);

        currentSeat = next;
      }

      if (emptySeatsToAssignRest.length >= neededSeats) break;
    }
    return anchors.filter((a) => !usedAnchors.has(a));
  };

  anchorSeats = fillEmptySeatsFromAnchors(anchorSeats, getLeftSeatNumber);
  if (emptySeatsToAssignRest.length < neededSeats) {
    anchorSeats = fillEmptySeatsFromAnchors(anchorSeats, getRightSeatNumber);
  }

  const assignCount = Math.min(
    emptySeatsToAssignRest.length,
    unassignedMembersId.length,
  );

  for (
    let i = 0;
    i < unassignedMembersId.length && i < emptySeatsToAssignRest.length;
  ) {
    const paxId = unassignedMembersId[i];
    const seatNumber = emptySeatsToAssignRest[i];
    if (!paxId || !seatNumber) break;

    const passenger = passengersByIds.get(paxId);
    if (!passenger) {
      i++;
      continue;
    }

    const successful = tryAssignSeatToPassenger(
      seatNumber,
      passenger,
      groupId,
      assignedPassengerMap,
    );

    if (successful) {
      unassignedMembersId.splice(i, 1);
      emptySeatsToAssignRest.splice(i, 1);
    } else {
      i++;
    }
  }

  if (unassignedMembersId.length > 0) {
    const allSeats = generateAllSeatNumbers();
    const emptySeats = allSeats.filter((s) => !assignedPassengerMap.has(s));

    for (let i = 0; i < unassignedMembersId.length && i < emptySeats.length; ) {
      const paxId = unassignedMembersId[i];
      const seatNumber = emptySeats.shift();
      if (!paxId || !seatNumber) break;

      const passenger = passengersByIds.get(paxId);
      if (!passenger) {
        i++;
        continue;
      }

      const successful = tryAssignSeatToPassenger(
        seatNumber,
        passenger,
        groupId,
        assignedPassengerMap,
      );

      if (successful) {
        unassignedMembersId.splice(i, 1);
      } else {
        i++;
      }
    }
  }
  console.log(
    `[REST] group=${groupId} anchors=${anchorSeatNumbers.length} need=${neededSeats} gotNear=${emptySeatsToAssignRest.length} leftAfter=${unassignedMembersId.length}`,
  );
  return unassignedMembersId.length === 0;
}
