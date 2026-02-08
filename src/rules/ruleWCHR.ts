import type { Group } from "../types/groups.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap, SeatNumber } from "../types/seats.js";

import { getWchrCount } from "../domain/special.utils.js";
import { getWchrIdsInGroup } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";
import { getAssignedPassenger } from "../domain/seatmap.utils.js";
import { generateAllSeatNumbers } from "../domain/seats.utils.js";

type AssignWchrData = {
  groups: Group[];
  passengersByIds: Map<string, PassengerWithFlags>;
  aisleSeatNumbers: SeatNumber[];
  assignedPassengerMap: AssignedPassengerMap;
};

export function getAllWchrGroups(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}

export type WchrGroupAnchor = {
  groupId: string;
  anchorSeatNumbers: SeatNumber[];
  unassignedMembersId: string[];
};

export function sortWchrGroupByNumbers(
  groups: Group[],
  ids: Map<string, PassengerWithFlags>,
): Group[] {
  return [...groups].sort((a, b) => {
    const groupPrev = getWchrCount(a, ids);
    const groupNext = getWchrCount(b, ids);
    if (groupPrev.count !== groupNext.count)
      return groupNext.count - groupPrev.count;
    return b.size - a.size;
  });
}

export function getNonWchrMembersIds(
  group: Group,
  passengersByIds: Map<string, PassengerWithFlags>,
): string[] {
  return group.membersIds.filter((id) => !passengersByIds.get(id)?.isWCHR);
}

export function assignWchrGroups({
  groups,
  passengersByIds,
  aisleSeatNumbers,
  assignedPassengerMap,
}: AssignWchrData): WchrGroupAnchor[] {
  const results: WchrGroupAnchor[] = [];
  const wchrGroups = getAllWchrGroups(groups);

  const sortedWchrGroupsNumbers = sortWchrGroupByNumbers(
    groups,
    passengersByIds,
  );

  for (const group of sortedWchrGroupsNumbers) {
    const wchrIDs = getWchrIdsInGroup(group, passengersByIds);
    if (wchrIDs.length === 0) continue;

    const anchorSeatNumbers: SeatNumber[] = [];

    for (const wchrId of wchrIDs) {
      const passenger = passengersByIds.get(wchrId);
      if (!passenger) continue;

      const seatNumber = aisleSeatNumbers.find(
        (seatNum) => !assignedPassengerMap.has(seatNum),
      );
      if (!seatNumber) break;

      const successful = tryAssignSeatToPassenger(
        seatNumber,
        passenger,
        group.id,
        assignedPassengerMap,
      );
      if (successful) anchorSeatNumbers.push(seatNumber);

      const unassignedMembersId = getNonWchrMembersIds(group, passengersByIds);

      results.push({
        groupId: group.id,
        anchorSeatNumbers,
        unassignedMembersId,
      });
    }
  }
  return results;
}

export type AssignRestData = WchrGroupAnchor & {
  passengersByIds: Map<string, PassengerWithFlags>;
  assignedPassengerMap: AssignedPassengerMap;
};

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
  // const assignedAnchors = new Set<SeatNumber>();

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

  if (emptySeatsToAssignRest.length < neededSeats) return false;

  const assignCount = Math.min(
    emptySeatsToAssignRest.length,
    unassignedMembersId.length,
  );

  for (
    let i = 0;
    i < unassignedMembersId.length && i < emptySeatsToAssignRest.length;
  ) {
    const paxId = unassignedMembersId[i];
    if (!paxId) break;
    const seatNumber = emptySeatsToAssignRest[i];
    if (!seatNumber) break;
    const passenger = passengersByIds.get(paxId);
    if (!passenger) break;
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
        unassignedMembersId.splice(i, 1); // ✅ 성공하면 제거
      } else {
        i++;
      }
    }
  }

  return unassignedMembersId.length === 0;
}

// const allSeatNumbers = generateAllSeatNumbers();
// const leftEmptySeats = allSeatNumbers.filter((seat) => !assigendMa);
