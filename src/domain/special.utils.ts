import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";
import type {
  Special,
  SPECIAL,
  SpecialFlags,
  PassengerWithFlags,
} from "../types/special.js";
import { buildPassengersMapById } from "./passenger.utils.js";
import { passengersWithFlags } from "../output/passengersWithFlags.js";

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

type GroupSpecialKey = Extract<keyof Group, `has${string}`>;

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
