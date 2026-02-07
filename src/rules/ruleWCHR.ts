import type { Group } from "../types/groups.js";
import { groups } from "../output/groups.js";
import { getWCHRCount } from "../domain/special.utils.js";
import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";

const passengersByIds = buildPassengersMapById(passengersWithFlags);

export function getAllGroupsHasWCHR(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}

export const groupsWithWCHR = getAllGroupsHasWCHR(groups);

export const sortedGroupByWCHRNumbers = [...groupsWithWCHR].sort((a, b) => {
  const groupPrev = getWCHRCount(a, passengersByIds);
  const groupNext = getWCHRCount(b, passengersByIds);
  if (groupPrev.count !== groupNext.count)
    return groupNext.count - groupPrev.count;
  return b.size - a.size;
});
