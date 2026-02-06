import type { Passenger } from "./passenger.js"

export type SpecialCategory = ""|"WCHR"|"UMNR"|"Muslim"


export interface SpecialFlags {
    isWCHR: boolean,
    isUMNR: boolean,
    isMuslim: boolean, 
    isFemaleMuslim: boolean 
}

export type SpecialPassenger = Passenger & SpecialFlags