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

export type OpenResult = {
  board: Board;
  status: 'playing' | 'won' | 'lost';
};

export function openCell(board: Board, row: number, col: number): OpenResult {
  const cell = board[row][col];

  // если уже открыта или флаг — ничего не делаем
  if (cell.isOpen || cell.isFlagged) {
    return { board, status: 'playing' };
  }

  // если мина — проигрыш
  if (cell.isMine) {
    cell.isOpen = true;
    return { board, status: 'lost' };
  }

  // рекурсивное открытие
  floodFill(board, row, col);

  // проверка победы
  const isWon = checkWin(board);

  return {
    board,
    status: isWon ? 'won' : 'playing',
  };
}
function floodFill(board: Board, row: number, col: number) {
  const rows = board.length;
  const cols = board[0].length;

  const stack: [number, number][] = [[row, col]];

  while (stack.length > 0) {
    const [r, c] = stack.pop()!;
    const cell = board[r][c];

    if (cell.isOpen || cell.isFlagged) continue;

    cell.isOpen = true;

    // если есть число — не распространяемся дальше
    if (cell.neighborMines > 0) continue;

    // иначе открываем соседей
    for (const [dr, dc] of directions) {
      const newR = r + dr;
      const newC = c + dc;

      if (newR >= 0 && newR < rows && newC >= 0 && newC < cols) {
        stack.push([newR, newC]);
      }
    }
  }
}
function checkWin(board: Board): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isOpen) {
        return false;
      }
    }
  }
  return true;
}
