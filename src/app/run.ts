import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { createAssignedPassengerMap } from "../domain/seatmap.utils.js";
import {
  generateAllAisleSeatNumbers,
  generateAllSeatNumbers,
  getAllEmptySeatNumbers,
  getEligibleSeatsForSpecial,
  generateABJKSeats,
  allAisleSeats,
} from "../domain/seats.utils.js";
import { groups } from "../output/groups.js";
import { assignWchrGroups, assignRestNextToAnchor } from "../rules/ruleWCHR.js";
import { assignUmnrGroups } from "../rules/ruleUMNR.js";
import { ROW } from "../types/seats.js";
import { assignFemalesNextTo } from "../domain/special.utils.js";
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
  const unassignedFemales = passengersWithFlags.filter(
    (p) => p.gender === "F" && !p.isUMNR,
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
    unassignedFemales,
    isTarget: (p) => p.isUMNR,
  });

  const emptySeatNumbersAfterFemales = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );

  console.log(emptySeatNumbersAfterFemales.length);

  assignWchrGroups({
    groups,
    passengersByIds,
    availableSeatNumbers: allAisleSeats,
    assignedPassengerMap,
    groupKey: "hasWCHR",
    flagKey: "isWCHR",
  });
  const emptySeatNumbersAfterWchr = getAllEmptySeatNumbers(
    allSeatNumbers,
    assignedPassengerMap,
  );
  console.log(emptySeatNumbersAfterWchr.length);

  //   const wchrAnchors = assignWchrGroups({
  //     groups,
  //     passengersByIds,
  //     availableSeatNumbers: aisleSeatNumbers,
  //     assignedPassengerMap,
  //     groupKey: "hasWCHR",
  //     flagKey: "isWCHR",
  //   });

  //   const emptySeatNumbersAfterWchr = getAllEmptySeatNumbers(
  //     allSeatNumbers,
  //     assignedPassengerMap,
  //   );

  //   const eligibleSeats = getEligibleSeatsForSpecial(
  //     emptySeatNumbersAfterWchr,
  //     assignedPassengerMap,
  //     (seat, neighbor) => {
  //       const leftOk =
  //         neighbor.leftPassenger &&
  //         (neighbor.leftPassenger.gender === "F" ||
  //           neighbor.leftPassenger.isUMNR);

  //       const rightOk =
  //         neighbor.rightPassenger &&
  //         (neighbor.rightPassenger.gender === "F" ||
  //           neighbor.rightPassenger.isUMNR);

  //       return Boolean(leftOk || rightOk);
  //     },
  //   );

  //   console.log(emptySeatNumbersAfterUmnr.length);

  return "end";
}
