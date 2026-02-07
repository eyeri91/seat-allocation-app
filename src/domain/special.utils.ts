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

export function getWCHRCount(
  group: Group,
  passengersByIds: Map<string, PassengerWithFlags>,
): { groupId: string; count: number } {
  let count = 0;

  for (const id of group.membersIds) {
    const passenger = passengersByIds.get(id);
    if (passenger?.isWCHR) count += 1;
  }
  return { groupId: group.id, count };
}
