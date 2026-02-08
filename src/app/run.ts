import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { createAssignedPassengerMap } from "../domain/seatmap.utils.js";
import { generateAllAisleSeatNumbers } from "../domain/seats.utils.js";
import { groups } from "../output/groups.js";
import { assignWchrGroups, assignRestNextToAnchor } from "../rules/ruleWCHR.js";

export function run() {
  const passengersByIds = buildPassengersMapById(passengersWithFlags);
  const assignedPassengerMap = createAssignedPassengerMap();
  const aisleSeatNumbers = generateAllAisleSeatNumbers();

  const wchrAnchors = assignWchrGroups({
    groups,
    passengersByIds,
    aisleSeatNumbers,
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

  return "assignedPassengerMap;";
}
