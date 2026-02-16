import type { Board } from '../types/gameTypes.ts';

export function createEmptyBoard(rows: number, cols: number): Board {
  const board: Board = [];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isOpen: false,
        isFlagged: false,
        neighborMines: 0,
      });
    }
    board.push(row);
  }

  return board;
}
