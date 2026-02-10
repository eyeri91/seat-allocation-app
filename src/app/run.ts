import {
  buildPassengersMapById,
  getUnassignedPassengers,
} from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../generatedData/passengersWithFlags.js";
import {
  createAssignedPassengerMap,
  assginRestPassengers,
  buildSeatMapOutput,
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
import {
  frontRows,
  getTotalWeightOfRow,
  rearRows,
  sumRows,
} from "../rules/ruleWeight.js";
import { logEachStep } from "../utils/utils.js";
import { writeSeatMapInOriginalStructure } from "../domain/writeSeatMapJson.js";

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

  logEachStep("UMNR ASSIGNMENT", {
    totalUMNR: passengersWithFlags.filter((p) => p.isUMNR).length,
    assignedAfterUMNR: assignedPassengerMap.size,
  });

  const assginedFemaleCount = assignFemalesNextTo({
    assignedPassengerMap,
    unassignedCandidates: unassignedFemales,
    isTarget: (p) => p.isUMNR,
  });

  logEachStep("FEMALE NEXT TO UMNR", {
    unassignedFemalesBefore: assginedFemaleCount,
    assignedAfterFemaleRule: assignedPassengerMap.size,
  });

  assignWchrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: allAisleSeats,
    assignedPassengerMap,
    groupKey: "hasWCHR",
    flagKey: "isWCHR",
  });

  logEachStep("WCHR ASSIGNMENT", {
    totalWCHR: passengersWithFlags.filter((p) => p.isWCHR).length,
    totalAssignedAfterWCHR: assignedPassengerMap.size,
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

  logEachStep("FEMALE MUSLIM (ABJK)", {
    unassignedFemaleMuslims: unassignedFemaleMuslims.length,
    assignedFemaleMuslims: assignedMuslimFemales.length,
    totalAssignedAfterFemaleMuslims: assignedPassengerMap.size,
  });

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

  logEachStep("FEMALE OR MUSLIM NEXT TO", {
    candidates: unassignedCandidates.length,
    totlAssignedAfterMuslimRule: assignedPassengerMap.size,
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

  const rowWeight = getTotalWeightOfRow(assignedPassengerMap, ROW);

  const frontTotal = sumRows(rowWeight, frontRows);
  const rearTotal = sumRows(rowWeight, rearRows);

  console.log("\n===== FRONT / REAR WEIGHT =====");
  console.log(`Front rows (${frontRows.join(", ")}): ${frontTotal}`);
  console.log(`Rear  rows (${rearRows.join(", ")}): ${rearTotal}`);
  console.log("--------------------------------");
  console.log(`Diff (front - rear): ${frontTotal - rearTotal}`);

  const output = buildSeatMapOutput(assignedPassengerMap);

  writeSeatMapInOriginalStructure(output);

  return assignedPassengerMap;
}
