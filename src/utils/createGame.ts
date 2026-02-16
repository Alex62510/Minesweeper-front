import { createEmptyBoard } from './createEmptyBoard';
import { placeMines } from './placeMines';
import { calculateNeighbors } from './calculateNeighbors';
import type { Board } from '../types/gameTypes.ts';

export function createGame(rows: number, cols: number, mines: number): Board {
  let board: Board = createEmptyBoard(rows, cols);
  board = placeMines(board, mines);
  board = calculateNeighbors(board);

  return board;
}
