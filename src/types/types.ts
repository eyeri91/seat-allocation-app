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

export type SpecialCategory = ""|"WCHR"|"UMNR"|"Muslim"

// if pax special, which special cat?
// isWCHR? isUMNR? isMuslim? isFemaleMuslim?
// type SpecialPassenger = if SpecialCategory -> which? 
// return the category -> create a function in domain

export interface SpecialPassenger {
    isWCHR: boolean,
    isUMNR: boolean,
    isMuslim: boolean, 
    isFemaleMuslim: boolean 
}