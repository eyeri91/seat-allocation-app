import type { PassengerWithFlags } from "../types/special.js";
import type { Group } from "../types/groups.js";

export function makeGroup(passengers: PassengerWithFlags[]): Group[] {
  const groups: Group[] = [];
  const visited = new Set<string>();

  const passengerMap = new Map<string, PassengerWithFlags>();
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

    for (const id of groupMembersIds) {
      const member = passengerMap.get(id);
      if (member) {
        totalWeight += member.weight ?? false;
        hasWCHR ||= member.isWCHR ?? false;
        hasUMNR ||= member.isUMNR ?? false;
        hasMuslim ||= member.isMuslim ?? false;
        hasFemaleMuslim ||= member.isFemaleMuslim ?? false;
      }
    }

    groups.push({
      id: `grp-${groups.length + 1}`,
      membersIds: groupMembersIds,
      size: groupMembersIds.length,
      totalWeight,
      hasWCHR,
      hasUMNR,
      hasMuslim,
      hasFemaleMuslim,
    });
  }

  return groups;
}

export function isAlone(group: Group): boolean {
  return group.size === 1;
}
