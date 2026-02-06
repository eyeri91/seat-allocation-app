import type { Passenger } from "../types/passenger.js";
import type { Group } from "../types/groups.js";

// export function makeGroup(passengers: Passenger[]): Group[]  {
// 1. Create a list called group
// 2. make a new group id (func)
// 3. Add everyone traveling together with this person to this group (func)
// 4. add this group to the group list
// 5. mark them visited(func)
// 6. iterate number 1 - 5 until we visit everyone
// 7. return Group[]
// }

export function makeGroup(passengers: Passenger[]): Group[] {
    const groups:Group[] = [];
    const checked = new Set<string>();

    for (const passenger of passengers) {
        if(checked.has(passenger.id)) continue;

        const members: string[] = [];
        members.push(passenger.id);
        // check group list. 
        // if list? iterate the list and add each ids into group
        // also do checked.add(passenger.id)for each 
        // if not list, 바로 그룹

        // groups.push ({id: , membersId: })

    }
    
    return groups
}