import type { Board } from '../types/gameTypes.ts';

export function minesLeft(board: Board, totalMines: number): number {
  let flags = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) flags++;
    }
  }
  return totalMines - flags;
}
