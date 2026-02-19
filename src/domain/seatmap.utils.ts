import type { OutputPassenger, Passenger } from "../types/passenger.js";
import type {
  AssignedPassenger,
  SeatNumber,
  AssignedPassengerMap,
  OutputRow,
} from "../types/seats.js";
import { ROW, SEATCODE } from "../types/seats.js";
import type { PassengerWithFlags } from "../types/special.js";

export function createAssignedPassengerMap(): AssignedPassengerMap {
  return new Map<SeatNumber, AssignedPassenger>();
}

export function tryAssignSeatToPassenger(
  seatNumber: SeatNumber,
  passenger: PassengerWithFlags,
  groupId: string,
  assignedPassengerMap: AssignedPassengerMap,
): boolean {
  if (assignedPassengerMap.has(seatNumber)) return false;
  assignedPassengerMap.set(seatNumber, { passenger, groupId });
  return true;
}

export function getAssignedPassenger(
  seatNumber: SeatNumber,
  assignedPassengerMap: AssignedPassengerMap,
): AssignedPassenger {
  const assignedPassenger = assignedPassengerMap.get(seatNumber);
  if (!assignedPassenger) {
    throw new Error(`No passenger assigned to seat ${seatNumber}`);
  }
  return assignedPassenger;
}

export function assginRestPassengers(
  unassignedPassengers: PassengerWithFlags[],
  emptySeats: SeatNumber[],
  assignedPassengerMap: AssignedPassengerMap,
) {
  let assigned = 0;
  for (let i = 0; i < unassignedPassengers.length && i < emptySeats.length; ) {
    const pax = unassignedPassengers[i] as PassengerWithFlags;
    const seat = emptySeats.shift() as SeatNumber;

    const groupId = pax?.group[0] as string;
    const successful = tryAssignSeatToPassenger(
      seat,
      pax,
      groupId,
      assignedPassengerMap,
    );

    if (successful) {
      unassignedPassengers.splice(i, 1);
      assigned++;
    } else {
      i++;
    }
  }
}

export function buildSeatMapOutput(
  assignedPassengerMap: AssignedPassengerMap,
): Passenger[] {
  const paxIdToSeat = new Map<string, SeatNumber>();

  for (const [seat, assigned] of assignedPassengerMap.entries()) {
    paxIdToSeat.set(assigned.passenger.id, seat);
  }

  const finalSeatMap: Passenger[] = [];

  for (const [seat, assigned] of assignedPassengerMap.entries()) {
    const pax = assigned.passenger;
    const seat = paxIdToSeat.get(pax.id) ?? "";

    finalSeatMap.push({
      name: pax.name,
      id: pax.id,
      group: pax.group ?? [],
      weight: pax.weight,
      gender: pax.gender,
      special: pax.special ?? "",
      seat,
    });
  }

  return finalSeatMap;
}

export function buildSeatMapOutputByRow(
  assignedPassengerMap: AssignedPassengerMap,
): { rows: OutputRow[] } {
  const seatToPassenger = new Map<SeatNumber, Passenger>();

  for (const [seat, assigned] of assignedPassengerMap.entries()) {
    seatToPassenger.set(seat, assigned.passenger);
  }

  const rows: OutputRow[] = ROW.map((rowNumber) => {
    let totalWeight = 0;
    const seats = {} as Record<SeatNumber, OutputPassenger | null>;

    for (const code of SEATCODE) {
      const seatNumber = `${rowNumber}${code}` as SeatNumber;
      const pax = seatToPassenger.get(seatNumber) ?? null;

      if (!pax) {
        seats[seatNumber] = null;
        continue;
      }

      totalWeight += pax.weight;

      seats[seatNumber] = {
        seat: seatNumber,
        id: pax.id,
        name: pax.name,
        group: pax.group,
        weight: pax.weight,
        gender: pax.gender,
        special: pax.special,
      };
    }

    return {
      rowId: `row${rowNumber}`,
      rowNumber,
      totalWeight,
      seats,
    };
  });

  return { rows };
}
