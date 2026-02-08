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
  console.log(umnrGroups);
  return results;
}
