import type { Board } from '../types/gameTypes.ts';

export function placeMines(board: Board, minesCount: number): Board {
  const rows = board.length;
  const cols = board[0].length;

  let placed = 0;

  while (placed < minesCount) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);

    if (!board[r][c].isMine) {
      board[r][c].isMine = true;
      placed++;
    }
  }

  return board;
}
