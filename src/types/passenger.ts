import type { SpecialCategory } from "./special.js"

export interface Passenger {
    name: string,
    id: string,
    group: string[],
    weight: number,
    gender: Gender,
    special: SpecialCategory,
    seat: string
}

export type Gender = "M"|"F"

