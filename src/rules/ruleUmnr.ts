// find all UMs
// check if travel together (length >1)
// if so, assign a seat together as long as the seat left and right is female
// if not move on to next block
import type { Group } from "../types/groups.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap, SeatNumber } from "../types/seats.js";
import type {
  AssignSpecialData,
  SpecialGroupAnchor,
} from "../types/special.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { getSpecialIdsInGroup } from "../domain/special.utils.js";
import { getNonSpecialMembersIds } from "../domain/special.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";
import { getAssignedPassenger } from "../domain/seatmap.utils.js";
import { generateAllSeatNumbers } from "../domain/seats.utils.js";
import {
  getAllSpecialGroups,
  sortGroupsByNumbers,
} from "../domain/special.utils.js";

export function assignUmnrGroups({
  groups,
  passengersByIds,
  aisleSeatNumbers,
  assignedPassengerMap,
}: AssignSpecialData<"hasUMNR", "isUMNR">): SpecialGroupAnchor[] {
  const results: SpecialGroupAnchor[] = [];
  const umnrGroups = getAllSpecialGroups(groups, "hasUMNR");
  const sortedUmnrGroupsNumbers = sortGroupsByNumbers(
    groups,
    passengersByIds,
    "isUMNR",
  );
  for (const group of sortedUmnrGroupsNumbers) {
    const umnrIds = getSpecialIdsInGroup(group, passengersByIds, "isUMNR");
    if (umnrIds.length === 0) continue;

    const anchorSeatNumbers: SeatNumber[] = [];

    for (const umnrId of umnrIds) {
      const passenger = passengersByIds.get(umnrId);
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

      const unassignedMembersId = getNonSpecialMembersIds(
        group,
        passengersByIds,
        "isUMNR",
      );

      results.push({
        groupId: group.id,
        anchorSeatNumbers,
        unassignedMembersId,
      });
    }
  }
  return results;
}
