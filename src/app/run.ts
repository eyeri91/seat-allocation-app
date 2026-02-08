import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { createAssignedPassengerMap } from "../domain/seatmap.utils.js";
import {
  generateAllAisleSeatNumbers,
  generateAllSeatNumbers,
  getAllEmptySeatNumbers,
} from "../domain/seats.utils.js";
import { groups } from "../output/groups.js";
import { assignWchrGroups, assignRestNextToAnchor } from "../rules/ruleWCHR.js";
import { assignUmnrGroups } from "../rules/ruleUMNR.js";

export function run() {
  const passengersByIds = buildPassengersMapById(passengersWithFlags);
  const assignedPassengerMap = createAssignedPassengerMap();
  const allSeatNumbers = generateAllSeatNumbers();
  const leftEmptySeatNumbers = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );
  const aisleSeatNumbers = generateAllAisleSeatNumbers();

  const wchrAnchors = assignWchrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers,
    assignedPassengerMap,
    groupKey: "hasWCHR",
    flagKey: "isWCHR",
  });

  for (const anchorData of wchrAnchors) {
    assignRestNextToAnchor({
      ...anchorData,
      passengersByIds,
      assignedPassengerMap,
    });
  }

  const umnrAnchors = assignUmnrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers,
    assignedPassengerMap,
    groupKey: "hasUMNR",
    flagKey: "isUMNR",
  });
  return "assignedPassengerMap;";
}
