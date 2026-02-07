import type { Passenger } from "../types/passenger.js";
import type {
  Special,
  SPECIAL,
  SpecialFlags,
  PassengerWithFlags,
} from "../types/special.js";

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
