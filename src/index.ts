// src/index.ts
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// import { makeGroup } from "./domain/groups.js";
// import {
//   generateAllSeatNumbers,
//   createEmptySeatMap,
//   isAisleSeat,
// } from "./domain/seats.js";
import type { Passenger } from "./types/passenger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, "../data/dataset.json");
const raw = fs.readFileSync(dataPath, "utf-8");
const passengers = JSON.parse(raw) as Passenger[];

// // --- 콘솔 테스트 시작
// console.log("Passengers:", passengers.length);

// // 1) 그룹 테스트
// const groups = makeGroup(passengers);
// console.log("Groups:", groups.length);
// console.log("Sample group:", groups[0]);

// // 2) 좌석 번호 테스트
// const seatNumbers = generateAllSeatNumbers();
// console.log("Seat numbers:", seatNumbers.length);
// console.log("First seats:", seatNumbers.slice(0, 10));
// console.log("Last seats:", seatNumbers.slice(-10));

// // 3) SeatMap 테스트
// const seatMap = createEmptySeatMap(seatNumbers);
// console.log("SeatMap size:", seatMap.size);
// console.log("Seat 1A:", seatMap.get("1A" as any));

// // 4) aisle 테스트
// console.log("isAisleSeat 1C:", isAisleSeat({ row: 1, code: "C" } as any));
// console.log("isAisleSeat 1B:", isAisleSeat({ row: 1, code: "B" } as any));
