import type { Board } from '../types/gameTypes.ts';

export function toggleFlag(board: Board, row: number, col: number): Board {
  const cell = board[row][col];

  // Если клетка уже открыта — флаг ставить нельзя
  if (cell.isOpen) return board;

  cell.isFlagged = !cell.isFlagged;

  return board;
}
