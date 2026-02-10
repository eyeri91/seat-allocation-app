# Seat Allocation App

## Overview

This project implements a rule-based seat allocation program that assigns passengers to seats while respecting operational constraints such as wheelchair accessibility (WCHR), unaccompanied minors (UMNR), group seating, and adjacency rules.

Mandatory safety rules are applied first, followed by best-effort preference rules.

---

## How to Run

### Requirements

- Node.js (v18 or later)
- npm

### Steps

<pre> npm install 
npm run start  </pre>

The output will be generated at: `output/finalSeatmap.json`

The row-based seat map (`output/seatmapWithRow.json`) was retained for debugging and validation.  
It helped verify weight balancing logic, where seats within a row are not changed, but rows can be swapped to balance weight.  
The final submission output follows the original passenger JSON structure as required.

## Assumptions & Limitations

- Seat layout and aisle positions are fixed.
- Not all constraints can be satisfied at the same time.
- Safety and regulatory rules have priority over comfort or preference rules.
- Some group or adjacency rules are handled on a best-effort basis.

## Future Improvements

- Add support for additional special passenger types.
- Provide a simple visual representation of the seat map.

## Notes

The project was developed incrementally using GitHub issues to break down and track individual tasks.

### Repository:

https://github.com/USERNAME/REPOSITORY
