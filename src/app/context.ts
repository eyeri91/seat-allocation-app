// src/app/context.ts
import type { SeatNumber } from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";
import type { Group } from "../types/groups.js";

export type AssignmentContext = {
  passengersByIds: Map<string, PassengerWithFlags>;
  groups: Group[];
  allAisleSeats: SeatNumber[];
  assignedPassengerMap: Map<SeatNumber, PassengerWithFlags>;
};
