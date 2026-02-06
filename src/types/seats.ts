export type Row = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type SeatCode = 
    | "A" | "B" | "C" 
    | "D" | "E" | "F" | "G"
    | "H" | "J" | "K"


export interface Seat {
    row: Row,
    seatCode: SeatCode
}
