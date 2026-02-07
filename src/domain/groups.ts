import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";

export function makeGroup(passengers: Passenger[]): Group[] {
  const groups: Group[] = [];
  const visited = new Set<string>();

  const passengerMap = new Map<string, Passenger>();
  for (const p of passengers) passengerMap.set(p.id, p);

  for (const passenger of passengers) {
    if (visited.has(passenger.id)) continue;

    const members = new Set<string>();
    members.add(passenger.id);
    for (const m of passenger.group) members.add(m);

    const membersIds = [...members];
    members.forEach((id) => visited.add(id));

    let totalWeight = 0;
    for (const id of membersIds) {
      const member = passengerMap.get(id);
      if (member) totalWeight += member.weight;
    }

    groups.push({
      id: `grp-${groups.length + 1}`,
      membersIds,
      size: membersIds.length,
      totalWeight,
    });
  }

  return groups;
}
