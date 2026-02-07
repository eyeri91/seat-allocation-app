import type { Group } from "../types/groups.js";
// import { passengersWithFlags } from "../output/passengersWithFlags.js";
// import { buildPassengersMapById } from "../domain/passenger.js";
// import { sortGroupsBySizeDescending } from "../domain/groups.js";

export function getAllGroupsHasWCHR(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}
