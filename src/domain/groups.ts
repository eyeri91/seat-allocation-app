import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";

export function makeGroup(passengers: Passenger[]): Group[] {
    const groups:Group[] = [];
    const visited = new Set<string>();

    for (const passenger of passengers) {
        if(visited.has(passenger.id)) continue;

        const membersId: string[] = [];
        membersId.push(passenger.id);
        visited.add(passenger.id)
        
        if (passenger.group.length >0) {
            for (const member of passenger.group) {
                membersId.push(member)
                visited.add(member)
            }
        }
        
        groups.push({
            id: `grp-${groups.length + 1}`,
            membersId,
            size: membersId.length
        })

    }

    return groups
}