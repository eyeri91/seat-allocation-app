import type {
  AssignSpecialData,
  SpecialGroupAnchor,
} from "../types/special.js";
import type { SeatNumber, AssignedPassengerMap } from "../types/seats.js";
import { isFemale } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { getSpecialIdsInGroup } from "../domain/special.utils.js";
import { getNonSpecialMembersIds } from "../domain/special.utils.js";
import {
  getAllSpecialGroups,
  sortGroupsByNumbers,
} from "../domain/special.utils.js";

export function assignUmnrGroups({
  groups,
  passengersByIds,
  availableSeatNumbers,
  assignedPassengerMap,
}: AssignSpecialData<"hasUMNR", "isUMNR">): SpecialGroupAnchor[] {
  const results: SpecialGroupAnchor[] = [];
  const umnrGroups = getAllSpecialGroups(groups, "hasUMNR");

  const sortedUmnrGroupsNumbers = sortGroupsByNumbers(
    umnrGroups,
    passengersByIds,
    "isUMNR",
  );
  let totalMems = 0;
  for (const group of sortedUmnrGroupsNumbers) {
    const umnrIds = getSpecialIdsInGroup(group, passengersByIds, "isUMNR");
    totalMems += umnrIds.length;
    if (umnrIds.length === 0) continue;

    const anchorSeatNumbers: SeatNumber[] = [];

    for (const umnrId of umnrIds) {
      const umnr = passengersByIds.get(umnrId);
      if (!umnr) continue;

      const seatNumber = availableSeatNumbers.find(
        (seat) => !assignedPassengerMap.has(seat),
      );
      if (!seatNumber) break;

      const successful = tryAssignSeatToPassenger(
        seatNumber,
        umnr,
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
  console.log(`"total mems of UMNR : ${totalMems}`);
  return results;
}

export function getUmnrSeatNumbers(
  assignedPassengerMap: AssignedPassengerMap,
): SeatNumber[] {
  const result: SeatNumber[] = [];

  for (const [seat, assigned] of assignedPassengerMap.entries()) {
    if (assigned.passenger.isUMNR) result.push(seat);
  }

  return result;
}
