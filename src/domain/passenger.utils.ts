import type { PassengerWithFlags } from "../types/special.js";

export function buildPassengersMapById(
  passengers: PassengerWithFlags[],
): Map<string, PassengerWithFlags> {
  return new Map(
    passengers.map((passenger) => [passenger.id, passenger] as const),
  );
}


export function buildUnassignedFemales(
  passengers: PassengerWithFlags[],
): PassengerWithFlags[] {
  return passengers.filter((p) => p.gender === "F" && !p.isUMNR);
}