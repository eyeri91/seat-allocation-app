import type { PassengerWithFlags } from "../types/special.js";
import type { AssignedPassengerMap } from "../types/seats.js";

export function buildPassengersMapById(
  passengers: PassengerWithFlags[],
): Map<string, PassengerWithFlags> {
  return new Map(
    passengers.map((passenger) => [passenger.id, passenger] as const),
  );
}

export function getUnassignedPassengers(
  passengers: PassengerWithFlags[],
  assignedPassengerMap: AssignedPassengerMap,
  flags?: (p: PassengerWithFlags) => boolean,
): PassengerWithFlags[] {
  const assignedIds = new Set<string>();

  for (const assigned of assignedPassengerMap.values()) {
    assignedIds.add(assigned.passenger.id);
  }

  const unassigned = passengers.filter((p) => !assignedIds.has(p.id));
  return flags ? unassigned.filter(flags) : unassigned;
}
