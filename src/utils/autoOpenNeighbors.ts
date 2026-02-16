import { openCell } from './openCell';
import type { Board } from '../types/gameTypes.ts';

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

export function autoOpenNeighbors(board: Board, row: number, col: number) {
  const cell = board[row][col];

  // Если клетка не открыта или у неё нет числа — выходим
  if (!cell.isOpen || cell.neighborMines === 0)
    return { board, status: 'playing' };

  let flaggedCount = 0;

  for (const [dr, dc] of directions) {
    const newR = row + dr;
    const newC = col + dc;

    if (
      newR >= 0 &&
      newR < board.length &&
      newC >= 0 &&
      newC < board[0].length &&
      board[newR][newC].isFlagged
    ) {
      flaggedCount++;
    }
  }

  // Если количество флагов равно числу соседних мин — открываем все закрытые не-флаг клетки
  if (flaggedCount === cell.neighborMines) {
    let status: 'playing' | 'won' | 'lost' = 'playing';

    for (const [dr, dc] of directions) {
      const newR = row + dr;
      const newC = col + dc;
      const neighbor = board[newR]?.[newC];

      if (neighbor && !neighbor.isOpen && !neighbor.isFlagged) {
        const result = openCell(board, newR, newC);
        board = result.board;
        if (result.status === 'lost') status = 'lost';
      }
    }

    // Проверяем победу после открытия
    if (status !== 'lost') {
      const isWon = board.every((r) => r.every((c) => c.isMine || c.isOpen));
      if (isWon) status = 'won';
    }

    return { board, status };
  }

  return { board, status: 'playing' };
}
