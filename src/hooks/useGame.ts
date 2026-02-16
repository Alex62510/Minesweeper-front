import { useState, useEffect, useRef } from 'react';
import type { Board, GameStatus } from '../types/gameTypes.ts';
import { createGame } from '../utils/createGame.ts';
import { openCell, type OpenResult } from '../utils/openCell.ts';
import { toggleFlag } from '../utils/toggleFlag.ts';
import { autoOpenNeighbors } from '../utils/autoOpenNeighbors.ts';

interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
  difficulty: 'beginner' | 'intermediate' | 'expert';
}

export function useGame(config: GameConfig) {
  const [board, setBoard] = useState<Board>(() =>
    createGame(config.rows, config.cols, config.mines),
  );
  const [status, setStatus] = useState<GameStatus>('idle');
  const [time, setTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    const saved = localStorage.getItem(`bestTime_${config.difficulty}`);
    return saved ? Number(saved) : null;
  });

  const timerRef = useRef<number | null>(null);

  // Таймер
  useEffect(() => {
    if (status === 'playing') {
      timerRef.current = window.setInterval(
        () => setTime((prev) => prev + 1),
        1000,
      );
    }
    return () => {
      if (timerRef.current !== null) window.clearInterval(timerRef.current);
    };
  }, [status]);

  const resetGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setBoard(createGame(config.rows, config.cols, config.mines));
    setStatus('idle');
    setTime(0);
  };

  const handleOpenCell = (row: number, col: number) => {
    if (status === 'lost' || status === 'won') return;

    // первый клик запускает игру
    if (status === 'idle') setStatus('playing');

    const result: OpenResult = openCell(board, row, col);
    setBoard([...result.board]);
    setStatus(result.status);

    // если победа — обновляем рекорд
    if (result.status === 'won') {
      if (bestTime === null || time < bestTime) {
        localStorage.setItem(`bestTime_${config.difficulty}`, time.toString());
        setBestTime(time);
      }
    }
  };

  const handleToggleFlag = (row: number, col: number) => {
    if (status === 'lost' || status === 'won') return;
    const newBoard = toggleFlag(board, row, col);
    setBoard([...newBoard]);
  };

  const handleAutoOpen = (row: number, col: number) => {
    if (status !== 'playing') return;
    const result = autoOpenNeighbors(board, row, col);
    setBoard([...result.board]);
    setStatus(result.status as GameStatus);

    // если победа — обновляем рекорд
    if (result.status === 'won') {
      if (bestTime === null || time < bestTime) {
        localStorage.setItem(`bestTime_${config.difficulty}`, time.toString());
        setBestTime(time);
      }
    }
  };

  const minesLeft =
    config.mines - board.flat().filter((c) => c.isFlagged).length;

  return {
    board,
    status,
    time,
    bestTime,
    resetGame,
    handleOpenCell,
    handleToggleFlag,
    handleAutoOpen,
    minesLeft,
  };
}
