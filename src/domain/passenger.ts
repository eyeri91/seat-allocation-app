import { passengersWithFlags } from "../output/passengersWithFlags.js";
import type { PassengerWithFlags } from "../types/special.js";

export function buildPassengersMapById(
  passengers: PassengerWithFlags[],
): Map<string, PassengerWithFlags> {
  return new Map(
    passengers.map((passenger) => [passenger.id, passenger] as const),
  );
}

export const passengersById = buildPassengersMapById(passengersWithFlags);
