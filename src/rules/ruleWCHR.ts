import type { SeatNumber } from "../types/seats.js";
import type { AssignSpecialData } from "../types/special.js";
import type { SpecialGroupAnchor } from "../types/special.js";

import { getAllSpecialGroups } from "../domain/special.utils.js";
import { sortGroupsByNumbers } from "../domain/special.utils.js";
import { getSpecialIdsInGroup } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";

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

  let assignedCount = 0;
  let failedCount = 0;

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
        assignedCount++;
        anchorSeatNumbers.push(seatNumber);
      } else {
        failedCount++;
      }
    }
  }
}
