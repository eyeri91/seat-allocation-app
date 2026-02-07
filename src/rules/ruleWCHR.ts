// export function rullWCHR(){

import type { Group } from "../types/groups.js";
import { passengersById } from "../domain/passenger.js";

export function getAllGroupsHasWCHR(groups: Group[]) {
  return groups.filter((p) => p.hasWCHR);
}
