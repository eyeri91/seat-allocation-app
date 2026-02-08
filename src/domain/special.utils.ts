import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";
import type { PassengerWithFlags, AssignFemalesNextToInput } from "../types/special.js";
import { buildPassengersMapById } from "./passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";
import type { GroupSpecialKey } from "../types/special.js";

const passengersByIds = buildPassengersMapById(passengersWithFlags);

export function addSpecialFlags(passengers: Passenger[]): PassengerWithFlags[] {
  const passengersWithFlags: PassengerWithFlags[] = [];

  for (const p of passengers) {
    passengersWithFlags.push({
      ...p,
      isWCHR: p.special === "WCHR",
      isUMNR: p.special === "UMNR",
      isMuslim: p.special === "Muslim",
      isFemaleMuslim: p.special === "Muslim" && p.gender === "F",
    });
  }
  return passengersWithFlags;
}

export function isFemale(passenger: PassengerWithFlags): boolean {
  return passenger.gender === "F";
}

export function getAllSpecialGroups<Special extends GroupSpecialKey>(
  groups: Group[],
  specialKey: Special,
) {
  return groups.filter((g) => Boolean(g[specialKey]));
}

type PassengerSpecialKey = Extract<keyof PassengerWithFlags, `is${string}`>;

export function getSpecialCount<Special extends PassengerSpecialKey>(
  group: Group,
  passengersByIds: Map<string, PassengerWithFlags>,
  specialFlag: Special,
): { groupId: string; count: number } {
  let count = 0;

  for (const id of group.membersIds) {
    const passenger = passengersByIds.get(id);
    if (passenger?.[specialFlag]) count += 1;
  }
  return { groupId: group.id, count };
}
export function sortGroupsByNumbers<Special extends PassengerSpecialKey>(
  groups: Group[],
  passengersByIds: Map<string, PassengerWithFlags>,
  specialFlag: Special,
): Group[] {
  return [...groups].sort((a, b) => {
    const aCount = getSpecialCount(a, passengersByIds, specialFlag).count;
    const bCount = getSpecialCount(b, passengersByIds, specialFlag).count;

    if (aCount !== bCount) return bCount - aCount;
    return b.size - a.size;
  });
}

export function getSpecialIdsInGroup<Special extends PassengerSpecialKey>(
  group: Group,
  passengersByIds: Map<string, PassengerWithFlags>,
  specialFlag: Special,
): string[] {
  const ids: string[] = [];
  for (const id of group.membersIds) {
    const passenger = passengersByIds.get(id);
    if (passenger?.[specialFlag]) ids.push(id);
  }
  return ids;
}

export function getNonSpecialMembersIds<Special extends PassengerSpecialKey>(
  group: Group,
  passengersByIds: Map<string, PassengerWithFlags>,
  specialFlag: Special,
): string[] {
  return group.membersIds.filter(
    (id) => !passengersByIds.get(id)?.[specialFlag],
  );
}

export function assignFemalesNextTo({
  assignedPassengerMap,
  unassignedFemales,
  isTarget,
}: AssignFemalesNextToInput): number {
  let assignedCount = 0;

  for (const [targetSeat, assigned] of assignedPassengerMap.entries()) {
    const targetPassenger = assigned.passenger;
    if (!isTarget(targetPassenger)) continue;
    if (unassignedFemales.length === 0) break;

    const leftSeat = getLeftSeatNumber(targetSeat);
    const rightSear= getRightSeatNumber(targetSeat);

    const neighborSeats: (SeatNumber | null)[] = [leftSear, rightSeat];

    for (const neighborSeat of neighborSeats) {
      if (!neighborSeat) continue; // 없으면 skip
      if (assignedPassengerMap.has(neighborSeat)) continue; // 이미 차있으면 skip
      if (unassignedFemales.length === 0) break;

      const female = unassignedFemales[0];
      if (!female) break;

      // ✅ groupId는 "옆에 붙는 target의 groupId"로 그냥 재사용 (별도 파라미터 없음)
      const successful = tryAssignSeatToPassenger(
        neighborSeat,
        female,
        assigned.groupId, // <-- target의 groupId 사용
        assignedPassengerMap,
      );

      if (successful) {
        unassignedFemales.shift(); // ✅ 리스트 업데이트
        assignedCount++;
        break; // 이 target은 한 명 붙였으니 다음 target
      }
    }
  }

  return assignedCount;
}
