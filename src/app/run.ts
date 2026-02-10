import {
  buildPassengersMapById,
  getUnassignedPassengers,
} from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import {
  createAssignedPassengerMap,
  assginRestPassengers,
} from "../domain/seatmap.utils.js";
import {
  generateAllAisleSeatNumbers,
  generateAllSeatNumbers,
  getAllEmptySeatNumbers,
  generateABJKSeats,
  allAisleSeats,
} from "../domain/seats.utils.js";
import { groups } from "../output/groups.js";
import { assignWchrGroups } from "../rules/ruleWCHR.js";
import { assignUmnrGroups } from "../rules/ruleUMNR.js";
import { ROW, type SeatNumber } from "../types/seats.js";
import {
  assignFemalesNextTo,
  buildUnassignedFemales,
  buildUnassignedFemalesOrMaleMuslimsFromSameGroup,
} from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { assignFemalesOrMuslimMalesFromGroupNextTo } from "../rules/ruleFemaleMuslim.js";
import type { PassengerWithFlags } from "../types/special.js";
import { getSeatsWithEmptyNeighbor } from "../domain/seats.utils.js";
import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";

export function run() {
  const passengersByIds = buildPassengersMapById(passengersWithFlags);
  const assignedPassengerMap = createAssignedPassengerMap();
  const allSeatNumbers = generateAllSeatNumbers();
  const allABJKSeats = generateABJKSeats(ROW);
  const leftEmptySeatNumbers = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );
  const aisleSeatNumbers = generateAllAisleSeatNumbers();
  const unassignedFemales = buildUnassignedFemales(
    passengersWithFlags,
    assignedPassengerMap,
  );

  const umnrAnchors = assignUmnrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: allABJKSeats,
    assignedPassengerMap,
    groupKey: "hasUMNR",
    flagKey: "isUMNR",
  });

  const emptySeatNumbersAfterUmnr = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );

  assignFemalesNextTo({
    assignedPassengerMap,
    unassignedCandidates: unassignedFemales,
    isTarget: (p) => p.isUMNR,
  });

  assignWchrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: allAisleSeats,
    assignedPassengerMap,
    groupKey: "hasWCHR",
    flagKey: "isWCHR",
  });

  const emptyABJKSeats = allABJKSeats.filter(
    (s) => !assignedPassengerMap.has(s),
  );

  const unassignedFemaleMuslims = getUnassignedPassengers(
    passengersWithFlags,
    assignedPassengerMap,
    (p) => p.gender === "F" && p.isMuslim,
  );

  let assignedMuslimFemales: PassengerWithFlags[] = [];

  for (const pax of unassignedFemaleMuslims) {
    const groupId = pax.group[0] as string;
    let isAssigned = false;
    for (let i = 0; i < emptyABJKSeats.length; i++) {
      const seat = emptyABJKSeats[i] as SeatNumber;
      const successful = tryAssignSeatToPassenger(
        seat,
        pax,
        groupId,
        assignedPassengerMap,
      );
      if (successful) {
        isAssigned = true;
        emptyABJKSeats.splice(i, 1);
        assignedMuslimFemales.push(pax);
        break;
      }
    }
    if (!isAssigned) break;
  }

  const unassignedRest = getUnassignedPassengers(
    passengersWithFlags,
    assignedPassengerMap,
  );

  const unassignedCandidates = buildUnassignedFemalesOrMaleMuslimsFromSameGroup(
    assignedMuslimFemales,
    unassignedRest,
  );

  // console.log(`unassignedFemaleMuslims:${unassignedFemaleMuslims.length}`);
  // console.log(`assignedMuslimFemales:${assignedMuslimFemales.length}`);
  // console.log(`unassignedRest:${unassignedRest.length}`);
  // console.log(`unassignedCandidates:${unassignedCandidates.length}`);

  assignFemalesOrMuslimMalesFromGroupNextTo({
    assignedPassengerMap,
    unassignedCandidates,
    isTarget: (p) => p.isFemaleMuslim,
  });

  const unassignedPassengersFinal = getUnassignedPassengers(
    passengersWithFlags,
    assignedPassengerMap,
  );

  const stillEmptySeatsFinal = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );

  assginRestPassengers(
    unassignedPassengersFinal,
    stillEmptySeatsFinal,
    assignedPassengerMap,
  );

  return "end";
}
