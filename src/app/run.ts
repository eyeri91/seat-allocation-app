import {
  buildPassengersMapById,
  getUnassignedPassengers,
} from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../generatedData/passengersWithFlags.js";
import {
  createAssignedPassengerMap,
  assginRestPassengers,
  buildSeatMapOutput,
  buildSeatMapOutputByRow,
} from "../domain/seatmap.utils.js";
import {
  generateAllAisleSeatNumbers,
  generateAllSeatNumbers,
  getAllEmptySeatNumbers,
  generateABJKSeats,
  allAisleSeats,
} from "../domain/seats.utils.js";
import { groups } from "../generatedData/groups.js";
import { assignWchrGroups } from "../rules/ruleWchr.js";
import { assignUmnrGroups } from "../rules/ruleUmnr.js";
import { ROW, type SeatNumber } from "../types/seats.js";
import {
  assignFemalesNextTo,
  buildUnassignedFemales,
  buildUnassignedFemalesOrMaleMuslimsFromSameGroup,
} from "../domain/special.utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import { assignFemalesOrMuslimMalesFromGroupNextTo } from "../rules/ruleFemaleMuslim.js";
import type { PassengerWithFlags } from "../types/special.js";

import { logEachStep } from "../utils/utils.js";
import {
  writeSeatMapInOriginalStructure,
  writeSeatMapJsonWithRowInfo,
} from "../domain/writeSeatMapJson.js";

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

  assignUmnrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: allABJKSeats,
    assignedPassengerMap,
    groupKey: "hasUMNR",
    flagKey: "isUMNR",
  });

  const assignedFemalesNextToUmnr = assignFemalesNextTo({
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

  logEachStep("FINAL", {
    unassignedPassenger: unassignedPassengersFinal.length,
    emptySeat: stillEmptySeatsFinal.length,
    assignedTotal: assignedPassengerMap.size,
  });

  const output = buildSeatMapOutput(assignedPassengerMap);
  const outputWithRowInfo = buildSeatMapOutputByRow(assignedPassengerMap);

  writeSeatMapInOriginalStructure(output);
  writeSeatMapJsonWithRowInfo(outputWithRowInfo);

  return assignedPassengerMap;
}
