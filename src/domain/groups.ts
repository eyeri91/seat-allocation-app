import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";

export function makeGroup(passengers: Passenger[]): Group[] {
  const groups: Group[] = [];
  const visited = new Set<string>();

  const passengerMap = new Map<string, Passenger>();
  for (const p of passengers) passengerMap.set(p.id, p);

  for (const passenger of passengers) {
    if (visited.has(passenger.id)) continue;

    const groupMembers = new Set<string>();
    groupMembers.add(passenger.id);
    for (const m of passenger.group) groupMembers.add(m);

    const groupMembersIds = [...groupMembers];
    groupMembers.forEach((id) => visited.add(id));

    let totalWeight = 0;
    let hasWCHR = false;
    let hasUMNR = false;
    let hasMuslim = false;
    let hasFemaleMuslim = false;

    // for (const id of groupMembersIds) {
    //   const member = passengerMap.get(id);
    //   if (member) totalWeight += member.weight;
    //   if (member.)
    // }

    //     for (const m of membersIds) {
    //     passengersWithFlags.push({
    //       ...p,
    //       isWCHR: p.special === "WCHR",
    //       isUMNR: p.special === "UMNR",
    //       isMuslim: p.special === "Muslim",
    //       isFemaleMuslim: p.special === "Muslim" && p.gender === "F",
    //     });
    //   }

    groups.push({
      id: `grp-${groups.length + 1}`,
      membersIds: groupMembersIds,
      size: groupMembersIds.length,
      totalWeight,
    });
  }

  return groups;
}
