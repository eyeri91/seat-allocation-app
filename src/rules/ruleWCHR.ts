import type { Group } from "../types/groups.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap, SeatNumber } from "../types/seats.js";
import type { AssignSpecialData } from "../types/special.js";
import type { SpecialGroupAnchor } from "../types/special.js";

import { getAllSpecialGroups } from "../domain/special.utils.js";
import { getNonSpecialMembersIds } from "../domain/special.utils.js";
import { sortGroupsByNumbers } from "../domain/special.utils.js";
import { getSpecialIdsInGroup } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";
import { getAssignedPassenger } from "../domain/seatmap.utils.js";
import { generateAllSeatNumbers } from "../domain/seats.utils.js";

export function assignWchrGroups({
  groups,
  passengersByIds,
  availableSeatNumbers,
  assignedPassengerMap,
}: AssignSpecialData<"hasWCHR", "isWCHR">): void {
  const results: SpecialGroupAnchor[] = [];
  const wchrGroups = getAllSpecialGroups(groups, "hasWCHR");

  const sortedWchrGroupsNumbers = sortGroupsByNumbers(
    wchrGroups,
    passengersByIds,
    "isWCHR",
  );

  let okCount = 0;
  let failCount = 0;

  for (const group of sortedWchrGroupsNumbers) {
    const wchrIDs = getSpecialIdsInGroup(group, passengersByIds, "isWCHR");
    if (wchrIDs.length === 0) continue;

    const anchorSeatNumbers: SeatNumber[] = [];

    for (const wchrId of wchrIDs) {
      const passenger = passengersByIds.get(wchrId);
      if (!passenger) continue;

      const seatNumber = availableSeatNumbers.find(
        (seatNum) => !assignedPassengerMap.has(seatNum),
      );
      if (!seatNumber) break;

      const successful = tryAssignSeatToPassenger(
        seatNumber,
        passenger,
        group.id,
        assignedPassengerMap,
      );
      if (successful) {
        okCount++;
        anchorSeatNumbers.push(seatNumber);
      } else {
        failCount++;
        console.log(
          `[WCHR FAIL] group=${group.id} pax=${wchrId} seat=${seatNumber} mapHas=${assignedPassengerMap.has(seatNumber)}`,
        );
      }
    }

    if (anchorSeatNumbers.length === 0) continue;
    const unassignedMembersId = getNonSpecialMembersIds(
      group,
      passengersByIds,
      "isWCHR",
    );

    assignRestNextToAnchor({
      groupId: group.id,
      anchorSeatNumbers,
      unassignedMembersId,
      passengersByIds,
      assignedPassengerMap,
    });
  }
  console.log(`WCHR ok=${okCount} fail=${failCount}`);
}

export type AssignRestData = SpecialGroupAnchor & {
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
