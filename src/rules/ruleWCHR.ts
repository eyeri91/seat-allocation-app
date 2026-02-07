import type { Group } from "../types/groups.js";
import { groups } from "../output/groups.js";
import { getWCHRCount } from "../domain/special-category.js";
import { buildPassengersMapById } from "../domain/passenger.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { sortGroupsBySizeDescending } from "../domain/groups.js";

const passengersByIds = buildPassengersMapById(passengersWithFlags);

export function getAllGroupsHasWCHR(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}

const groupsWithWCHR = getAllGroupsHasWCHR(groups);

const sortedWCHRGroupsBySizeDescending = [...groupsWithWCHR].sort((a, b) => {
  const groupPrev = getWCHRCount(a, passengersByIds);
  const groupNext = getWCHRCount(b, passengersByIds);
  if (groupPrev.count !== groupNext.count)
    return groupNext.count - groupPrev.count;
  return b.size - a.size;
});
