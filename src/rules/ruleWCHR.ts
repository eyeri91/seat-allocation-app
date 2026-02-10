import type { SeatNumber } from "../types/seats.js";
import type { AssignSpecialData } from "../types/special.js";
import type { SpecialGroupAnchor } from "../types/special.js";

import { getAllSpecialGroups } from "../domain/special.utils.js";
import { getNonSpecialMembersIds } from "../domain/special.utils.js";
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
  }
}
