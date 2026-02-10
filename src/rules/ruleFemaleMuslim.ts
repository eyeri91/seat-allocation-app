import { getLeftSeatNumber, getRightSeatNumber } from "../utils/utils.js";
import { tryAssignSeatToPassenger } from "../domain/seatmap.utils.js";
import type { AssignFemalesOrMuslimMalesFromGroupNextToInput } from "../types/special.js";
import type { SeatNumber } from "../types/seats.js";

export function assignFemalesOrMuslimMalesFromGroupNextTo({
  assignedPassengerMap,
  unassignedCandidates,
  isTarget,
}: AssignFemalesOrMuslimMalesFromGroupNextToInput): number {
  let assignedCount = 0;

  for (const [targetSeat, assigned] of assignedPassengerMap.entries()) {
    const targetPassenger = assigned.passenger;
    if (!isTarget(targetPassenger)) continue;
    if (unassignedCandidates.length === 0) break;

    const leftSeat = getLeftSeatNumber(targetSeat);
    const rightSeat = getRightSeatNumber(targetSeat);

    const neighborSeats: (SeatNumber | null)[] = [leftSeat, rightSeat];

    for (const neighborSeat of neighborSeats) {
      if (!neighborSeat) continue;
      if (assignedPassengerMap.has(neighborSeat)) continue;
      if (unassignedCandidates.length === 0) break;

      const candidate = unassignedCandidates[0];
      if (!candidate) break;

      const groupIdForCandidate = candidate.group[0] as string;
      const successful = tryAssignSeatToPassenger(
        neighborSeat,
        candidate,
        groupIdForCandidate,
        assignedPassengerMap,
      );

      if (successful) {
        unassignedCandidates.shift();
        assignedCount++;
        break;
      }
    }
  }

  return assignedCount;
}
