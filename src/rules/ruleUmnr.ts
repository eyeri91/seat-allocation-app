import type {
  AssignSpecialData,
  SpecialGroupAnchor,
} from "../types/special.js";
import type { SeatNumber } from "../types/seats.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { getSpecialIdsInGroup } from "../domain/special.utils.js";
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
    }
    results.push({
      groupId: group.id,
      anchorSeatNumbers,
      unassignedMembersId: [],
    });
  }

  return results;
}
