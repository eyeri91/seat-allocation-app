import { buildPassengersMapById } from "../domain/passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import { createAssignedPassengerMap } from "../domain/seatmap.utils.js";
import { generateAllAisleSeatNumbers } from "../domain/seats.utils.js";

import { groups } from "../output/groups.js";
// import { assignWchrGroups } from "../rules/ruleWCHR.js";   // ✅ 추가

export function run() {
  const passengersByIds = buildPassengersMapById(passengersWithFlags);
  const assignedPassengerMap = createAssignedPassengerMap();
  const aisleSeatNumbers = generateAllAisleSeatNumbers();

  // ✅ WCHR 배정 실행 (rule 파일이 map을 업데이트함)
  //   assignWchrGroups({
  //     groups,
  //     passengersByIds,
  //     aisleSeatNumbers,
  //     assignedPassengerMap,
  //   });

  // TODO: 다음 룰들도 같은 방식으로 붙이면 됨
  // assignUmnrGroups({ ... assignedPassengerMap })

  return assignedPassengerMap;
}
