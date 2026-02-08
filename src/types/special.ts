import type { Passenger } from "./passenger.js";
import type { Group } from "./groups.js";
import type { SeatNumber } from "./seats.js";
import type { AssignedPassengerMap } from "./seats.js";

export type Special = "" | "WCHR" | "UMNR" | "Muslim";

export const SPECIAL = ["WCHR", "UMNR", "Muslim"] as Special[];

export interface SpecialFlags {
  isWCHR: boolean;
  isUMNR: boolean;
  isMuslim: boolean;
  isFemaleMuslim: boolean;
}

export type PassengerWithFlags = Passenger & SpecialFlags;

export type PassengerFlagKey = Extract<keyof PassengerWithFlags, `is${string}`>;
export type GroupSpecialKey = Extract<keyof Group, `has${string}`>;

export type AssignSpecialData<
  GroupKey extends GroupSpecialKey = GroupSpecialKey,
  PassengerKey extends PassengerFlagKey = PassengerFlagKey,
> = {
  groups: Group[];
  passengersByIds: Map<string, PassengerWithFlags>;
  availableSeatNumbers: SeatNumber[];
  assignedPassengerMap: AssignedPassengerMap;
  groupKey: GroupKey;
  flagKey: PassengerKey;
};

export type SpecialGroupAnchor = {
  groupId: string;
  anchorSeatNumbers: SeatNumber[];
  unassignedMembersId: string[];
};


export type AssignFemalesNextToInput = {
  assignedPassengerMap: AssignedPassengerMap;
  unassignedFemales: PassengerWithFlags[]; // ✅ 성공하면 여기서 제거됨
  isTarget: (p: PassengerWithFlags) => boolean; // ✅ 예: (p)=>p.isUMNR or (p)=>p.isFemaleMuslim

