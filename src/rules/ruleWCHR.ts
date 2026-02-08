import type { Group } from "../types/groups.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap, SeatNumber } from "../types/seats.js";

import { getWchrCount } from "../domain/special.utils.js";
import { getWchrIdsInGroup } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";

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

  le;
}

// export function findEmptyNeighborBlock(
//   wchrGroupAnchor: WchrGroupAnchor,
//   passengersByIds: Map<string, PassengerWithFlags>,
//   assignedPassengerMap: Map<
//     SeatNumber,
//     {
//       passenger: PassengerWithFlags;
//       groupId: string;
//     }
//   >,
// ) {}
