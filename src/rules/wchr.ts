// export function rullWCHR(){

import type { PassengerWithFlags } from "../types/special.js";

// }

export function getAllWCHR(passengers: PassengerWithFlags[]) {
  return passengers.filter((p) => p.special === "WCHR");
}
