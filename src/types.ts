export interface Passenger {
    name: string,
    id: string,
    group: string[],
    weight: number,
    gender: Gender,
    special: string,
    seat: string
}

export type Gender = "M"|"F"