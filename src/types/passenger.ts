import type { SeatNumber } from "./seats.js";
import type { PassengerWithFlags, Special } from "./special.js";

export interface Passenger {
  name: string;
  id: string;
  group: string[];
  weight: number;
  gender: Gender;
  special: Special;
  seat: string;
}

export type Gender = "M" | "F";

export type OutputPassenger = PassengerWithFlags & {
  seat: SeatNumber;
};
