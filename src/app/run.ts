import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { createAssignedPassengerMap } from "../domain/seatmap.utils.js";
import {
  generateAllAisleSeatNumbers,
  generateAllSeatNumbers,
  getAllEmptySeatNumbers,
  getEligibleSeatsForSpecial,
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
    availableSeatNumbers: aisleSeatNumbers,
    assignedPassengerMap,
    groupKey: "hasWCHR",
    flagKey: "isWCHR",
  });

  const emptySeatNumbersAfterWchr = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );

  const eligibleSeats = getEligibleSeatsForSpecial(
    emptySeatNumbersAfterWchr,
    assignedPassengerMap,
    (seat, neighbor) => {
      const leftOk =
        neighbor.leftPassenger &&
        (neighbor.leftPassenger.gender === "F" ||
          neighbor.leftPassenger.isUMNR);

      const rightOk =
        neighbor.rightPassenger &&
        (neighbor.rightPassenger.gender === "F" ||
          neighbor.rightPassenger.isUMNR);

      return Boolean(leftOk || rightOk);
    },
  );

  const umnrAnchors = assignUmnrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: emptySeatNumbersAfterWchr,
    assignedPassengerMap,
    groupKey: "hasUMNR",
    flagKey: "isUMNR",
  });

  return assignedPassengerMap;
}
