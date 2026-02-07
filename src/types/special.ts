import type { Passenger } from "./passenger.js";

export type Special = "" | "WCHR" | "UMNR" | "Muslim";

export const SPECIAL = ["WCHR", "UMNR", "Muslim"] as Special[];

export interface SpecialFlags {
  isWCHR: boolean;
  isUMNR: boolean;
  isMuslim: boolean;
  isFemaleMuslim: boolean;
}

export type PassengersWithFlags = Passenger & SpecialFlags;
