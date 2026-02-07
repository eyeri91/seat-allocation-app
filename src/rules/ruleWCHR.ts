import type { Group } from "../types/groups.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap, SeatNumber } from "../types/seats.js";

import { getWCHRCount } from "../domain/special.utils.js";
import { getWCHRIdsInGroup } from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";

import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { allAisleSeats } from "../domain/seats.utils.js";

type AssignWCHRContext = {
  groups: Group[];
  passengersByIds: Map<string, PassengerWithFlags>;
  aisleSeatNumbers: SeatNumber[];
  assignedPassengerMap: AssignedPassengerMap;
};

export function getAllGroupsHasWCHR(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}

export function assignWCHRGroups({
  groups,
  passengersByIds,
  aisleSeatNumbers,
  assignedPassengerMap,
}: AssignWCHRContext): void {
  const groupsWithWCHR = getAllGroupsHasWCHR(groups);

  const sortedGroupByWCHRNumbers = [...groupsWithWCHR].sort((a, b) => {
    const groupPrev = getWCHRCount(a, passengersByIds);
    const groupNext = getWCHRCount(b, passengersByIds);
    if (groupPrev.count !== groupNext.count)
      return groupNext.count - groupPrev.count;
    return b.size - a.size;
  });

  for (const group of sortedGroupByWCHRNumbers) {
    const IdsOfWCHR = getWCHRIdsInGroup(group, passengersByIds);
    if (IdsOfWCHR.length === 0) continue;

    for (const idOfWCHR of IdsOfWCHR) {
      const passenger = passengersByIds.get(idOfWCHR);
      if (!passenger) continue;

      const seatNumber = allAisleSeats.find(
        (seatNum) => !assignedPassengerMap.has(seatNum),
      );
      if (!seatNumber) return;
      tryAssignSeatToPassenger(
        seatNumber,
        passenger,
        group.id,
        assignedPassengerMap,
      );
    }
  }
}
