export type Cell = {
  row: number;
  col: number;
  isMine: boolean;
  isOpen: boolean;
  isFlagged: boolean;
  neighborMines: number;
};

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export type Board = Cell[][];

export type OpenResult = {
  board: Board;
  status: 'playing' | 'won' | 'lost';
};

export type PresetDifficulty = 'beginner' | 'intermediate' | 'expert';
