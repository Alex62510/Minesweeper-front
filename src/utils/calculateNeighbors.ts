import type { Board } from '../types/gameTypes.ts';

export function calculateNeighbors(board: Board): Board {
  const rows = board.length;
  const cols = board[0].length;

  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c].isMine) continue;

      let count = 0;

      for (const [dr, dc] of directions) {
        const newR = r + dr;
        const newC = c + dc;

        if (
          newR >= 0 &&
          newR < rows &&
          newC >= 0 &&
          newC < cols &&
          board[newR][newC].isMine
        ) {
          count++;
        }
      }

      board[r][c].neighborMines = count;
    }
  }

  return board;
}
