import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";

export function makeGroup(passengers: Passenger[]): Group[] {
    const groups:Group[] = [];
    const visited = new Set<string>();

    for (const passenger of passengers) {
        if(visited.has(passenger.id)) continue;

        const members = new Set<string>();
        members.add(passenger.id);
        for (const m of passenger.group) members.add(m);

        const membersId = [...members];
        members.forEach(id=>visited.add(id))
        
        groups.push({
            id: `grp-${groups.length + 1}`,
            membersId,
            size: membersId.length
        })

    }

    return groups
}