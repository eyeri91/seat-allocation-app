export interface Passenger {
    name: string,
    id: string,
    group: string[],
    weight: number,
    gender: "M"|"F",
    special: string,
    seat: string
}